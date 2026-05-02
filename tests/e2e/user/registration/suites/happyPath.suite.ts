import { expect, test } from "@playwright/test";
import {
  expectNoFieldError,
  fillScenario,
  mockPost,
  openScenario,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import { validRegistration } from "../../../helpers/testData";

export function userRegistrationHappyPathSuite() {
  test.describe("happy path", () => {
    test("submits backend-valid registration data", async ({ page }) => {
      const api = await mockPost(page, "/api/user/register");

      await openScenario(page, "/register");
      await fillScenario(page, validRegistration);
      await submitCurrentForm(page);

      await expect.poll(api.calls).toBe(1);
    });

    test("accepts optional Georgian name as blank", async ({ page }) => {
      const api = await mockPost(page, "/api/user/register");

      await openScenario(page, "/register");
      await fillScenario(page, {
        ...validRegistration,
        fields: {
          ...validRegistration.fields,
          nameGe: "",
        },
      });
      await submitCurrentForm(page);

      await expectNoFieldError(page, "nameGe");
      await expect.poll(api.calls).toBe(1);
    });
  });
}
