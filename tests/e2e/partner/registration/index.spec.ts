import { test } from "@playwright/test";
import { partnerRegistrationHappyPathSuite } from "./suites/happyPath.suite";
import { partnerRegistrationSecuritySuite } from "./suites/security.suite";
import { partnerRegistrationValidationSuite } from "./suites/validation.suite";

test.describe("partner registration", () => {
  partnerRegistrationHappyPathSuite();
  partnerRegistrationValidationSuite();
  partnerRegistrationSecuritySuite();
});
