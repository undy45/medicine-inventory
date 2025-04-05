import { newE2EPage } from '@stencil/core/testing';

describe('ee-medicine-inventory', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ee-medicine-inventory></ee-medicine-inventory>');

    const element = await page.find('ee-medicine-inventory');
    expect(element).toHaveClass('hydrated');
  });
});
