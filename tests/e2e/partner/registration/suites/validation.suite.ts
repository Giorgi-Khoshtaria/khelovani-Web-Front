import { test } from "@playwright/test";
import {
  expectCategoryError,
  expectFieldError,
  expectNoPost,
  openScenario,
  runFieldValidationScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import {
  validIndividualPartnerRegistration,
  validPartnerRegistration,
} from "../../../helpers/testData";
import {
  partnerFieldScenarios,
  partnerIndividualFieldScenarios,
} from "../../../helpers/validation.helper";

export function partnerRegistrationValidationSuite() {
  test.describe("validation", () => {
    test.describe("organization", () => {
      test("empty submit shows required organization registration errors", async ({ page }) => {
        const api = await expectNoPost(page, "/api/partner/register");

        await openScenario(page, "/become-partner");
        await submitCurrentForm(page);

        for (const field of [
          "companyNameGe",
          "companyNameEn",
          "identificationCode",
          "contactPerson",
          "phone",
          "city",
          "email",
          "address",
          "addressEn",
          "terms",
        ]) {
          await expectFieldError(page, field);
        }
        await expectCategoryError(page);
        api.assert();
      });

      for (const scenario of partnerFieldScenarios) {
        test(`rejects ${scenario.id}: ${scenario.note}`, async ({ page }) => {
          const api = await expectNoPost(page, "/api/partner/register");

          await runFieldValidationScenario(
            page,
            "/become-partner",
            validPartnerRegistration,
            scenario,
          );

          api.assert();
        });
      }
    });

    test.describe("individual (physical person)", () => {
      test("empty submit shows required individual registration errors", async ({ page }) => {
        const api = await expectNoPost(page, "/api/partner/register");

        await openScenario(page, "/become-partner");
        // Switch to individual type first
        await page
          .locator('input[type="radio"][name="partnerType"][value="individual"]')
          .click();
        await submitCurrentForm(page);

        for (const field of [
          "companyNameGe",
          "companyNameEn",
          "personalNumber",
          "phone",
          "city",
          "email",
          "address",
          "addressEn",
          "terms",
        ]) {
          await expectFieldError(page, field);
        }
        await expectCategoryError(page);
        api.assert();
      });

      for (const scenario of partnerIndividualFieldScenarios) {
        test(`rejects ${scenario.id}: ${scenario.note}`, async ({ page }) => {
          const api = await expectNoPost(page, "/api/partner/register");

          await runFieldValidationScenario(
            page,
            "/become-partner",
            validIndividualPartnerRegistration,
            scenario,
          );

          api.assert();
        });
      }
    });
  });
}
