import { test } from "@playwright/test";
import {
  expectFieldError,
  expectNoPost,
  fillScenario,
  openScenario,
  runFieldValidationScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validRegistration } from "../../../helpers/testData";
import { registrationFieldScenarios } from "../../../helpers/validation.helper";

export function userRegistrationValidationSuite() {
  test.describe("validation", () => {
    test("empty submit shows required registration errors", async ({ page }) => {
      const api = await expectNoPost(page, "/api/user/register");

      await openScenario(page, "/register");
      await submitCurrentForm(page);

      for (const field of [
        "idNumber",
        "nameEn",
        "email",
        "phone",
        "password",
        "confirmPassword",
        "terms",
      ]) {
        await expectFieldError(page, field);
      }
      api.assert();
    });

    for (const scenario of registrationFieldScenarios) {
      test(`rejects ${scenario.id}: ${scenario.note}`, async ({ page }) => {
        const api = await expectNoPost(page, "/api/user/register");

        await runFieldValidationScenario(
          page,
          "/register",
          validRegistration,
          scenario,
        );

        api.assert();
      });
    }

    test("rejects password mismatch", async ({ page }) => {
      const api = await expectNoPost(page, "/api/user/register");

      await openScenario(page, "/register");
      await fillScenario(page, {
        ...validRegistration,
        fields: {
          ...validRegistration.fields,
          confirmPassword: "Strong2!",
        },
      });
      await submitCurrentForm(page);

      await expectFieldError(page, "confirmPassword");
      api.assert();
    });
  });
}
