import { newE2EPage } from '@stencil/core/testing';
describe('ee-order-editor', () => {
    it('renders', async () => {
        const page = await newE2EPage();
        await page.setContent('<ee-order-editor></ee-order-editor>');
        const element = await page.find('ee-order-editor');
        expect(element).toHaveClass('hydrated');
    });
});
