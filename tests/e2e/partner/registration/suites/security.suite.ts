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

    test("category chips cap selection at five when enough categories exist", async ({ page }) => {
      await openScenario(page, "/become-partner");

      const chips = page.locator(".category-chip");
      if ((await chips.count()) < 6) {
        test.skip(true, "Need at least 6 categories to verify the max cap");
      }

      for (let index = 0; index < 5; index++) {
        await chips.nth(index).click();
      }

      await expect(page.locator(".category-chip--active")).toHaveCount(5);
      await expect(chips.nth(5)).toBeDisabled();
    });
  });
}
