import { test } from "@playwright/test";
import {
  expectFieldError,
  expectNoPost,
  openScenario,
  runFieldValidationScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validLogin } from "../../../helpers/testData";
import {
  loginEmailScenarios,
  loginPasswordScenarios,
} from "../../../helpers/validation.helper";

export function userLoginValidationSuite() {
  test.describe("validation", () => {
    test("empty submit shows required email and password errors", async ({ page }) => {
      const api = await expectNoPost(page, "/api/user/login");

      await openScenario(page, "/login");
      await submitCurrentForm(page);

      await expectFieldError(page, "email");
      await expectFieldError(page, "password");
      api.assert();
    });

    for (const scenario of [...loginEmailScenarios, ...loginPasswordScenarios]) {
      test(`rejects ${scenario.id}: ${scenario.note}`, async ({ page }) => {
        const api = await expectNoPost(page, "/api/user/login");

        await runFieldValidationScenario(page, "/login", validLogin, scenario);

        api.assert();
      });
    }
  });
}
