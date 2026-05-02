import { test } from "@playwright/test";
import { userLoginHappyPathSuite } from "./suites/happyPath.suite";
import { userLoginSecuritySuite } from "./suites/security.suite";
import { userLoginValidationSuite } from "./suites/validation.suite";

test.describe("user login", () => {
  userLoginHappyPathSuite();
  userLoginValidationSuite();
  userLoginSecuritySuite();
});
