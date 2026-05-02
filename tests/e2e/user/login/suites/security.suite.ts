import { expect, test } from "@playwright/test";
import {
  expectFieldError,
  expectNoPost,
  fillScenario,
  openScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validLogin } from "../../../helpers/testData";

export function userLoginSecuritySuite() {
  test.describe("security", () => {
    test("does not post script-like email input", async ({ page }) => {
      const api = await expectNoPost(page, "/api/user/login");

      await openScenario(page, "/login");
      await fillScenario(page, {
        ...validLogin,
        fields: {
          email: "<script>alert(1)</script>",
          password: "plainpassword",
        },
      });
      await submitCurrentForm(page);

      await expectFieldError(page, "email");
      api.assert();
    });

    test("password is masked by default and toggle keeps value", async ({ page }) => {
      await openScenario(page, "/login");

      const password = page.locator("#password");
      await password.fill("plainpassword");
      await expect(password).toHaveAttribute("type", "password");

      await page.locator(".toggle-password").click();
      await expect(password).toHaveAttribute("type", "text");
      await expect(password).toHaveValue("plainpassword");
    });

    test("overlong password is blocked before the API", async ({ page }) => {
      const api = await expectNoPost(page, "/api/user/login");

      await openScenario(page, "/login");
      await fillScenario(page, {
        ...validLogin,
        fields: {
          email: "test@example.com",
          password: "a".repeat(101),
        },
      });
      await submitCurrentForm(page);

      await expectFieldError(page, "password");
      api.assert();
    });
  });
}
