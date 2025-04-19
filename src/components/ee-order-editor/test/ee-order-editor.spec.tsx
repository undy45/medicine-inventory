import { newSpecPage } from '@stencil/core/testing';
import { EeOrderEditor } from '../ee-order-editor';

describe('ee-order-editor', () => {
  it('buttons shall be of different type', async () => {
    const page = await newSpecPage({
      components: [EeOrderEditor],
      html: `<ee-order-editor entry-id="@new"></ee-order-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });

  it('should render required elements', async () => {
    const page = await newSpecPage({
      components: [EeOrderEditor],
      html: `<ee-order-editor entry-id="@new"></ee-order-editor>`,
    });
    const textFields = await page.root.shadowRoot.querySelectorAll('md-filled-text-field');
    expect(textFields.length).toEqual(2);
    const countSlider = await page.root.shadowRoot.querySelector('md-slider');
    expect(countSlider).not.toBeNull();
  });
});
