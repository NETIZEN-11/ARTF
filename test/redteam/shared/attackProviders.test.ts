import { describe, expect, it } from 'vitest';
import {
  ATTACK_PROVIDER_IDS,
  getAttackProviderFullId,
  isAttackProvider,
  isMultiTurnStrategy,
} from '../../../src/redteam/shared/attackProviders';

describe('attackProviders', () => {
  describe('ATTACK_PROVIDER_IDS', () => {
    it('should contain all expected multi-turn attack providers', () => {
      expect(ATTACK_PROVIDER_IDS).toContain('hydra');
      expect(ATTACK_PROVIDER_IDS).toContain('goblin');
      expect(ATTACK_PROVIDER_IDS).toContain('crescendo');
      expect(ATTACK_PROVIDER_IDS).toContain('goat');
      expect(ATTACK_PROVIDER_IDS).toContain('custom');
    });

    it('should contain all expected single-turn iterative attack providers', () => {
      expect(ATTACK_PROVIDER_IDS).toContain('iterative');
      expect(ATTACK_PROVIDER_IDS).toContain('iterative:meta');
      expect(ATTACK_PROVIDER_IDS).toContain('iterative:tree');
    });

    it('should not contain unsupported strategies', () => {
      expect(ATTACK_PROVIDER_IDS).not.toContain('mischievous-user');
    });
  });

  describe('isAttackProvider', () => {
    describe('multi-turn conversation providers', () => {
      it('should return true for hydra variants', () => {
        expect(isAttackProvider('hydra')).toBe(true);
        expect(isAttackProvider('jailbreak:hydra')).toBe(true);
        expect(isAttackProvider('artef:redteam:hydra')).toBe(true);
      });

      it('should return true for goblin variants', () => {
        expect(isAttackProvider('goblin')).toBe(true);
        expect(isAttackProvider('jailbreak:goblin')).toBe(true);
        expect(isAttackProvider('artef:redteam:goblin')).toBe(true);
      });

      it('should return true for crescendo variants', () => {
        expect(isAttackProvider('crescendo')).toBe(true);
        expect(isAttackProvider('artef:redteam:crescendo')).toBe(true);
      });

      it('should return true for goat variants', () => {
        expect(isAttackProvider('goat')).toBe(true);
        expect(isAttackProvider('artef:redteam:goat')).toBe(true);
      });

      it('should return true for custom variants', () => {
        expect(isAttackProvider('custom')).toBe(true);
        expect(isAttackProvider('custom:my-custom')).toBe(true);
        expect(isAttackProvider('artef:redteam:custom')).toBe(true);
      });
    });

    describe('multi-attempt single-turn providers', () => {
      it('should return true for iterative (base jailbreak)', () => {
        expect(isAttackProvider('iterative')).toBe(true);
        expect(isAttackProvider('jailbreak')).toBe(true);
        expect(isAttackProvider('artef:redteam:iterative')).toBe(true);
      });

      it('should return true for iterative:meta (jailbreak:meta)', () => {
        expect(isAttackProvider('iterative:meta')).toBe(true);
        expect(isAttackProvider('jailbreak:meta')).toBe(true);
        expect(isAttackProvider('artef:redteam:iterative:meta')).toBe(true);
      });

      it('should return true for iterative:tree (jailbreak:tree)', () => {
        expect(isAttackProvider('iterative:tree')).toBe(true);
        expect(isAttackProvider('jailbreak:tree')).toBe(true);
        expect(isAttackProvider('artef:redteam:iterative:tree')).toBe(true);
      });
    });

    describe('non-attack providers', () => {
      it('should return false for transform strategies', () => {
        expect(isAttackProvider('base64')).toBe(false);
        expect(isAttackProvider('rot13')).toBe(false);
        expect(isAttackProvider('hex')).toBe(false);
        expect(isAttackProvider('audio')).toBe(false);
        expect(isAttackProvider('image')).toBe(false);
      });

      it('should return false for unsupported attack strategies', () => {
        expect(isAttackProvider('mischievous-user')).toBe(false);
      });

      it('should return false for basic and other non-attack strategies', () => {
        expect(isAttackProvider('basic')).toBe(false);
        expect(isAttackProvider('default')).toBe(false);
        expect(isAttackProvider('unknown')).toBe(false);
      });
    });
  });

  describe('getAttackProviderFullId', () => {
    describe('already full IDs', () => {
      it('should return the same ID if already full', () => {
        expect(getAttackProviderFullId('artef:redteam:hydra')).toBe('artef:redteam:hydra');
        expect(getAttackProviderFullId('artef:redteam:iterative')).toBe('artef:redteam:iterative');
        expect(getAttackProviderFullId('artef:redteam:iterative:meta')).toBe(
          'artef:redteam:iterative:meta',
        );
      });
    });

    describe('jailbreak variants', () => {
      it('should convert jailbreak (base) to artef:redteam:iterative', () => {
        expect(getAttackProviderFullId('jailbreak')).toBe('artef:redteam:iterative');
      });

      it('should convert jailbreak:meta to artef:redteam:iterative:meta', () => {
        expect(getAttackProviderFullId('jailbreak:meta')).toBe('artef:redteam:iterative:meta');
      });

      it('should convert jailbreak:tree to artef:redteam:iterative:tree', () => {
        expect(getAttackProviderFullId('jailbreak:tree')).toBe('artef:redteam:iterative:tree');
      });

      it('should convert jailbreak:hydra to artef:redteam:hydra', () => {
        expect(getAttackProviderFullId('jailbreak:hydra')).toBe('artef:redteam:hydra');
      });

      it('should convert jailbreak:goblin to artef:redteam:goblin', () => {
        expect(getAttackProviderFullId('jailbreak:goblin')).toBe('artef:redteam:goblin');
      });
    });

    describe('custom variants', () => {
      it('should convert custom to artef:redteam:custom', () => {
        expect(getAttackProviderFullId('custom')).toBe('artef:redteam:custom');
      });

      it('should convert custom:variant to artef:redteam:custom', () => {
        expect(getAttackProviderFullId('custom:my-custom')).toBe('artef:redteam:custom');
      });
    });

    describe('short IDs', () => {
      it('should convert short IDs to full IDs', () => {
        expect(getAttackProviderFullId('hydra')).toBe('artef:redteam:hydra');
        expect(getAttackProviderFullId('goblin')).toBe('artef:redteam:goblin');
        expect(getAttackProviderFullId('crescendo')).toBe('artef:redteam:crescendo');
        expect(getAttackProviderFullId('goat')).toBe('artef:redteam:goat');
      });
    });
  });

  describe('isMultiTurnStrategy', () => {
    it('should return true for multi-turn strategies', () => {
      expect(isMultiTurnStrategy('hydra')).toBe(true);
      expect(isMultiTurnStrategy('goblin')).toBe(true);
      expect(isMultiTurnStrategy('crescendo')).toBe(true);
      expect(isMultiTurnStrategy('goat')).toBe(true);
    });

    it('should handle various ID formats', () => {
      expect(isMultiTurnStrategy('jailbreak:hydra')).toBe(true);
      expect(isMultiTurnStrategy('artef:redteam:hydra')).toBe(true);
      expect(isMultiTurnStrategy('jailbreak:goblin')).toBe(true);
      expect(isMultiTurnStrategy('artef:redteam:goblin')).toBe(true);
    });

    it('should return false for non-multi-turn strategies', () => {
      expect(isMultiTurnStrategy('base64')).toBe(false);
      expect(isMultiTurnStrategy('basic')).toBe(false);
    });
  });
});
