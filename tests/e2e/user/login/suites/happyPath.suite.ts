import { expect, test } from "@playwright/test";
import {
  fillScenario,
  mockPost,
  openScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validLogin } from "../../../helpers/testData";

export function userLoginHappyPathSuite() {
  test.describe("happy path", () => {
    test("submits valid login credentials", async ({ page }) => {
      const api = await mockPost(page, "/api/user/login", {
        token: "e2e-token",
        user: { id: "user-1" },
      });

      await openScenario(page, "/login");
      await fillScenario(page, validLogin);
      await submitCurrentForm(page);

      await expect.poll(api.calls).toBe(1);
    });

    test("accepts backend-valid login password without registration complexity", async ({ page }) => {
      const api = await mockPost(page, "/api/user/login", {
        token: "e2e-token",
        user: { id: "user-1" },
      });

      await openScenario(page, "/login");
      await fillScenario(page, {
        ...validLogin,
        fields: {
          email: "test@example.com",
          password: "plainpassword",
        },
      });
      await submitCurrentForm(page);

      await expect.poll(api.calls).toBe(1);
    });
  });
}
