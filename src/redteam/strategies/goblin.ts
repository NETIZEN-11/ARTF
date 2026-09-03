import { createAdaptiveMultiTurnStrategy } from './hydra';

/**
 * Adds Goblin's Hydra-compatible adaptive provider to every generated case.
 * The provider and cloud task own the per-turn IICL-inspired behavior.
 */
export const addGoblin = createAdaptiveMultiTurnStrategy({
  providerName: 'artef:redteam:goblin',
  metricSuffix: 'Goblin',
  strategyId: 'jailbreak:goblin',
});
