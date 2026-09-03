import { AegisGrader } from './plugins/aegis';
import { REDTEAM_MEMORY_POISONING_PLUGIN_ID } from './plugins/agentic/constants';
import { MemoryPoisoningPluginGrader } from './plugins/agentic/memoryPoisoning';
import { AsciiSmugglingGrader } from './plugins/asciiSmuggling';
import { BeavertailsGrader } from './plugins/beavertails';
import { BflaGrader } from './plugins/bfla';
import { BiasGrader } from './plugins/bias';
import { BolaGrader } from './plugins/bola';
import { createCodingAgentGraders } from './plugins/codingAgent/graders';
import { CompetitorsGrader } from './plugins/competitors';
import { CoppaGrader } from './plugins/compliance/coppa';
import { FerpaGrader } from './plugins/compliance/ferpa';
import { CcaGrader } from './plugins/contextComplianceAttack';
import { ContractsGrader } from './plugins/contracts';
import { CrossSessionLeakGrader } from './plugins/crossSessionLeak';
import { DataExfilGrader } from './plugins/dataExfil';
import { DebugAccessGrader } from './plugins/debugAccess';
import { DivergentRepetitionGrader } from './plugins/divergentRepetition';
import { EcommerceComplianceBypassGrader } from './plugins/ecommerce/ecommerceComplianceBypass';
import { EcommerceOrderFraudGrader } from './plugins/ecommerce/ecommerceOrderFraud';
import { EcommercePciDssGrader } from './plugins/ecommerce/ecommercePciDss';
import { EcommercePriceManipulationGrader } from './plugins/ecommerce/ecommercePriceManipulation';
import { ExcessiveAgencyGrader } from './plugins/excessiveAgency';
import { FinancialCalculationErrorPluginGrader } from './plugins/financial/financialCalculationError';
import { FinancialComplianceViolationPluginGrader } from './plugins/financial/financialComplianceViolation';
import { FinancialConfidentialDisclosurePluginGrader } from './plugins/financial/financialConfidentialDisclosure';
import { FinancialCounterfactualPluginGrader } from './plugins/financial/financialCounterfactual';
import { FinancialDataLeakagePluginGrader } from './plugins/financial/financialDataLeakage';
import { FinancialDefamationPluginGrader } from './plugins/financial/financialDefamation';
import { FinancialHallucinationPluginGrader } from './plugins/financial/financialHallucination';
import { FinancialImpartialityPluginGrader } from './plugins/financial/financialImpartiality';
import { FinancialJapanFieaSuitabilityPluginGrader } from './plugins/financial/financialJapanFieaSuitability';
import { FinancialMisconductPluginGrader } from './plugins/financial/financialMisconduct';
import { FinancialSoxCompliancePluginGrader } from './plugins/financial/financialSoxCompliance';
import { FinancialSycophancyPluginGrader } from './plugins/financial/financialSycophancy';
import { GoalMisalignmentGrader } from './plugins/goalMisalignment';
import { HallucinationGrader } from './plugins/hallucination';
import { HarmbenchGrader } from './plugins/harmbench';
import {
  ChildExploitationGrader,
  CopyrightViolationGrader,
  CybercrimeGrader,
  GraphicContentGrader,
  HarmfulGrader,
  HarmfulPrivacyGrader,
  HateGrader,
  IllegalActivitiesGrader,
  IllegalDrugsGrader,
  IndiscriminateWeaponsGrader,
  InsultsGrader,
  MisinformationDisinformationGrader,
  NonViolentCrimeGrader,
  ProfanityGrader,
  RadicalizationGrader,
  SelfHarmGrader,
  SexCrimeGrader,
  SexualContentGrader,
  SpecializedAdviceGrader,
  UnsafePracticesGrader,
  ViolentCrimeGrader,
} from './plugins/harmful/graders';
import { HijackingGrader } from './plugins/hijacking';
import { ImitationGrader } from './plugins/imitation';
import { IndirectPromptInjectionGrader } from './plugins/indirectPromptInjection';
import { InsuranceCoverageDiscriminationPluginGrader } from './plugins/insurance/coverageDiscrimination';
import { InsuranceDataDisclosurePluginGrader } from './plugins/insurance/dataDisclosure';
import { InsuranceNetworkMisinformationPluginGrader } from './plugins/insurance/networkMisinformation';
import { InsurancePhiDisclosurePluginGrader } from './plugins/insurance/phiDisclosure';
import { IntentGrader } from './plugins/intent';
import { MCPPluginGrader } from './plugins/mcp';
import { MedicalAnchoringBiasPluginGrader } from './plugins/medical/medicalAnchoringBias';
import { MedicalFdaAiDisclosurePluginGrader } from './plugins/medical/medicalFdaAiDisclosure';
import { MedicalFdaCyberAccessControlPluginGrader } from './plugins/medical/medicalFdaCyberAccessControl';
import { MedicalFdaCyberAuditTamperingPluginGrader } from './plugins/medical/medicalFdaCyberAuditTampering';
import { MedicalHallucinationPluginGrader } from './plugins/medical/medicalHallucination';
import { MedicalIncorrectKnowledgePluginGrader } from './plugins/medical/medicalIncorrectKnowledge';
import { MedicalOffLabelUsePluginGrader } from './plugins/medical/medicalOffLabelUse';
import { MedicalPrioritizationErrorPluginGrader } from './plugins/medical/medicalPrioritizationError';
import { MedicalSycophancyPluginGrader } from './plugins/medical/medicalSycophancy';
import { ModelIdentificationGrader } from './plugins/modelIdentification';
import { OffTopicPluginGrader } from './plugins/offTopic';
import { OverrelianceGrader } from './plugins/overreliance';
import { PharmacyControlledSubstanceCompliancePluginGrader } from './plugins/pharmacy/controlledSubstanceCompliance';
import { PharmacyDosageCalculationPluginGrader } from './plugins/pharmacy/dosageCalculation';
import { PharmacyDrugInteractionPluginGrader } from './plugins/pharmacy/drugInteraction';
import { PiiGrader } from './plugins/pii';
import { PlinyGrader } from './plugins/pliny';
import { PolicyViolationGrader } from './plugins/policy/index';
import { PoliticsGrader } from './plugins/politics';
import { PromptExtractionGrader } from './plugins/promptExtraction';
import { RagDocumentExfiltrationGrader } from './plugins/ragDocumentExfiltration';
import { RagSourceAttributionGrader } from './plugins/ragSourceAttribution';
import { RbacGrader } from './plugins/rbac';
import { RealEstateAccessibilityDiscriminationPluginGrader } from './plugins/realestate/accessibilityDiscrimination';
import { RealEstateAdvertisingDiscriminationPluginGrader } from './plugins/realestate/advertisingDiscrimination';
import { RealEstateDiscriminatoryListingsPluginGrader } from './plugins/realestate/discriminatoryListings';
import { RealEstateFairHousingDiscriminationPluginGrader } from './plugins/realestate/fairHousingDiscrimination';
import { RealEstateLendingDiscriminationPluginGrader } from './plugins/realestate/lendingDiscrimination';
import { RealEstateSourceOfIncomePluginGrader } from './plugins/realestate/sourceOfIncome';
import { RealEstateSteeringPluginGrader } from './plugins/realestate/steering';
import { RealEstateValuationBiasPluginGrader } from './plugins/realestate/valuationBias';
import { ReasoningDosGrader } from './plugins/reasoningDos';
import { ReligionGrader } from './plugins/religion';
import { ShellInjectionGrader } from './plugins/shellInjection';
import { SqlInjectionGrader } from './plugins/sqlInjection';
import { SsrfGrader } from './plugins/ssrf';
import { TeenSafetyAgeRestrictedGoodsAndServicesPluginGrader } from './plugins/teenSafety/ageRestrictedGoodsAndServices';
import { TeenSafetyDangerousContentPluginGrader } from './plugins/teenSafety/dangerousContent';
import { TeenSafetyDangerousRoleplayPluginGrader } from './plugins/teenSafety/dangerousRoleplay';
import { TeenSafetyHarmfulBodyIdealsPluginGrader } from './plugins/teenSafety/harmfulBodyIdeals';
import { TelecomAccessibilityViolationPluginGrader } from './plugins/telecom/accessibilityViolation';
import { TelecomAccountTakeoverPluginGrader } from './plugins/telecom/accountTakeover';
import { TelecomBillingMisinformationPluginGrader } from './plugins/telecom/billingMisinformation';
import { TelecomCoverageMisinformationPluginGrader } from './plugins/telecom/coverageMisinformation';
import { TelecomCpniDisclosurePluginGrader } from './plugins/telecom/cpniDisclosure';
import { TelecomE911MisinformationPluginGrader } from './plugins/telecom/e911Misinformation';
import { TelecomFraudEnablementPluginGrader } from './plugins/telecom/fraudEnablement';
import { TelecomLawEnforcementRequestHandlingPluginGrader } from './plugins/telecom/lawEnforcementRequestHandling';
import { TelecomLocationDisclosurePluginGrader } from './plugins/telecom/locationDisclosure';
import { TelecomPortingMisinformationPluginGrader } from './plugins/telecom/portingMisinformation';
import { TelecomTcpaViolationPluginGrader } from './plugins/telecom/tcpaViolation';
import { TelecomUnauthorizedChangesPluginGrader } from './plugins/telecom/unauthorizedChanges';
import { ToolDiscoveryGrader } from './plugins/toolDiscovery';
import { ToxicChatGrader } from './plugins/toxicChat';
import { UnsafeBenchGrader } from './plugins/unsafebench';
import { UnverifiableClaimsGrader } from './plugins/unverifiableClaims';
import { VLGuardGrader } from './plugins/vlguard';
import { VLSUGrader } from './plugins/vlsu';
import { WordplayGrader } from './plugins/wordplay';

import type { RedteamGraderBase } from './plugins/base';
import type { RedteamAssertionTypes } from './types';

export const GRADERS: Record<RedteamAssertionTypes, RedteamGraderBase> = {
  [REDTEAM_MEMORY_POISONING_PLUGIN_ID]: new MemoryPoisoningPluginGrader(),
  'artef:redteam:aegis': new AegisGrader(),
  'artef:redteam:ascii-smuggling': new AsciiSmugglingGrader(),
  'artef:redteam:beavertails': new BeavertailsGrader(),
  'artef:redteam:bfla': new BflaGrader(),
  'artef:redteam:bias': new BiasGrader(),
  'artef:redteam:bias:age': new BiasGrader(),
  'artef:redteam:bias:disability': new BiasGrader(),
  'artef:redteam:bias:gender': new BiasGrader(),
  'artef:redteam:bias:race': new BiasGrader(),
  'artef:redteam:bola': new BolaGrader(),
  'artef:redteam:cca': new CcaGrader(),
  'artef:redteam:competitors': new CompetitorsGrader(),
  'artef:redteam:contracts': new ContractsGrader(),
  'artef:redteam:coppa': new CoppaGrader(),
  'artef:redteam:cross-session-leak': new CrossSessionLeakGrader(),
  'artef:redteam:data-exfil': new DataExfilGrader(),
  'artef:redteam:debug-access': new DebugAccessGrader(),
  'artef:redteam:divergent-repetition': new DivergentRepetitionGrader(),
  'artef:redteam:ecommerce:compliance-bypass': new EcommerceComplianceBypassGrader(),
  'artef:redteam:ecommerce:order-fraud': new EcommerceOrderFraudGrader(),
  'artef:redteam:ecommerce:pci-dss': new EcommercePciDssGrader(),
  'artef:redteam:ecommerce:price-manipulation': new EcommercePriceManipulationGrader(),
  'artef:redteam:excessive-agency': new ExcessiveAgencyGrader(),
  'artef:redteam:ferpa': new FerpaGrader(),
  'artef:redteam:financial:calculation-error': new FinancialCalculationErrorPluginGrader(),
  'artef:redteam:financial:compliance-violation': new FinancialComplianceViolationPluginGrader(),
  'artef:redteam:financial:confidential-disclosure':
    new FinancialConfidentialDisclosurePluginGrader(),
  'artef:redteam:financial:counterfactual': new FinancialCounterfactualPluginGrader(),
  'artef:redteam:financial:data-leakage': new FinancialDataLeakagePluginGrader(),
  'artef:redteam:financial:defamation': new FinancialDefamationPluginGrader(),
  'artef:redteam:financial:hallucination': new FinancialHallucinationPluginGrader(),
  'artef:redteam:financial:impartiality': new FinancialImpartialityPluginGrader(),
  'artef:redteam:financial:japan-fiea-suitability': new FinancialJapanFieaSuitabilityPluginGrader(),
  'artef:redteam:financial:misconduct': new FinancialMisconductPluginGrader(),
  'artef:redteam:financial:sox-compliance': new FinancialSoxCompliancePluginGrader(),
  'artef:redteam:financial:sycophancy': new FinancialSycophancyPluginGrader(),
  'artef:redteam:goal-misalignment': new GoalMisalignmentGrader(),
  'artef:redteam:hallucination': new HallucinationGrader(),
  'artef:redteam:harmbench': new HarmbenchGrader(),
  'artef:redteam:harmful': new HarmfulGrader(),
  'artef:redteam:harmful:chemical-biological-weapons': new HarmfulGrader(),
  'artef:redteam:harmful:child-exploitation': new ChildExploitationGrader(),
  'artef:redteam:harmful:copyright-violations': new CopyrightViolationGrader(),
  'artef:redteam:harmful:cybercrime': new CybercrimeGrader(),
  'artef:redteam:harmful:cybercrime:malicious-code': new CybercrimeGrader(),
  'artef:redteam:harmful:graphic-content': new GraphicContentGrader(),
  'artef:redteam:harmful:harassment-bullying': new HarmfulGrader(),
  'artef:redteam:harmful:hate': new HateGrader(),
  'artef:redteam:harmful:illegal-activities': new IllegalActivitiesGrader(),
  'artef:redteam:harmful:illegal-drugs': new IllegalDrugsGrader(),
  'artef:redteam:harmful:illegal-drugs:meth': new IllegalDrugsGrader(),
  'artef:redteam:harmful:indiscriminate-weapons': new IndiscriminateWeaponsGrader(),
  'artef:redteam:harmful:insults': new InsultsGrader(),
  'artef:redteam:harmful:intellectual-property': new CopyrightViolationGrader(),
  'artef:redteam:harmful:misinformation-disinformation': new MisinformationDisinformationGrader(),
  'artef:redteam:harmful:non-violent-crime': new NonViolentCrimeGrader(),
  'artef:redteam:harmful:privacy': new HarmfulPrivacyGrader(),
  'artef:redteam:harmful:profanity': new ProfanityGrader(),
  'artef:redteam:harmful:radicalization': new RadicalizationGrader(),
  'artef:redteam:harmful:self-harm': new SelfHarmGrader(),
  'artef:redteam:harmful:sex-crime': new SexCrimeGrader(),
  'artef:redteam:harmful:sexual-content': new SexualContentGrader(),
  'artef:redteam:harmful:specialized-advice': new SpecializedAdviceGrader(),
  'artef:redteam:harmful:unsafe-practices': new UnsafePracticesGrader(),
  'artef:redteam:harmful:violent-crime': new ViolentCrimeGrader(),
  'artef:redteam:harmful:weapons:ied': new HarmfulGrader(),
  'artef:redteam:hijacking': new HijackingGrader(),
  'artef:redteam:imitation': new ImitationGrader(),
  'artef:redteam:indirect-prompt-injection': new IndirectPromptInjectionGrader(),
  'artef:redteam:insurance:coverage-discrimination':
    new InsuranceCoverageDiscriminationPluginGrader(),
  'artef:redteam:insurance:data-disclosure': new InsuranceDataDisclosurePluginGrader(),
  'artef:redteam:insurance:network-misinformation':
    new InsuranceNetworkMisinformationPluginGrader(),
  'artef:redteam:insurance:phi-disclosure': new InsurancePhiDisclosurePluginGrader(),
  'artef:redteam:intent': new IntentGrader(),
  'artef:redteam:mcp': new MCPPluginGrader(),
  'artef:redteam:model-identification': new ModelIdentificationGrader(),
  'artef:redteam:medical:anchoring-bias': new MedicalAnchoringBiasPluginGrader(),
  'artef:redteam:medical:fda:ai-disclosure': new MedicalFdaAiDisclosurePluginGrader(),
  'artef:redteam:medical:fda:cyber-access-control': new MedicalFdaCyberAccessControlPluginGrader(),
  'artef:redteam:medical:fda:cyber-audit-tampering':
    new MedicalFdaCyberAuditTamperingPluginGrader(),
  'artef:redteam:medical:hallucination': new MedicalHallucinationPluginGrader(),
  'artef:redteam:medical:incorrect-knowledge': new MedicalIncorrectKnowledgePluginGrader(),
  'artef:redteam:medical:off-label-use': new MedicalOffLabelUsePluginGrader(),
  'artef:redteam:medical:prioritization-error': new MedicalPrioritizationErrorPluginGrader(),
  'artef:redteam:medical:sycophancy': new MedicalSycophancyPluginGrader(),
  'artef:redteam:off-topic': new OffTopicPluginGrader(),
  'artef:redteam:pharmacy:controlled-substance-compliance':
    new PharmacyControlledSubstanceCompliancePluginGrader(),
  'artef:redteam:pharmacy:dosage-calculation': new PharmacyDosageCalculationPluginGrader(),
  'artef:redteam:pharmacy:drug-interaction': new PharmacyDrugInteractionPluginGrader(),
  'artef:redteam:telecom:cpni-disclosure': new TelecomCpniDisclosurePluginGrader(),
  'artef:redteam:telecom:location-disclosure': new TelecomLocationDisclosurePluginGrader(),
  'artef:redteam:telecom:account-takeover': new TelecomAccountTakeoverPluginGrader(),
  'artef:redteam:telecom:e911-misinformation': new TelecomE911MisinformationPluginGrader(),
  'artef:redteam:telecom:tcpa-violation': new TelecomTcpaViolationPluginGrader(),
  'artef:redteam:telecom:unauthorized-changes': new TelecomUnauthorizedChangesPluginGrader(),
  'artef:redteam:telecom:fraud-enablement': new TelecomFraudEnablementPluginGrader(),
  'artef:redteam:telecom:porting-misinformation': new TelecomPortingMisinformationPluginGrader(),
  'artef:redteam:telecom:billing-misinformation': new TelecomBillingMisinformationPluginGrader(),
  'artef:redteam:telecom:coverage-misinformation': new TelecomCoverageMisinformationPluginGrader(),
  'artef:redteam:telecom:law-enforcement-request-handling':
    new TelecomLawEnforcementRequestHandlingPluginGrader(),
  'artef:redteam:telecom:accessibility-violation': new TelecomAccessibilityViolationPluginGrader(),
  'artef:redteam:teen-safety:harmful-body-ideals': new TeenSafetyHarmfulBodyIdealsPluginGrader(),
  'artef:redteam:teen-safety:dangerous-content': new TeenSafetyDangerousContentPluginGrader(),
  'artef:redteam:teen-safety:dangerous-roleplay': new TeenSafetyDangerousRoleplayPluginGrader(),
  'artef:redteam:teen-safety:age-restricted-goods-and-services':
    new TeenSafetyAgeRestrictedGoodsAndServicesPluginGrader(),
  'artef:redteam:realestate:fair-housing-discrimination':
    new RealEstateFairHousingDiscriminationPluginGrader(),
  'artef:redteam:realestate:steering': new RealEstateSteeringPluginGrader(),
  'artef:redteam:realestate:discriminatory-listings':
    new RealEstateDiscriminatoryListingsPluginGrader(),
  'artef:redteam:realestate:lending-discrimination':
    new RealEstateLendingDiscriminationPluginGrader(),
  'artef:redteam:realestate:valuation-bias': new RealEstateValuationBiasPluginGrader(),
  'artef:redteam:realestate:accessibility-discrimination':
    new RealEstateAccessibilityDiscriminationPluginGrader(),
  'artef:redteam:realestate:advertising-discrimination':
    new RealEstateAdvertisingDiscriminationPluginGrader(),
  'artef:redteam:realestate:source-of-income': new RealEstateSourceOfIncomePluginGrader(),
  'artef:redteam:overreliance': new OverrelianceGrader(),
  'artef:redteam:pii': new PiiGrader(),
  'artef:redteam:pii:api-db': new PiiGrader(),
  'artef:redteam:pii:direct': new PiiGrader(),
  'artef:redteam:pii:session': new PiiGrader(),
  'artef:redteam:pii:social': new PiiGrader(),
  'artef:redteam:pliny': new PlinyGrader(),
  'artef:redteam:policy': new PolicyViolationGrader(),
  'artef:redteam:politics': new PoliticsGrader(),
  'artef:redteam:prompt-extraction': new PromptExtractionGrader(),
  'artef:redteam:rag-document-exfiltration': new RagDocumentExfiltrationGrader(),
  'artef:redteam:rag-source-attribution': new RagSourceAttributionGrader(),
  'artef:redteam:rbac': new RbacGrader(),
  'artef:redteam:reasoning-dos': new ReasoningDosGrader(),
  'artef:redteam:religion': new ReligionGrader(),
  'artef:redteam:shell-injection': new ShellInjectionGrader(),
  'artef:redteam:sql-injection': new SqlInjectionGrader(),
  'artef:redteam:ssrf': new SsrfGrader(),
  'artef:redteam:tool-discovery': new ToolDiscoveryGrader(),
  'artef:redteam:toxic-chat': new ToxicChatGrader(),
  'artef:redteam:unsafebench': new UnsafeBenchGrader(),
  'artef:redteam:unverifiable-claims': new UnverifiableClaimsGrader(),
  'artef:redteam:vlguard': new VLGuardGrader(),
  'artef:redteam:vlsu': new VLSUGrader(),
  'artef:redteam:wordplay': new WordplayGrader(),
  ...createCodingAgentGraders(),
};

export function getGraderById(id: string): RedteamGraderBase | undefined {
  // Handle null or undefined IDs
  if (!id) {
    return undefined;
  }

  // First try to get the exact grader
  const grader = id in GRADERS ? GRADERS[id as keyof typeof GRADERS] : undefined;

  // If not found but the ID starts with 'artef:redteam:harmful', use the general harmful grader
  if (!grader && id.startsWith('artef:redteam:harmful')) {
    return GRADERS['artef:redteam:harmful'];
  }

  return grader;
}
