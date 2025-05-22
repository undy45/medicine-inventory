import { newSpecPage } from '@stencil/core/testing';
import { EeMedicineApp } from '../ee-medicine-app';

describe('ee-medicine-app', () => {

  it('renders order editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/order/@new`,
      components: [EeMedicineApp],
      html: `<ee-medicine-app base-path="/"></ee-medicine-app>`,
    });
    page.win.navigation = new EventTarget();
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual('ee-order-editor');
  });

  it('renders inventory editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [EeMedicineApp],
      html: `<ee-medicine-app base-path="/"></ee-medicine-app>`,
    });
    page.win.navigation = new EventTarget();
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual('ee-inventory-editor');
  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/medicine-app/`,
      components: [EeMedicineApp],
      html: `<ee-medicine-app base-path="/medicine-app/"></ee-medicine-app>`,
    });
    page.win.navigation = new EventTarget();
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual('ee-medicine-inventory');
  });
});
