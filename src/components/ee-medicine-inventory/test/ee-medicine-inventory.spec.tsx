import { newSpecPage } from '@stencil/core/testing';
import { EeMedicineInventory } from '../ee-medicine-inventory';

describe('ee-medicine-inventory', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [EeMedicineInventory],
      html: `<ee-medicine-inventory></ee-medicine-inventory>`,
    });
    expect(page.root).toEqualHtml(`
      <ee-medicine-inventory>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ee-medicine-inventory>
    `);
  });
});
