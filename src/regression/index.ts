import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '../database';
import { evalResultsTable, evalsTable } from '../database/tables';

import type Eval from '../models/eval';
import type { BaselineComparisonResult, EvaluateSummaryV2 } from '../types/index';

export interface RegressionDetectionOptions {
  scoreThreshold?: number;
  passRateThreshold?: number;
  safetyThreshold?: number;
  securityThreshold?: number;
  latencyThreshold?: number;
  costThreshold?: number;
}

const DEFAULT_OPTIONS: RegressionDetectionOptions = {
  scoreThreshold: 0.05,
  passRateThreshold: 5,
  safetyThreshold: 0.1,
  securityThreshold: 0.1,
  latencyThreshold: 1000,
  costThreshold: 0.1,
};

export class RegressionDetector {
  private options: RegressionDetectionOptions;

  constructor(options: RegressionDetectionOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async compareWithBaseline(
    currentEval: Eval,
    baselineEvalId: string,
  ): Promise<BaselineComparisonResult> {
    const baselineEval = await this.getEvalById(baselineEvalId);
    if (!baselineEval) {
      throw new Error(`Baseline evaluation not found: ${baselineEvalId}`);
    }

    const currentResults = await this.getEvalResults(currentEval.id);
    const baselineResults = await this.getEvalResults(baselineEvalId);

    const currentStats = this.calculateStats(currentResults);
    const baselineStats = this.calculateStats(baselineResults);

    const comparison = this.compareResults(
      currentResults,
      baselineResults,
      currentStats,
      baselineStats,
    );

    return {
      baselineEvalId,
      currentEvalId: currentEval.id,
      ...comparison,
    };
  }

  async findBaseline(
    config: Partial<{ tags: Record<string, string>; model: string; provider: string }>,
  ): Promise<string | null> {
    const db = await getDb();

    // Query all evals and filter in memory since config is JSON
    const evals = await db.select().from(evalsTable).orderBy(desc(evalsTable.createdAt)).limit(100);

    for (const evalRecord of evals) {
      const evalConfig = evalRecord.config as Record<string, unknown> | undefined;
      if (!evalConfig) continue;

      let matches = true;

      if (config.model && evalConfig.model !== config.model) {
        matches = false;
      }

      if (config.provider && evalConfig.provider !== config.provider) {
        matches = false;
      }

      if (config.tags) {
        const evalTags = evalConfig.tags as Record<string, string> | undefined;
        if (evalTags) {
          for (const [key, value] of Object.entries(config.tags)) {
            if (evalTags[key] !== value) {
              matches = false;
              break;
            }
          }
        } else {
          matches = false;
        }
      }

      if (matches) {
        return evalRecord.id;
      }
    }

    return null;
  }

  private async getEvalById(evalId: string): Promise<Eval | null> {
    const db = await getDb();
    const evals = await db.select().from(evalsTable).where(eq(evalsTable.id, evalId)).limit(1);

    if (evals.length === 0) return null;

    // Import Eval model dynamically
    const { default: EvalModel } = await import('../models/eval');
    const evalRecord = await EvalModel.findById(evalId);
    return evalRecord ?? null;
  }

  private async getEvalResults(evalId: string): Promise<any[]> {
    const db = await getDb();
    return db.select().from(evalResultsTable).where(eq(evalResultsTable.evalId, evalId));
  }

  private calculateStats(results: any[]): {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    passRate: number;
    averageScore: number;
    averageLatencyMs: number;
    totalCost: number;
    safetyScore: number;
    securityScore: number;
  } {
    const total = results.length;
    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => r.failureReason === 1).length;
    const errors = results.filter((r) => r.failureReason === 2).length;
    const passRate = total > 0 ? (passed / total) * 100 : 100;
    const averageScore =
      total > 0 ? results.reduce((sum, r) => sum + (r.score || 0), 0) / total : 0;
    const averageLatencyMs =
      total > 0 ? results.reduce((sum, r) => sum + (r.latencyMs || 0), 0) / total : 0;
    const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);

    const safetyResults = results.filter(
      (r) => r.testCase?.metadata?.category === 'safety' || r.metadata?.category === 'safety',
    );
    const safetyPassed = safetyResults.filter((r) => r.success).length;
    const safetyScore =
      safetyResults.length > 0 ? (safetyPassed / safetyResults.length) * 100 : 100;

    const securityResults = results.filter(
      (r) => r.testCase?.metadata?.category === 'security' || r.metadata?.category === 'security',
    );
    const securityPassed = securityResults.filter((r) => r.success).length;
    const securityScore =
      securityResults.length > 0 ? (securityPassed / securityResults.length) * 100 : 100;

    return {
      total,
      passed,
      failed,
      errors,
      passRate,
      averageScore,
      averageLatencyMs,
      totalCost,
      safetyScore,
      securityScore,
    };
  }

  private compareResults(
    currentResults: any[],
    baselineResults: any[],
    currentStats: any,
    baselineStats: any,
  ): Omit<BaselineComparisonResult, 'baselineEvalId' | 'currentEvalId'> {
    const baselineMap = new Map<string, any>();
    for (const result of baselineResults) {
      const key = `${result.promptIdx}-${result.testIdx}`;
      baselineMap.set(key, result);
    }

    let newFailures = 0;
    let resolvedFailures = 0;
    const regressedTests: string[] = [];
    const improvedTests: string[] = [];

    for (const current of currentResults) {
      const key = `${current.promptIdx}-${current.testIdx}`;
      const baseline = baselineMap.get(key);

      if (!baseline) continue;

      const wasPassing = baseline.success;
      const isPassing = current.success;

      if (wasPassing && !isPassing) {
        newFailures++;
        regressedTests.push(key);
      } else if (!wasPassing && isPassing) {
        resolvedFailures++;
        improvedTests.push(key);
      }
    }

    const scoreChange = currentStats.averageScore - baselineStats.averageScore;
    const safetyChange = currentStats.safetyScore - baselineStats.safetyScore;
    const securityChange = currentStats.securityScore - baselineStats.securityScore;
    const performanceChange = currentStats.averageLatencyMs - baselineStats.averageLatencyMs;
    const costChange = currentStats.totalCost - baselineStats.totalCost;

    const isScoreRegression = scoreChange < -this.options.scoreThreshold!;
    const isPassRateRegression =
      baselineStats.passRate - currentStats.passRate > this.options.passRateThreshold!;
    const isSafetyRegression = safetyChange < -this.options.safetyThreshold! * 100;
    const isSecurityRegression = securityChange < -this.options.securityThreshold! * 100;
    const isPerformanceRegression = performanceChange > this.options.latencyThreshold!;
    const isCostRegression = costChange > this.options.costThreshold!;

    return {
      newFailures,
      resolvedFailures,
      scoreChange,
      safetyChange,
      securityChange,
      performanceChange,
      costChange,
      regressedTests,
      improvedTests,
      isRegression:
        isScoreRegression ||
        isPassRateRegression ||
        isSafetyRegression ||
        isSecurityRegression ||
        isPerformanceRegression ||
        isCostRegression,
      regressionDetails: {
        score: isScoreRegression,
        passRate: isPassRateRegression,
        safety: isSafetyRegression,
        security: isSecurityRegression,
        performance: isPerformanceRegression,
        cost: isCostRegression,
      },
    };
  }

  async detectRegressions(
    currentEval: Eval,
    baselineEvalId?: string,
  ): Promise<{
    hasRegression: boolean;
    comparison: BaselineComparisonResult | null;
    details: Record<string, boolean>;
  }> {
    let targetBaselineId: string | null = baselineEvalId ?? null;

    if (!targetBaselineId) {
      targetBaselineId = await this.findBaseline({
        model: (currentEval.config as any)?.model as string | undefined,
        provider: (currentEval.config as any)?.provider as string | undefined,
      });
    }

    if (!targetBaselineId) {
      return {
        hasRegression: false,
        comparison: null,
        details: {},
      };
    }

    const comparison = await this.compareWithBaseline(currentEval, targetBaselineId);

    return {
      hasRegression: comparison.isRegression || false,
      comparison,
      details: comparison.regressionDetails || {},
    };
  }
}

export function createRegressionDetector(options?: RegressionDetectionOptions): RegressionDetector {
  return new RegressionDetector(options);
}
