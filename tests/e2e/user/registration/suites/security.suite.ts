import { expect, test } from "@playwright/test";
import {
  expectFieldError,
  expectNoPost,
  fillScenario,
  openScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validRegistration } from "../../../helpers/testData";

export function userRegistrationSecuritySuite() {
  test.describe("security", () => {
    test("does not post invalid registration data", async ({ page }) => {
      const api = await expectNoPost(page, "/api/user/register");

      await openScenario(page, "/register");
      await fillScenario(page, {
        ...validRegistration,
        fields: {
          ...validRegistration.fields,
          email: "<script>alert(1)</script>",
        },
      });
      await submitCurrentForm(page);

      await expectFieldError(page, "email");
      api.assert();
    });

    test("password fields are masked and toggle independently", async ({ page }) => {
      await openScenario(page, "/register");

      const password = page.locator("#password");
      const confirmPassword = page.locator("#confirmPassword");

      await password.fill("Strong1!");
      await confirmPassword.fill("Strong1!");
      await expect(password).toHaveAttribute("type", "password");
      await expect(confirmPassword).toHaveAttribute("type", "password");

      await page.locator(".toggle-password").first().click();
      await expect(password).toHaveAttribute("type", "text");
      await expect(confirmPassword).toHaveAttribute("type", "password");
    });

    test("id number input enforces max length in the UI", async ({ page }) => {
      await openScenario(page, "/register");

      await page.locator("#idNumber").fill("123456789012");

      await expect(page.locator("#idNumber")).toHaveValue("12345678901");
    });
  });
}
