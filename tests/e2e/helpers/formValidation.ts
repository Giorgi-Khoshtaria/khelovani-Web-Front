import { expect, type Page, type Route } from "@playwright/test";
import type { ValidationScenario } from "./validation.helper";

type FieldValue = string | boolean | string[];

export type FormScenario = {
  path: string;
  fields?: Record<string, FieldValue>;
  select?: Record<string, string>;
  radio?: Record<string, string>;
  chips?: string[];
};

export async function openScenario(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("form").first()).toBeVisible();
}

export async function submitCurrentForm(page: Page) {
  await page.locator("form").first().locator('button[type="submit"]').click();
}

export async function fillField(page: Page, id: string, value: string) {
  await page.locator(`#${id}`).fill(value);
}

export async function selectField(page: Page, id: string, value: string) {
  await page.locator(`#${id}`).selectOption(value);
}

export async function setCheckbox(page: Page, id: string, checked: boolean) {
  const checkbox = page.locator(`#${id}`);
  if (checked) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
}

export async function chooseFirstChips(page: Page, count = 1) {
  const chips = page.locator(".category-chip");
  await expect(chips.first()).toBeVisible();
  for (let index = 0; index < count; index++) {
    await chips.nth(index).click();
  }
}

export async function clearSelectedChips(page: Page) {
  const activeChips = page.locator(".category-chip--active");
  while ((await activeChips.count()) > 0) {
    await activeChips.first().click();
  }
}

export async function fillScenario(page: Page, scenario: FormScenario) {
  if (scenario.fields) {
    for (const [id, value] of Object.entries(scenario.fields)) {
      if (typeof value === "boolean") {
        await setCheckbox(page, id, value);
      } else if (Array.isArray(value)) {
        continue;
      } else {
        await fillField(page, id, value);
      }
    }
  }

  if (scenario.radio) {
    for (const [name, value] of Object.entries(scenario.radio)) {
      await page.locator(`input[type="radio"][name="${name}"][value="${value}"]`).click();
    }
  }

  if (scenario.select) {
    for (const [id, value] of Object.entries(scenario.select)) {
      await selectField(page, id, value);
    }
  }

  if (scenario.chips) {
    await chooseFirstChips(page, scenario.chips.length);
  }
}

export async function runFieldValidationScenario(
  page: Page,
  path: string,
  validScenario: FormScenario,
  invalidScenario: ValidationScenario,
) {
  await openScenario(page, path);
  await fillScenario(page, validScenario);

  if (invalidScenario.field === "categories") {
    await clearSelectedChips(page);
    await submitCurrentForm(page);
    await expectCategoryError(page);
    return;
  }

  if (typeof invalidScenario.value === "boolean") {
    await setCheckbox(page, invalidScenario.field, invalidScenario.value);
  } else if (!Array.isArray(invalidScenario.value)) {
    await fillField(page, invalidScenario.field, invalidScenario.value);
  }

  await submitCurrentForm(page);
  await expectFieldError(page, invalidScenario.field);
}

export async function runInvalidScenario(
  page: Page,
  scenario: FormScenario,
  expectedFieldErrors: string[],
) {
  await openScenario(page, scenario.path);
  await fillScenario(page, scenario);
  await submitCurrentForm(page);

  for (const field of expectedFieldErrors) {
    await expectFieldError(page, field);
  }
}

export async function expectFieldError(page: Page, id: string) {
  const field = page.locator(`#${id}`);
  const container = field.locator(
    "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' form-group ') or contains(concat(' ', normalize-space(@class), ' '), ' terms-container ')][1]",
  );
  await expect(container.locator(".error-text")).toBeVisible();
}

export async function expectCategoryError(page: Page) {
  await expect(
    page.locator(".category-multi-field").locator(".error-text"),
  ).toBeVisible();
}

export async function expectNoFieldError(page: Page, id: string) {
  const field = page.locator(`#${id}`);
  const container = field.locator(
    "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' form-group ') or contains(concat(' ', normalize-space(@class), ' '), ' terms-container ')][1]",
  );
  await expect(container.locator(".error-text")).toHaveCount(0);
}

export async function mockPost(
  page: Page,
  urlPart: string,
  response: Record<string, unknown> = {},
) {
  let callCount = 0;

  await page.route(`**${urlPart}**`, async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    callCount++;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: response,
      }),
    });
  });

  return {
    calls: () => callCount,
  };
}

export async function expectNoPost(page: Page, urlPart: string) {
  let called = false;
  await page.route(`**${urlPart}**`, async (route) => {
    if (route.request().method() === "POST") {
      called = true;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unexpected validation request" }),
      });
      return;
    }
    await route.continue();
  });

  return {
    assert: () => expect(called).toBe(false),
  };
}
