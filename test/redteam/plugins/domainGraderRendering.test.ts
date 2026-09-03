import { describe, expect, it } from 'vitest';
import { getGraderById } from '../../../src/redteam/graders';
import { FinancialCalculationErrorPluginGrader } from '../../../src/redteam/plugins/financial/financialCalculationError';
import { FinancialComplianceViolationPluginGrader } from '../../../src/redteam/plugins/financial/financialComplianceViolation';
import { FinancialDataLeakagePluginGrader } from '../../../src/redteam/plugins/financial/financialDataLeakage';
import { FinancialHallucinationPluginGrader } from '../../../src/redteam/plugins/financial/financialHallucination';
import { FinancialJapanFieaSuitabilityPluginGrader } from '../../../src/redteam/plugins/financial/financialJapanFieaSuitability';
import { FinancialSycophancyPluginGrader } from '../../../src/redteam/plugins/financial/financialSycophancy';
import { InsuranceCoverageDiscriminationPluginGrader } from '../../../src/redteam/plugins/insurance/coverageDiscrimination';
import { InsuranceDataDisclosurePluginGrader } from '../../../src/redteam/plugins/insurance/dataDisclosure';
import { InsuranceNetworkMisinformationPluginGrader } from '../../../src/redteam/plugins/insurance/networkMisinformation';
import { InsurancePhiDisclosurePluginGrader } from '../../../src/redteam/plugins/insurance/phiDisclosure';
import { MedicalAnchoringBiasPluginGrader } from '../../../src/redteam/plugins/medical/medicalAnchoringBias';
import { MedicalHallucinationPluginGrader } from '../../../src/redteam/plugins/medical/medicalHallucination';
import { MedicalIncorrectKnowledgePluginGrader } from '../../../src/redteam/plugins/medical/medicalIncorrectKnowledge';
import { MedicalPrioritizationErrorPluginGrader } from '../../../src/redteam/plugins/medical/medicalPrioritizationError';
import { MedicalSycophancyPluginGrader } from '../../../src/redteam/plugins/medical/medicalSycophancy';
import { OffTopicPluginGrader } from '../../../src/redteam/plugins/offTopic';
import { PharmacyControlledSubstanceCompliancePluginGrader } from '../../../src/redteam/plugins/pharmacy/controlledSubstanceCompliance';
import { PharmacyDosageCalculationPluginGrader } from '../../../src/redteam/plugins/pharmacy/dosageCalculation';
import { PharmacyDrugInteractionPluginGrader } from '../../../src/redteam/plugins/pharmacy/drugInteraction';
import { RealEstateAccessibilityDiscriminationPluginGrader } from '../../../src/redteam/plugins/realestate/accessibilityDiscrimination';
import { RealEstateAdvertisingDiscriminationPluginGrader } from '../../../src/redteam/plugins/realestate/advertisingDiscrimination';
import { RealEstateDiscriminatoryListingsPluginGrader } from '../../../src/redteam/plugins/realestate/discriminatoryListings';
import { RealEstateFairHousingDiscriminationPluginGrader } from '../../../src/redteam/plugins/realestate/fairHousingDiscrimination';
import { RealEstateLendingDiscriminationPluginGrader } from '../../../src/redteam/plugins/realestate/lendingDiscrimination';
import { RealEstateSourceOfIncomePluginGrader } from '../../../src/redteam/plugins/realestate/sourceOfIncome';
import { RealEstateSteeringPluginGrader } from '../../../src/redteam/plugins/realestate/steering';
import { RealEstateValuationBiasPluginGrader } from '../../../src/redteam/plugins/realestate/valuationBias';

type RubricVars = {
  purpose: string;
  prompt: string;
  output: string;
};

type RenderingGrader = {
  id: string;
  renderRubric: (vars: RubricVars) => string;
};

const RENDERING_GRADERS: [string, string, new () => RenderingGrader][] = [
  [
    'financial calculation error',
    'artef:redteam:financial:calculation-error',
    FinancialCalculationErrorPluginGrader,
  ],
  [
    'financial compliance violation',
    'artef:redteam:financial:compliance-violation',
    FinancialComplianceViolationPluginGrader,
  ],
  [
    'financial data leakage',
    'artef:redteam:financial:data-leakage',
    FinancialDataLeakagePluginGrader,
  ],
  [
    'financial hallucination',
    'artef:redteam:financial:hallucination',
    FinancialHallucinationPluginGrader,
  ],
  [
    'financial japan fiea suitability',
    'artef:redteam:financial:japan-fiea-suitability',
    FinancialJapanFieaSuitabilityPluginGrader,
  ],
  ['financial sycophancy', 'artef:redteam:financial:sycophancy', FinancialSycophancyPluginGrader],
  [
    'insurance coverage discrimination',
    'artef:redteam:insurance:coverage-discrimination',
    InsuranceCoverageDiscriminationPluginGrader,
  ],
  [
    'insurance data disclosure',
    'artef:redteam:insurance:data-disclosure',
    InsuranceDataDisclosurePluginGrader,
  ],
  [
    'insurance network misinformation',
    'artef:redteam:insurance:network-misinformation',
    InsuranceNetworkMisinformationPluginGrader,
  ],
  [
    'insurance phi disclosure',
    'artef:redteam:insurance:phi-disclosure',
    InsurancePhiDisclosurePluginGrader,
  ],
  [
    'medical anchoring bias',
    'artef:redteam:medical:anchoring-bias',
    MedicalAnchoringBiasPluginGrader,
  ],
  [
    'medical hallucination',
    'artef:redteam:medical:hallucination',
    MedicalHallucinationPluginGrader,
  ],
  [
    'medical incorrect knowledge',
    'artef:redteam:medical:incorrect-knowledge',
    MedicalIncorrectKnowledgePluginGrader,
  ],
  [
    'medical prioritization error',
    'artef:redteam:medical:prioritization-error',
    MedicalPrioritizationErrorPluginGrader,
  ],
  ['medical sycophancy', 'artef:redteam:medical:sycophancy', MedicalSycophancyPluginGrader],
  ['off topic', 'artef:redteam:off-topic', OffTopicPluginGrader],
  [
    'pharmacy controlled substance compliance',
    'artef:redteam:pharmacy:controlled-substance-compliance',
    PharmacyControlledSubstanceCompliancePluginGrader,
  ],
  [
    'pharmacy dosage calculation',
    'artef:redteam:pharmacy:dosage-calculation',
    PharmacyDosageCalculationPluginGrader,
  ],
  [
    'pharmacy drug interaction',
    'artef:redteam:pharmacy:drug-interaction',
    PharmacyDrugInteractionPluginGrader,
  ],
  [
    'real estate accessibility discrimination',
    'artef:redteam:realestate:accessibility-discrimination',
    RealEstateAccessibilityDiscriminationPluginGrader,
  ],
  [
    'real estate advertising discrimination',
    'artef:redteam:realestate:advertising-discrimination',
    RealEstateAdvertisingDiscriminationPluginGrader,
  ],
  [
    'real estate discriminatory listings',
    'artef:redteam:realestate:discriminatory-listings',
    RealEstateDiscriminatoryListingsPluginGrader,
  ],
  [
    'real estate fair housing discrimination',
    'artef:redteam:realestate:fair-housing-discrimination',
    RealEstateFairHousingDiscriminationPluginGrader,
  ],
  [
    'real estate lending discrimination',
    'artef:redteam:realestate:lending-discrimination',
    RealEstateLendingDiscriminationPluginGrader,
  ],
  [
    'real estate source of income',
    'artef:redteam:realestate:source-of-income',
    RealEstateSourceOfIncomePluginGrader,
  ],
  ['real estate steering', 'artef:redteam:realestate:steering', RealEstateSteeringPluginGrader],
  [
    'real estate valuation bias',
    'artef:redteam:realestate:valuation-bias',
    RealEstateValuationBiasPluginGrader,
  ],
];

describe('domain-specific grader rendering', () => {
  const vars = {
    purpose: 'Sentinel purpose for rubric interpolation',
    prompt: 'Sentinel attack prompt for rubric interpolation',
    output: 'Sentinel model output for rubric interpolation',
  };

  it.each(RENDERING_GRADERS)(
    '%s is registered under its canonical grader id',
    (_, expectedId, GraderClass) => {
      const grader = new GraderClass();

      expect(grader.id).toBe(expectedId);
      expect(getGraderById(expectedId)).toBeInstanceOf(GraderClass);
    },
  );

  it.each(RENDERING_GRADERS)(
    '%s renders runtime context and decision fields',
    (_, __, GraderClass) => {
      const rubric = new GraderClass().renderRubric(vars);

      expect(rubric).toContain(vars.purpose);
      expect(rubric).toContain(vars.prompt);
      expect(rubric).toContain(vars.output);
      expect(rubric).toContain('# Goal');
      expect(rubric).toContain('# Instructions');
      expect(rubric).toContain('# Output Format');
      expect(rubric).toContain('"reason":');
      expect(rubric).toContain('"score":');
      expect(rubric).toContain('"pass":');
    },
  );
});
