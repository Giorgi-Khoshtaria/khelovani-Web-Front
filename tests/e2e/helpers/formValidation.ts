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
  // (main)/loading.tsx wraps every page in a Suspense boundary, so Next.js
  // streams the page content into a hidden `<div id="S:0">` buffer and swaps it
  // into place. Until the swap completes the page exists twice in the DOM, so a
  // `#id` selector transiently matches both copies and trips strict mode. Wait
  // for the streaming buffers to detach before interacting.
  await expect(page.locator('[id^="S:"]')).toHaveCount(0);
}

export async function submitCurrentForm(page: Page) {
  await page.locator("form").first().locator('button[type="submit"]').click();
}

export async function fillField(page: Page, id: string, value: string) {
  await page.locator(`#${id}`).fill(value);
}

export async function selectField(page: Page, id: string, value: string) {
  const field = page.locator(`#${id}`);
  const tagName = await field.evaluate((el) => el.tagName.toLowerCase());

  if (tagName === "select") {
    await field.selectOption(value);
    return;
  }

  // Custom SearchableSelect renders a <button> trigger plus an option list whose
  // entries expose their value via data-value. Open it, then pick by value.
  await field.click();
  await page.locator(`[role="option"][data-value="${value}"]`).click();
}

export async function setCheckbox(page: Page, id: string, checked: boolean) {
  const checkbox = page.locator(`#${id}`);
  if (checked) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
}

export async function selectRadio(page: Page, name: string, value: string) {
  const input = page.locator(
    `input[type="radio"][name="${name}"][value="${value}"]`,
  );
  // Custom-styled radios visually hide the native input; the wrapping <label>
  // is the clickable surface in that case.
  if (await input.isVisible()) {
    await input.click();
  } else {
    await input.locator("xpath=ancestor::label[1]").click();
  }
}

export async function chooseFirstChips(page: Page, count = 1) {
  // Categories live in a CategoryMultiSelect dropdown: open the #categories
  // trigger, toggle the first `count` options, then close the panel.
  const trigger = page.locator("#categories");
  await trigger.click();
  const options = page.locator(".ms-option");
  await expect(options.first()).toBeVisible();
  for (let index = 0; index < count; index++) {
    await options.nth(index).click();
  }
  await trigger.click();
}

export async function clearSelectedChips(page: Page) {
  // Selected categories render as removable chips outside the dropdown panel.
  const removeButtons = page.locator(".ms-chip__remove");
  while ((await removeButtons.count()) > 0) {
    await removeButtons.first().click();
  }
}

export async function fillScenario(page: Page, scenario: FormScenario) {
  // Radio choices (e.g. partnerType) gate which fields render, so apply them
  // before filling fields — otherwise conditional inputs aren't in the DOM yet.
  if (scenario.radio) {
    for (const [name, value] of Object.entries(scenario.radio)) {
      await selectRadio(page, name, value);
    }
  }

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
  // The category error renders as `.error-text` inside the #categories
  // form-group, same shape as every other field.
  await expectFieldError(page, "categories");
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
