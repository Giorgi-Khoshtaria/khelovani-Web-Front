import { expect, test } from "@playwright/test";
import {
  expectFieldError,
  expectNoPost,
  fillScenario,
  openScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validPartnerRegistration } from "../../../helpers/testData";

export function partnerRegistrationSecuritySuite() {
  test.describe("security", () => {
    test("does not post invalid partner address data", async ({ page }) => {
      const api = await expectNoPost(page, "/api/partner/register");

      await openScenario(page, "/become-partner");
      await fillScenario(page, {
        ...validPartnerRegistration,
        fields: {
          ...validPartnerRegistration.fields,
          address: "English address",
        },
      });
      await submitCurrentForm(page);

      await expectFieldError(page, "address");
      api.assert();
    });

    test("identification code input enforces max length in the UI", async ({ page }) => {
      await openScenario(page, "/become-partner");

      await page.locator("#identificationCode").fill("1234567890");

      await expect(page.locator("#identificationCode")).toHaveValue("123456789");
    });

    test("rejects selecting more categories than the organization limit", async ({ page }) => {
      const api = await expectNoPost(page, "/api/partner/register");

      await openScenario(page, "/become-partner");

      const trigger = page.locator("#categories");
      await trigger.click();
      const options = page.locator(".ms-option");
      if ((await options.count()) < 6) {
        test.skip(true, "Need at least 6 categories to exceed the org limit of 5");
      }

      // The limit (org: 5) is enforced at submit-time validation, not by
      // disabling options, so select one too many and expect a category error.
      for (let index = 0; index < 6; index++) {
        await options.nth(index).click();
      }
      await trigger.click();
      await submitCurrentForm(page);

      await expectFieldError(page, "categories");
      api.assert();
    });
  });
}
