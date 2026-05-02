import { test } from "@playwright/test";
import { userRegistrationHappyPathSuite } from "./suites/happyPath.suite";
import { userRegistrationSecuritySuite } from "./suites/security.suite";
import { userRegistrationValidationSuite } from "./suites/validation.suite";

test.describe("user registration", () => {
  userRegistrationHappyPathSuite();
  userRegistrationValidationSuite();
  userRegistrationSecuritySuite();
});
