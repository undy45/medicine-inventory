import { newSpecPage } from '@stencil/core/testing';
import { EeMedicineInventory } from '../ee-medicine-inventory';

describe('ee-medicine-inventory', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [EeMedicineInventory],
      html: `<ee-medicine-inventory></ee-medicine-inventory>`,
    });
    const wlList = page.rootInstance as EeMedicineInventory;
    const expectedPatients = wlList?.medicineInventory?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedPatients);
  });
});
