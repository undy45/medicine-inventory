import { newE2EPage } from '@stencil/core/testing';

describe('ee-medicine-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ee-medicine-app></ee-medicine-app>');

    const element = await page.find('ee-medicine-app');
    expect(element).toHaveClass('hydrated');
  });
});
