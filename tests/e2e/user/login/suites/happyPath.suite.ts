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
      // Auth now rides an httpOnly cookie the backend sets — the JSON body
      // only carries the user (no token).
      const api = await mockPost(page, "/api/user/login", {
        user: { id: "user-1", nameEn: "Test User" },
      });

      await openScenario(page, "/login");
      await fillScenario(page, validLogin);
      await submitCurrentForm(page);

      await expect.poll(api.calls).toBe(1);
    });

    test("accepts backend-valid login password without registration complexity", async ({ page }) => {
      const api = await mockPost(page, "/api/user/login", {
        user: { id: "user-1", nameEn: "Test User" },
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
