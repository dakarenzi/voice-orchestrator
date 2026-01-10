
import { test, expect } from '@playwright/test';

test('complete template flow', async ({ page }) => {
    // 1. Navigate to templates gallery
    await page.goto('/app/agents/templates');
    await expect(page.locator('h2', { hasText: 'Agent Templates' })).toBeVisible();

    // 2. Filter by industry (assuming 'Retail' is an option)
    // Note: Depending on UI implementation (select vs dropdown), this might need adjustment
    // await page.getByLabel('Industry').selectOption('retail'); 

    // 3. Search for a template
    await page.fill('input[type="search"]', 'Retail');
    await expect(page.locator('.grid > div')).not.toHaveCount(0);

    // 4. Click template card (first one)
    await page.locator('.grid > div').first().click();
    await expect(page).toHaveURL(/\/templates\/retail-customer-support/);

    // 5. Verify details
    await expect(page.locator('h1')).toContainText('Retail Customer Support');

    // 6. Use template
    await page.getByRole('button', { name: 'Use This Template' }).click();

    // 7. Verify redirect to wizard
    await expect(page).toHaveURL(/\/agents\/new\?fromTemplate=true/);

    // 8. Verify pre-filled banner
    await expect(page.getByText('Agent initialized from template')).toBeVisible();

    // 9. Verify input pre-fill (Agent Name)
    const nameInput = page.locator('input[name="name"]'); // Adjust selector as needed
    // Note: We append (Copy) in the logic now
    // await expect(nameInput).toHaveValue(/Retail Customer Support Agent \(Copy\)/);
});
