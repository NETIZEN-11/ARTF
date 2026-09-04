import type Eval from '../models/eval';
import type { QualityGateConfig, QualityGateThresholds, UnifiedConfig } from '../types/index';

export interface QualityGateCheck {
  name: string;
  description: string;
  evaluate: (
    evalRecord: Eval,
    thresholds: QualityGateThresholds,
  ) => Promise<QualityGateCheckResult>;
}

export interface QualityGateCheckResult {
  name: string;
  passed: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  details?: Record<string, unknown>;
  metricValue?: number;
  thresholdValue?: number;
}

export interface QualityGateEvaluationResult {
  overall: 'passed' | 'failed' | 'warning';
  checks: QualityGateCheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

const DEFAULT_THRESHOLDS: QualityGateThresholds = {
  minPassRate: 100,
  maxFailureRate: 0,
  minOverallScore: 0,
  maxCriticalFindings: 0,
  maxHighSeverityFindings: 0,
  minSafetyScore: 0,
  minSecurityScore: 0,
  maxRegressionScore: 0,
  maxLatencyMs: 0,
  maxCostUsd: 0,
  requireHumanReviewCompletion: false,
};

export class QualityGateEngine {
  private checks: QualityGateCheck[] = [];
  private thresholds: QualityGateThresholds;

  constructor(thresholds: Partial<QualityGateThresholds> = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.registerDefaultChecks();
  }

  private registerDefaultChecks(): void {
    this.checks = [
      {
        name: 'passRate',
        description: 'Minimum pass rate threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const stats = this.computeEvalStats(evalRecord);
          const passRate =
            stats.totalTests > 0 ? (stats.passedTests / stats.totalTests) * 100 : 100;

          return {
            name: 'passRate',
            passed: passRate >= thresholds.minPassRate!,
            severity: passRate < thresholds.minPassRate! ? 'critical' : 'info',
            message: `Pass rate: ${passRate.toFixed(2)}% (threshold: ${thresholds.minPassRate}%)`,
            metricValue: passRate,
            thresholdValue: thresholds.minPassRate,
            details: {
              total: stats.totalTests,
              passed: stats.passedTests,
              failed: stats.failedTests,
              errors: stats.errorTests,
            },
          };
        },
      },
      {
        name: 'failureRate',
        description: 'Maximum failure rate threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const stats = this.computeEvalStats(evalRecord);
          const failureRate =
            stats.totalTests > 0 ? (stats.failedTests / stats.totalTests) * 100 : 0;

          return {
            name: 'failureRate',
            passed: failureRate <= thresholds.maxFailureRate!,
            severity: failureRate > thresholds.maxFailureRate! ? 'critical' : 'info',
            message: `Failure rate: ${failureRate.toFixed(2)}% (threshold: ${thresholds.maxFailureRate}%)`,
            metricValue: failureRate,
            thresholdValue: thresholds.maxFailureRate,
            details: {
              total: stats.totalTests,
              failed: stats.failedTests,
              passed: stats.passedTests,
            },
          };
        },
      },
      {
        name: 'overallScore',
        description: 'Minimum overall score threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const stats = this.computeEvalStats(evalRecord);
          const overallScore = stats.averageScore ?? 0;

          return {
            name: 'overallScore',
            passed: overallScore >= thresholds.minOverallScore!,
            severity: overallScore < thresholds.minOverallScore! ? 'high' : 'info',
            message: `Overall score: ${overallScore.toFixed(2)} (threshold: ${thresholds.minOverallScore})`,
            metricValue: overallScore,
            thresholdValue: thresholds.minOverallScore,
          };
        },
      },
      {
        name: 'criticalFindings',
        description: 'Maximum critical findings threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const criticalCount = await this.countFindingsBySeverity(evalRecord, 'critical');

          return {
            name: 'criticalFindings',
            passed: criticalCount <= thresholds.maxCriticalFindings!,
            severity: criticalCount > thresholds.maxCriticalFindings! ? 'critical' : 'info',
            message: `Critical findings: ${criticalCount} (threshold: ${thresholds.maxCriticalFindings})`,
            metricValue: criticalCount,
            thresholdValue: thresholds.maxCriticalFindings,
            details: { criticalFindings: criticalCount },
          };
        },
      },
      {
        name: 'highSeverityFindings',
        description: 'Maximum high severity findings threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const highCount = await this.countFindingsBySeverity(evalRecord, 'high');

          return {
            name: 'highSeverityFindings',
            passed: highCount <= thresholds.maxHighSeverityFindings!,
            severity: highCount > thresholds.maxHighSeverityFindings! ? 'high' : 'info',
            message: `High severity findings: ${highCount} (threshold: ${thresholds.maxHighSeverityFindings})`,
            metricValue: highCount,
            thresholdValue: thresholds.maxHighSeverityFindings,
            details: { highFindings: highCount },
          };
        },
      },
      {
        name: 'safetyScore',
        description: 'Minimum safety score threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const safetyScore = await this.calculateSafetyScore(evalRecord);

          return {
            name: 'safetyScore',
            passed: safetyScore >= thresholds.minSafetyScore!,
            severity: safetyScore < thresholds.minSafetyScore! ? 'critical' : 'info',
            message: `Safety score: ${safetyScore.toFixed(2)} (threshold: ${thresholds.minSafetyScore})`,
            metricValue: safetyScore,
            thresholdValue: thresholds.minSafetyScore,
          };
        },
      },
      {
        name: 'securityScore',
        description: 'Minimum security score threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const securityScore = await this.calculateSecurityScore(evalRecord);

          return {
            name: 'securityScore',
            passed: securityScore >= thresholds.minSecurityScore!,
            severity: securityScore < thresholds.minSecurityScore! ? 'critical' : 'info',
            message: `Security score: ${securityScore.toFixed(2)} (threshold: ${thresholds.minSecurityScore})`,
            metricValue: securityScore,
            thresholdValue: thresholds.minSecurityScore,
          };
        },
      },
      {
        name: 'regressionScore',
        description: 'Maximum regression score threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const regressionScore = await this.calculateRegressionScore(evalRecord);

          return {
            name: 'regressionScore',
            passed: regressionScore <= thresholds.maxRegressionScore!,
            severity: regressionScore > thresholds.maxRegressionScore! ? 'high' : 'info',
            message: `Regression score: ${regressionScore.toFixed(2)} (threshold: ${thresholds.maxRegressionScore})`,
            metricValue: regressionScore,
            thresholdValue: thresholds.maxRegressionScore,
          };
        },
      },
      {
        name: 'latency',
        description: 'Maximum latency threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const stats = this.computeEvalStats(evalRecord);
          const avgLatency = stats.averageLatencyMs ?? 0;

          return {
            name: 'latency',
            passed: avgLatency <= thresholds.maxLatencyMs! || thresholds.maxLatencyMs! === 0,
            severity:
              avgLatency > thresholds.maxLatencyMs! && thresholds.maxLatencyMs! > 0
                ? 'medium'
                : 'info',
            message: `Average latency: ${avgLatency}ms (threshold: ${thresholds.maxLatencyMs}ms)`,
            metricValue: avgLatency,
            thresholdValue: thresholds.maxLatencyMs,
          };
        },
      },
      {
        name: 'cost',
        description: 'Maximum cost threshold',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          const stats = this.computeEvalStats(evalRecord);
          const totalCost = stats.totalCostUsd ?? 0;

          return {
            name: 'cost',
            passed: totalCost <= thresholds.maxCostUsd! || thresholds.maxCostUsd! === 0,
            severity:
              totalCost > thresholds.maxCostUsd! && thresholds.maxCostUsd! > 0 ? 'medium' : 'info',
            message: `Total cost: $${totalCost.toFixed(4)} (threshold: $${thresholds.maxCostUsd})`,
            metricValue: totalCost,
            thresholdValue: thresholds.maxCostUsd,
          };
        },
      },
      {
        name: 'humanReviewCompletion',
        description: 'Require human review completion for flagged results',
        evaluate: async (evalRecord: Eval, thresholds: QualityGateThresholds) => {
          if (!thresholds.requireHumanReviewCompletion) {
            return {
              name: 'humanReviewCompletion',
              passed: true,
              severity: 'info',
              message: 'Human review completion not required',
            };
          }

          const pendingReviews = await this.countPendingHumanReviews(evalRecord);

          return {
            name: 'humanReviewCompletion',
            passed: pendingReviews === 0,
            severity: pendingReviews > 0 ? 'high' : 'info',
            message: `Pending human reviews: ${pendingReviews} (threshold: 0)`,
            metricValue: pendingReviews,
            thresholdValue: 0,
            details: { pendingReviews },
          };
        },
      },
    ];
  }

  private computeEvalStats(evalRecord: Eval): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    errorTests: number;
    averageScore: number;
    averageLatencyMs: number;
    totalCostUsd: number;
  } {
    const stats = evalRecord.getStats();
    const prompts = evalRecord.getPrompts();

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let errorTests = 0;
    let totalScore = 0;
    let scoreCount = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    let totalCost = 0;

    for (const prompt of prompts) {
      const metrics = prompt.metrics;
      if (metrics) {
        totalTests += metrics.testPassCount + metrics.testFailCount + metrics.testErrorCount;
        passedTests += metrics.testPassCount;
        failedTests += metrics.testFailCount;
        errorTests += metrics.testErrorCount;

        if (metrics.score !== undefined) {
          totalScore += metrics.score;
          scoreCount++;
        }

        if (metrics.totalLatencyMs !== undefined) {
          totalLatency += metrics.totalLatencyMs;
          latencyCount++;
        }

        totalCost += metrics.cost ?? 0;
      }
    }

    return {
      totalTests,
      passedTests,
      failedTests,
      errorTests,
      averageScore: scoreCount > 0 ? totalScore / scoreCount : 0,
      averageLatencyMs: latencyCount > 0 ? totalLatency / latencyCount : 0,
      totalCostUsd: totalCost,
    };
  }

  private async countFindingsBySeverity(evalRecord: Eval, severity: string): Promise<number> {
    const results = await evalRecord.getResults();
    let count = 0;

    for (const result of results) {
      const resultSeverity = result.metadata?.severity || result.gradingResult?.metadata?.severity;
      if (resultSeverity === severity) {
        count++;
      }
      if (
        result.failureReason &&
        result.failureReason.toString().toLowerCase().includes(severity)
      ) {
        count++;
      }
    }

    return count;
  }

  private async calculateSafetyScore(evalRecord: Eval): Promise<number> {
    const results = await evalRecord.getResults();
    let safetyTests = 0;
    let safetyPassed = 0;

    for (const result of results) {
      const isSafetyTest =
        result.testCase?.metadata?.category === 'safety' ||
        result.testCase?.metadata?.tags?.includes('safety') ||
        result.prompt?.label?.toLowerCase().includes('safety');

      if (isSafetyTest) {
        safetyTests++;
        if (result.success) safetyPassed++;
      }
    }

    return safetyTests > 0 ? (safetyPassed / safetyTests) * 100 : 100;
  }

  private async calculateSecurityScore(evalRecord: Eval): Promise<number> {
    const results = await evalRecord.getResults();
    let securityTests = 0;
    let securityPassed = 0;

    for (const result of results) {
      const isSecurityTest =
        result.testCase?.metadata?.category === 'security' ||
        result.testCase?.metadata?.tags?.includes('security') ||
        result.prompt?.label?.toLowerCase().includes('security') ||
        result.metadata?.pluginId?.includes('security');

      if (isSecurityTest) {
        securityTests++;
        if (result.success) securityPassed++;
      }
    }

    return securityTests > 0 ? (securityPassed / securityTests) * 100 : 100;
  }

  private async calculateRegressionScore(evalRecord: Eval): Promise<number> {
    const results = await evalRecord.getResults();
    let regressedTests = 0;
    let totalCompared = 0;

    for (const result of results) {
      if (result.metadata?.baselineComparison !== undefined) {
        totalCompared++;
        if (result.metadata.baselineComparison === 'regressed') {
          regressedTests++;
        }
      }
    }

    return totalCompared > 0 ? (regressedTests / totalCompared) * 100 : 0;
  }

  private async countPendingHumanReviews(evalRecord: Eval): Promise<number> {
    const results = await evalRecord.getResults();
    let pending = 0;

    for (const result of results) {
      if (result.metadata?.requiresHumanReview && !result.metadata?.humanReviewCompleted) {
        pending++;
      }
    }

    return pending;
  }

  async evaluate(evalRecord: Eval): Promise<QualityGateEvaluationResult> {
    const checkResults: QualityGateCheckResult[] = [];

    for (const check of this.checks) {
      try {
        const result = await check.evaluate(evalRecord, this.thresholds);
        checkResults.push(result);
      } catch (error) {
        checkResults.push({
          name: check.name,
          passed: false,
          severity: 'high',
          message: `Check "${check.name}" failed: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    const passed = checkResults.filter((r) => r.passed).length;
    const failed = checkResults.filter(
      (r) => !r.passed && ['critical', 'high'].includes(r.severity),
    ).length;
    const warnings = checkResults.filter(
      (r) => !r.passed && ['medium', 'low'].includes(r.severity),
    ).length;

    let overall: 'passed' | 'failed' | 'warning' = 'passed';
    if (failed > 0) overall = 'failed';
    else if (warnings > 0) overall = 'warning';

    return {
      overall,
      checks: checkResults,
      summary: {
        total: checkResults.length,
        passed,
        failed,
        warnings,
      },
    };
  }

  getThresholds(): QualityGateThresholds {
    return { ...this.thresholds };
  }

  setThresholds(thresholds: Partial<QualityGateThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  addCheck(check: QualityGateCheck): void {
    this.checks.push(check);
  }

  removeCheck(name: string): void {
    this.checks = this.checks.filter((c) => c.name !== name);
  }
}

export function createQualityGateEngineFromConfig(config: UnifiedConfig): QualityGateEngine {
  const qualityGateConfig = config.qualityGate as QualityGateConfig | undefined;
  const thresholds = qualityGateConfig?.thresholds ?? {};

  return new QualityGateEngine(thresholds);
}

export async function evaluateQualityGates(
  evalRecord: Eval,
  config: UnifiedConfig,
): Promise<QualityGateEvaluationResult> {
  const engine = createQualityGateEngineFromConfig(config);
  return engine.evaluate(evalRecord);
}
