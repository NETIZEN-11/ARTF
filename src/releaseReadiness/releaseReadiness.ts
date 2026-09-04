import { createHumanReviewQueue } from '../humanReview';
import { evaluateQualityGates } from '../qualityGate';
import { createRegressionDetector } from '../regression';

import type Eval from '../models/eval';
import type {
  BaselineComparisonResult,
  HumanReviewItem,
  QualityGateEvaluationResult,
  ReleaseReadinessInfo,
  ReleaseReadinessStatus,
} from '../types/index';

export interface ReleaseReadinessOptions {
  qualityGateConfig?: Partial<{
    thresholds: Record<string, number>;
    enabled: boolean;
  }>;
  regressionConfig?: Partial<{
    scoreThreshold: number;
    passRateThreshold: number;
    safetyThreshold: number;
    securityThreshold: number;
    latencyThreshold: number;
    costThreshold: number;
  }>;
  humanReviewConfig?: Partial<{
    autoRouteLowConfidence: boolean;
    confidenceThreshold: number;
    autoRouteCriticalFindings: boolean;
  }>;
}

export class ReleaseReadinessCalculator {
  private options: ReleaseReadinessOptions;

  constructor(options: ReleaseReadinessOptions = {}) {
    this.options = options;
  }

  async calculate(evalRecord: Eval): Promise<ReleaseReadinessInfo> {
    const qualityGateResult = await evaluateQualityGates(evalRecord, evalRecord.config as any);

    const regressionDetector = createRegressionDetector(this.options.regressionConfig);
    const regressionResult = await regressionDetector.detectRegressions(evalRecord);

    const humanReviewQueue = createHumanReviewQueue(this.options.humanReviewConfig);
    const pendingReviews = await humanReviewQueue.getPendingReviews(evalRecord.id);

    const criticalFindingsCount = await this.countCriticalFindings(evalRecord);

    const status = this.determineStatus(
      qualityGateResult,
      regressionResult,
      pendingReviews,
      criticalFindingsCount,
    );

    return {
      status,
      qualityGateResult,
      baselineComparison: regressionResult.comparison || undefined,
      criticalFindingsCount,
      humanReviewPending: pendingReviews.length > 0,
      timestamp: new Date().toISOString(),
    };
  }

  private async countCriticalFindings(evalRecord: Eval): Promise<number> {
    const results = await evalRecord.getResults();
    let count = 0;

    for (const result of results) {
      const severity = result.metadata?.severity || result.gradingResult?.metadata?.severity;
      if (severity === 'critical') count++;
    }

    return count;
  }

  private determineStatus(
    qualityGateResult: QualityGateEvaluationResult,
    regressionResult: { hasRegression: boolean; comparison: BaselineComparisonResult | null },
    pendingReviews: HumanReviewItem[],
    criticalFindingsCount: number,
  ): ReleaseReadinessStatus {
    if (qualityGateResult.overall === 'failed' || criticalFindingsCount > 0) {
      return 'blocked';
    }

    if (pendingReviews.length > 0 || regressionResult.hasRegression) {
      return 'needs-review';
    }

    if (qualityGateResult.overall === 'warning') {
      return 'ready-with-warning';
    }

    return 'ready';
  }

  static getStatusDisplayName(status: ReleaseReadinessStatus): string {
    const names: Record<ReleaseReadinessStatus, string> = {
      ready: 'Ready for Release',
      'ready-with-warning': 'Ready with Warnings',
      'needs-review': 'Needs Review',
      blocked: 'Release Blocked',
    };
    return names[status];
  }

  static getStatusColor(status: ReleaseReadinessStatus): string {
    const colors: Record<ReleaseReadinessStatus, string> = {
      ready: 'green',
      'ready-with-warning': 'yellow',
      'needs-review': 'orange',
      blocked: 'red',
    };
    return colors[status];
  }

  static getStatusDescription(status: ReleaseReadinessStatus): string {
    const descriptions: Record<ReleaseReadinessStatus, string> = {
      ready: 'All quality gates passed. No critical findings or pending reviews.',
      'ready-with-warning':
        'Quality gates passed with warnings. Review recommended before release.',
      'needs-review': 'Human review required or regression detected. Manual approval needed.',
      blocked: 'Critical quality gate failures or findings. Release blocked.',
    };
    return descriptions[status];
  }
}

export function createReleaseReadinessCalculator(
  options?: ReleaseReadinessOptions,
): ReleaseReadinessCalculator {
  return new ReleaseReadinessCalculator(options);
}
