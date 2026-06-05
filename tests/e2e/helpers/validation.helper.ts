/**
 * Shared frontend validation scenario library.
 * Mirrors the backend tests/helpers/shared/validation.helper.ts shape:
 * scenario arrays stay close to schema limits, while specs only decide
 * which form to open and which valid base data to override.
 */

export interface ValidationScenario {
  id: string;
  field: string;
  value: string | boolean | string[];
  note: string;
}

export const LIMITS = {
  register: {
    nameGe: { min: 2, max: 100 },
    nameEn: { min: 2, max: 100 },
    address: { min: 5, max: 200 },
    email: { max: 150 },
    phone: { max: 40 },
    password: { min: 8, max: 64 },
  },
  forgotPassword: {
    email: { max: 150 },
  },
  resetPassword: {
    password: { min: 8, max: 64 },
  },
  login: {
    email: { max: 255 },
    password: { max: 100 },
  },
  partner: {
    companyNameGe: { min: 1, max: 100 },
    companyNameEn: { min: 1, max: 100 },
    contactPerson: { min: 1, max: 100 },
    email: { max: 254 },
    address: { max: 200 },
    addressEn: { max: 200 },
    description: { max: 500 },
  },
} as const;

export const emailValidationScenarios: ValidationScenario[] = [
  { id: "VAL-EMAIL-001", field: "email", value: "", note: "empty string" },
  { id: "VAL-EMAIL-002", field: "email", value: "test.com", note: "missing @" },
  { id: "VAL-EMAIL-003", field: "email", value: "test@", note: "missing domain" },
  { id: "VAL-EMAIL-004", field: "email", value: "@test.com", note: "missing local part" },
  { id: "VAL-EMAIL-005", field: "email", value: "test@test.com@test", note: "multiple @" },
  { id: "VAL-EMAIL-006", field: "email", value: "test @test.com", note: "contains space" },
  { id: "VAL-EMAIL-007", field: "email", value: "test@test", note: "no TLD" },
];

export const phoneValidationScenarios: ValidationScenario[] = [
  { id: "VAL-PHONE-001", field: "phone", value: "", note: "empty string" },
  { id: "VAL-PHONE-002", field: "phone", value: "59912345", note: "too short" },
  { id: "VAL-PHONE-003", field: "phone", value: "59912345678", note: "too long" },
  { id: "VAL-PHONE-004", field: "phone", value: "abc123456", note: "non-numeric" },
  { id: "VAL-PHONE-005", field: "phone", value: "499123456", note: "invalid prefix" },
  { id: "VAL-PHONE-006", field: "phone", value: "a".repeat(41), note: "over max length" },
];

export const passwordValidationScenarios: ValidationScenario[] = [
  { id: "VAL-PWD-001", field: "password", value: "shrt1!A", note: "under min length" },
  { id: "VAL-PWD-002", field: "password", value: "nocaps123!", note: "missing uppercase" },
  { id: "VAL-PWD-003", field: "password", value: "NOLOWER123!", note: "missing lowercase" },
  { id: "VAL-PWD-004", field: "password", value: "NoDigit!AA", note: "missing digit" },
  { id: "VAL-PWD-005", field: "password", value: "NoSpecial1A", note: "missing special char" },
  { id: "VAL-PWD-006", field: "password", value: "", note: "empty string" },
  { id: "VAL-PWD-007", field: "password", value: `${"A".repeat(65)}a1!`, note: "over max length" },
];

export const loginPasswordScenarios: ValidationScenario[] = [
  { id: "LGN-VAL-001", field: "password", value: "", note: "empty string" },
  { id: "LGN-VAL-002", field: "password", value: "a".repeat(101), note: "over max length" },
];

export const loginEmailScenarios: ValidationScenario[] = emailValidationScenarios.map((scenario) => ({
  ...scenario,
  id: scenario.id.replace("VAL-EMAIL", "LGN-EMAIL"),
}));

export const forgotPasswordEmailScenarios: ValidationScenario[] =
  emailValidationScenarios.map((scenario) => ({
    ...scenario,
    id: scenario.id.replace("VAL-EMAIL", "FGT-EMAIL"),
  }));

export const resetPasswordScenarios: ValidationScenario[] =
  passwordValidationScenarios.map((scenario) => ({
    ...scenario,
    id: scenario.id.replace("VAL-PWD", "RST-PWD"),
  }));

export const idNumberValidationScenarios: ValidationScenario[] = [
  { id: "VAL-ID-001", field: "idNumber", value: "", note: "empty string" },
  { id: "VAL-ID-002", field: "idNumber", value: "1234567890", note: "too short" },
  { id: "VAL-ID-004", field: "idNumber", value: "1234567890a", note: "contains letter" },
  { id: "VAL-ID-005", field: "idNumber", value: "           ", note: "whitespace only" },
];

export const nameEnValidationScenarios: ValidationScenario[] = [
  { id: "VAL-NAME-EN-001", field: "nameEn", value: "", note: "empty string" },
  { id: "VAL-NAME-EN-002", field: "nameEn", value: "A".repeat(101), note: "over max length" },
  { id: "VAL-NAME-EN-003", field: "nameEn", value: "123", note: "digits only" },
  { id: "VAL-NAME-EN-004", field: "nameEn", value: "A", note: "too short" },
];

export const nameGeValidationScenarios: ValidationScenario[] = [
  { id: "VAL-NAME-GE-001", field: "nameGe", value: "ა", note: "too short" },
  { id: "VAL-NAME-GE-002", field: "nameGe", value: "ა".repeat(101), note: "over max length" },
  { id: "VAL-NAME-GE-003", field: "nameGe", value: "John", note: "Latin chars rejected" },
  { id: "VAL-NAME-GE-004", field: "nameGe", value: "123", note: "digits only rejected" },
];

export const registrationFieldScenarios: ValidationScenario[] = [
  ...idNumberValidationScenarios,
  ...nameEnValidationScenarios,
  ...nameGeValidationScenarios,
  ...emailValidationScenarios,
  ...phoneValidationScenarios,
  ...passwordValidationScenarios,
  { id: "VAL-REG-TERMS-001", field: "terms", value: false, note: "terms unchecked" },
];

export const partnerCompanyNameGeScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-001", field: "companyNameGe", value: "", note: "empty string" },
  { id: "PRT-VAL-002", field: "companyNameGe", value: "A".repeat(101), note: "over max length" },
];

export const partnerCompanyNameEnScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-004", field: "companyNameEn", value: "", note: "empty string" },
  { id: "PRT-VAL-005", field: "companyNameEn", value: "A".repeat(101), note: "over max length" },
];

export const partnerIdCodeScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-007", field: "identificationCode", value: "", note: "empty string" },
  { id: "PRT-VAL-008", field: "identificationCode", value: "12345678", note: "too short" },
  { id: "PRT-VAL-010", field: "identificationCode", value: "12345678a", note: "contains letter" },
];

export const partnerContactPersonScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-012", field: "contactPerson", value: "", note: "empty string" },
  { id: "PRT-VAL-013", field: "contactPerson", value: "A".repeat(101), note: "over max length" },
];

export const partnerAddressScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-020", field: "address", value: "", note: "empty string" },
  { id: "PRT-VAL-021", field: "address", value: "A".repeat(201), note: "over max length" },
  { id: "PRT-VAL-022", field: "address", value: "123 Main Street", note: "Latin chars rejected" },
];

export const partnerAddressEnScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-025", field: "addressEn", value: "", note: "empty string" },
  { id: "PRT-VAL-026", field: "addressEn", value: "A".repeat(201), note: "over max length" },
  { id: "PRT-VAL-027", field: "addressEn", value: "თბილისი 123", note: "Georgian chars rejected" },
];

export const partnerUrlScenarios: ValidationScenario[] = [
  { id: "PRT-VAL-030", field: "website", value: "not-a-url", note: "invalid URL format" },
  { id: "PRT-VAL-031", field: "website", value: "ftp://example.com", note: "non-http scheme" },
];

export const partnerFieldScenarios: ValidationScenario[] = [
  ...partnerCompanyNameGeScenarios,
  ...partnerCompanyNameEnScenarios,
  ...partnerIdCodeScenarios,
  ...partnerContactPersonScenarios,
  ...phoneValidationScenarios,
  ...emailValidationScenarios,
  ...partnerAddressScenarios,
  ...partnerAddressEnScenarios,
  { id: "PRT-VAL-040", field: "categories", value: [], note: "empty categories" },
  { id: "PRT-VAL-041", field: "description", value: "a".repeat(501), note: "description over max" },
  { id: "PRT-VAL-042", field: "terms", value: false, note: "terms unchecked" },
];

// ── Individual (physical person) partner scenarios ────────────

export const partnerPersonalNumberScenarios: ValidationScenario[] = [
  { id: "PRT-IND-PNUM-001", field: "personalNumber", value: "", note: "empty string" },
  { id: "PRT-IND-PNUM-002", field: "personalNumber", value: "1234567890", note: "too short (10 digits)" },
  { id: "PRT-IND-PNUM-003", field: "personalNumber", value: "123456789012", note: "too long (12 digits)" },
  { id: "PRT-IND-PNUM-004", field: "personalNumber", value: "1234567890a", note: "contains letter" },
  { id: "PRT-IND-PNUM-005", field: "personalNumber", value: "           ", note: "whitespace only" },
];

export const partnerIndividualFieldScenarios: ValidationScenario[] = [
  ...partnerCompanyNameGeScenarios.map((s) => ({ ...s, id: s.id.replace("PRT-VAL", "PRT-IND") })),
  ...partnerCompanyNameEnScenarios.map((s) => ({ ...s, id: s.id.replace("PRT-VAL", "PRT-IND") })),
  ...partnerPersonalNumberScenarios,
  ...phoneValidationScenarios.map((s) => ({ ...s, id: s.id.replace("VAL-PHONE", "PRT-IND-PHONE") })),
  ...emailValidationScenarios.map((s) => ({ ...s, id: s.id.replace("VAL-EMAIL", "PRT-IND-EMAIL") })),
  ...partnerAddressScenarios.map((s) => ({ ...s, id: s.id.replace("PRT-VAL", "PRT-IND") })),
  ...partnerAddressEnScenarios.map((s) => ({ ...s, id: s.id.replace("PRT-VAL", "PRT-IND") })),
  { id: "PRT-IND-040", field: "categories", value: [], note: "empty categories" },
  { id: "PRT-IND-041", field: "description", value: "a".repeat(501), note: "description over max" },
  { id: "PRT-IND-042", field: "terms", value: false, note: "terms unchecked" },
];
