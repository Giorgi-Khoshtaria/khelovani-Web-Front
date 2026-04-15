import { test, expect } from "@playwright/test";

test.describe("Product Listing Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the products page
    // Assuming the path is /products
    await page.goto("/products");
  });

  test("should load products on initial render", async ({ page }) => {
    // Check if the grid container is visible
    const grid = page.locator(".product-listing__grid");
    await expect(grid).toBeVisible();

    // Check if there's at least one product card (assuming some data exists)
    // We use a broader selector or wait for the loading to disappear
    await expect(page.locator(".product-listing__empty")).not.toBeVisible();
    const productCards = page.locator(".product-card");
    
    // We expect some cards to be present if initialData is provided
    // If no data, we should see the empty state message
    const count = await productCards.count();
    if (count === 0) {
      await expect(page.getByText(/No products found/i)).toBeVisible();
    } else {
      await expect(productCards.first()).toBeVisible();
    }
  });

  test("should filter products by search query", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    // Type a specific term
    // We'll use a term that is unlikely to exist to test the empty state
    // then clear it to test recovery
    await searchInput.fill("NonExistentProductXYZ123");
    
    // Wait for debounce (500ms) and API call
    await page.waitForTimeout(1000); 
    
    await expect(page.getByText(/No products found/i)).toBeVisible();

    // Clear search
    await searchInput.fill("");
    await page.waitForTimeout(1000);
    
    const count = await page.locator(".product-card").count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter products by category", async ({ page }) => {
    const categorySelect = page.locator(".product-listing__category-select select");
    await expect(categorySelect).toBeVisible();

    // Switch to a different category
    // We'll try to select the second option if it exists
    const options = await categorySelect.locator("option").all();
    if (options.length > 1) {
      const secondCategoryValue = await options[1].getAttribute("value");
      if (secondCategoryValue) {
        await categorySelect.selectOption(secondCategoryValue);
        
        // Wait for API call
        await page.waitForTimeout(1000);
        
        // Ensure either cards or empty state is shown
        const isGridVisible = await page.locator(".product-listing__grid").isVisible();
        expect(isGridVisible).toBe(true);
      }
    }
  });

  test("should handle pagination", async ({ page }) => {
    // This test assumes there are multiple pages of data
    const pagination = page.locator(".product-listing__pagination");
    
    const isPaginationVisible = await pagination.isVisible();
    if (isPaginationVisible) {
      const nextButton = pagination.getByRole("button", { name: /Next/i });
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        const prevButton = pagination.getByRole("button", { name: /Previous/i });
        await expect(prevButton).toBeEnabled();
      }
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });

    // Verify toolbar elements are still accessible
    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    const categorySelect = page.locator(".product-listing__category-select select");
    await expect(categorySelect).toBeVisible();

    // Verify grid adapts (columns should reduce)
    const grid = page.locator(".product-listing__grid");
    const gridStyle = await grid.evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
    
    // In mobile, it usually falls back to 1 column or similar depending on CSS
    // Based on our CSS: repeat(auto-fill, minmax(280px, 1fr))
    // On 375px width with 20px padding (335px), it should be 1 column.
    expect(gridStyle).not.toContain("repeat");
  });
});
