import { expect, test } from "@playwright/test";
import {
  fillScenario,
  mockPost,
  openScenario,
  selectRadio,
  submitCurrentForm,
} from "../../../helpers/formValidation";
import {
  validIndividualPartnerRegistration,
  validPartnerRegistration,
} from "../../../helpers/testData";

export function partnerRegistrationHappyPathSuite() {
  test.describe("happy path", () => {
    test.describe("organization", () => {
      test("submits backend-valid organization registration data", async ({ page }) => {
        const api = await mockPost(page, "/api/partner/register", {
          partner: { _id: "partner-1", email: "partner@example.com" },
        });

        await openScenario(page, "/become-partner");
        await fillScenario(page, validPartnerRegistration);
        await submitCurrentForm(page);

        await expect.poll(api.calls).toBe(1);
      });

      test("accepts optional empty description for organization", async ({ page }) => {
        const api = await mockPost(page, "/api/partner/register", {
          partner: { _id: "partner-1", email: "partner@example.com" },
        });

        await openScenario(page, "/become-partner");
        await fillScenario(page, {
          ...validPartnerRegistration,
          fields: {
            ...validPartnerRegistration.fields,
            description: "",
          },
        });
        await submitCurrentForm(page);

        await expect.poll(api.calls).toBe(1);
      });
    });

    test.describe("individual (physical person)", () => {
      test("submits backend-valid individual registration data", async ({ page }) => {
        const api = await mockPost(page, "/api/partner/register", {
          partner: { _id: "partner-2", email: "individual@example.com" },
        });

        await openScenario(page, "/become-partner");
        await fillScenario(page, validIndividualPartnerRegistration);
        await submitCurrentForm(page);

        await expect.poll(api.calls).toBe(1);
      });

      test("accepts optional empty description for individual", async ({ page }) => {
        const api = await mockPost(page, "/api/partner/register", {
          partner: { _id: "partner-2", email: "individual@example.com" },
        });

        await openScenario(page, "/become-partner");
        await fillScenario(page, {
          ...validIndividualPartnerRegistration,
          fields: {
            ...validIndividualPartnerRegistration.fields,
            description: "",
          },
        });
        await submitCurrentForm(page);

        await expect.poll(api.calls).toBe(1);
      });

      test("individual form shows personalNumber field and hides org-only fields", async ({ page }) => {
        await openScenario(page, "/become-partner");
        await selectRadio(page, "partnerType", "individual");

        await expect(page.locator("#personalNumber")).toBeVisible();
        await expect(page.locator("#identificationCode")).not.toBeVisible();
        await expect(page.locator("#contactPerson")).not.toBeVisible();
      });
    });
  });
}
