import { newE2EPage } from '@stencil/core/testing';

describe('ee-inventory-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ee-inventory-editor></ee-inventory-editor>');

    const element = await page.find('ee-inventory-editor');
    expect(element).toHaveClass('hydrated');
  });
});
