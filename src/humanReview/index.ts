import { randomUUID } from 'crypto';

import { eq, sql } from 'drizzle-orm';
import { getDb } from '../database';
import { evalsTable } from '../database/tables';

import type { HumanReviewDecision, HumanReviewItem } from '../types/index';

export interface HumanReviewQueueOptions {
  autoRouteLowConfidence?: boolean;
  confidenceThreshold?: number;
  autoRouteCriticalFindings?: boolean;
  reviewers?: string[];
}

const DEFAULT_OPTIONS: HumanReviewQueueOptions = {
  autoRouteLowConfidence: true,
  confidenceThreshold: 0.7,
  autoRouteCriticalFindings: true,
  reviewers: [],
};

export class HumanReviewQueue {
  private options: HumanReviewQueueOptions;

  constructor(options: HumanReviewQueueOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async routeForReview(
    evalId: string,
    testIdx: number,
    promptIdx: number,
    reason: string,
    metadata: Record<string, unknown> = {},
  ): Promise<HumanReviewItem> {
    const reviewItem: HumanReviewItem = {
      id: randomUUID(),
      evalId,
      testIdx,
      promptIdx,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata,
    };

    await this.persistReviewItem(reviewItem);
    return reviewItem;
  }

  async getPendingReviews(evalId?: string): Promise<HumanReviewItem[]> {
    const db = await getDb();
    const evals = await db
      .select()
      .from(evalsTable)
      .where(evalId ? eq(evalsTable.id, evalId) : undefined);

    const reviews: HumanReviewItem[] = [];
    for (const evalRecord of evals) {
      const reviewMetadata = (evalRecord as any).metadata as Record<string, unknown> | undefined;
      if (reviewMetadata?.humanReviews) {
        const pendingReviews = (reviewMetadata.humanReviews as HumanReviewItem[]).filter(
          (r) => r.status === 'pending' && (!evalId || r.evalId === evalId),
        );
        reviews.push(...pendingReviews);
      }
    }

    return reviews;
  }

  async getReviewById(reviewId: string): Promise<HumanReviewItem | null> {
    const db = await getDb();
    const evals = await db.select().from(evalsTable).where(eq(evalsTable.id, reviewId));

    for (const evalRecord of evals) {
      const reviewMetadata = (evalRecord as any).metadata as Record<string, unknown> | undefined;
      if (reviewMetadata?.humanReviews) {
        const review = (reviewMetadata.humanReviews as HumanReviewItem[]).find(
          (r) => r.id === reviewId,
        );
        if (review) return review;
      }
    }

    return null;
  }

  async completeReview(
    reviewId: string,
    reviewer: string,
    decision: HumanReviewDecision,
    comment?: string,
  ): Promise<HumanReviewItem> {
    const reviewItem = await this.getReviewById(reviewId);
    if (!reviewItem) {
      throw new Error(`Review not found: ${reviewId}`);
    }

    reviewItem.status = 'completed';
    reviewItem.reviewer = reviewer;
    reviewItem.decision = decision;
    reviewItem.comment = comment;
    reviewItem.completedAt = new Date().toISOString();

    await this.persistReviewItem(reviewItem);
    return reviewItem;
  }

  async dismissReview(
    reviewId: string,
    reviewer: string,
    reason: string,
  ): Promise<HumanReviewItem> {
    const reviewItem = await this.getReviewById(reviewId);
    if (!reviewItem) {
      throw new Error(`Review not found: ${reviewId}`);
    }

    reviewItem.status = 'dismissed';
    reviewItem.reviewer = reviewer;
    reviewItem.comment = `Dismissed: ${reason}`;
    reviewItem.completedAt = new Date().toISOString();

    await this.persistReviewItem(reviewItem);
    return reviewItem;
  }

  async autoRouteResults(evalId: string, results: any[]): Promise<HumanReviewItem[]> {
    const routed: HumanReviewItem[] = [];

    for (const result of results) {
      if (await this.shouldRouteForReview(result)) {
        const reason = this.getRouteReason(result);
        const item = await this.routeForReview(evalId, result.testIdx, result.promptIdx, reason, {
          result: this.sanitizeResultForReview(result),
        });
        routed.push(item);
      }
    }

    return routed;
  }

  private async shouldRouteForReview(result: any): Promise<boolean> {
    if (this.options.autoRouteCriticalFindings) {
      const severity = result.metadata?.severity || result.gradingResult?.metadata?.severity;
      if (severity === 'critical') return true;
    }

    if (this.options.autoRouteLowConfidence) {
      const confidence = result.gradingResult?.metadata?.confidence;
      if (
        typeof confidence === 'number' &&
        confidence < (this.options.confidenceThreshold || 0.7)
      ) {
        return true;
      }
    }

    if (result.gradingResult?.metadata?.graderError === true) {
      return true;
    }

    if (result.metadata?.conflictingSignals === true) {
      return true;
    }

    if (result.metadata?.ambiguous === true) {
      return true;
    }

    return false;
  }

  private getRouteReason(result: any): string {
    const reasons: string[] = [];

    const severity = result.metadata?.severity || result.gradingResult?.metadata?.severity;
    if (severity === 'critical') {
      reasons.push('Critical severity finding');
    }

    const confidence = result.gradingResult?.metadata?.confidence;
    if (typeof confidence === 'number' && confidence < (this.options.confidenceThreshold || 0.7)) {
      reasons.push(`Low confidence (${(confidence * 100).toFixed(0)}%)`);
    }

    if (result.gradingResult?.metadata?.graderError === true) {
      reasons.push('Grader error / schema invalid');
    }

    if (result.metadata?.conflictingSignals === true) {
      reasons.push('Conflicting evaluation signals');
    }

    if (result.metadata?.ambiguous === true) {
      reasons.push('Ambiguous result');
    }

    return reasons.join('; ') || 'Automated review routing';
  }

  private sanitizeResultForReview(result: any): Record<string, unknown> {
    return {
      testCase: result.testCase,
      response: result.response,
      expected: result.testCase?.expected,
      success: result.success,
      score: result.score,
      gradingResult: result.gradingResult,
      metadata: result.metadata,
      prompt: result.prompt,
      provider: result.provider,
    };
  }

  private async persistReviewItem(item: HumanReviewItem): Promise<void> {
    const db = await getDb();
    const evalRecord = await db
      .select()
      .from(evalsTable)
      .where(eq(evalsTable.id, item.evalId))
      .limit(1);

    if (evalRecord.length === 0) {
      throw new Error(`Eval not found: ${item.evalId}`);
    }

    const existingMetadata = ((evalRecord[0] as any).metadata as Record<string, unknown>) || {};
    const humanReviews = (existingMetadata.humanReviews as HumanReviewItem[]) || [];

    const existingIndex = humanReviews.findIndex(
      (r) =>
        r.evalId === item.evalId && r.testIdx === item.testIdx && r.promptIdx === item.promptIdx,
    );

    if (existingIndex >= 0) {
      humanReviews[existingIndex] = item;
    } else {
      humanReviews.push(item);
    }

    await db.run(sql`
      UPDATE evals 
      SET metadata = ${JSON.stringify({ ...existingMetadata, humanReviews })} 
      WHERE id = ${item.evalId}
    `);
  }
}

export function createHumanReviewQueue(options?: HumanReviewQueueOptions): HumanReviewQueue {
  return new HumanReviewQueue(options);
}
