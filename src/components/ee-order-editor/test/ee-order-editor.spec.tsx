import { newSpecPage } from '@stencil/core/testing';
import { EeOrderEditor } from '../ee-order-editor';
import { MedicineOrderEntry, Status } from '../../../api/medicine';
import fetchMock from 'jest-fetch-mock';
import { EeInventoryEditor } from '../../ee-inventory-editor/ee-inventory-editor';

describe('ee-order-editor', () => {
  const sampleEntry: MedicineOrderEntry = {
    id: 'entry-1',
    medicineId: 'p-1',
    name: 'Paralen',
    count: 20,
    status: {
      id: 1,
      value: "To_ship",
      validTransitions: [2, 4]
    }
  };

  const sampleStatuses: Status[] = [
    {
      id: 1,
      value: "To_ship",
      validTransitions: [2, 4]
    },
    {
      id: 2,
      value: "Shipped",
      validTransitions: [3, 4]
    },
    {
      id: 3,
      value: "Delivered",
      validTransitions: []
    },
    {
      id: 4,
      value: "Canceled",
      validTransitions: []
    }
  ];

  let delay = async (milliseconds: number) => await new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('buttons shall be of different type', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleStatuses), { status: 200 }]
    );

    const page = await newSpecPage({
      components: [EeOrderEditor],
      html: `<ee-order-editor entry-id="test-entry" ambulance-id="test-ambulance" api-base="http://sample.test/api"></ee-order-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });

  it('should render required elements', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleStatuses), { status: 200 }]
    );

    const page = await newSpecPage({
      components: [EeOrderEditor],
      html: `<ee-order-editor entry-id="test-entry" ambulance-id="test-ambulance" api-base="http://sample.test/api"></ee-order-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    const textFields = await page.root.shadowRoot.querySelectorAll('md-filled-text-field');
    expect(textFields.length).toEqual(2);
    const countSlider = await page.root.shadowRoot.querySelector('md-slider');
    expect(countSlider).not.toBeNull();
  });

  it('first text field is medicine name', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleStatuses[0]), { status: 200 }],
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleStatuses), { status: 200 }]
    );
    const page = await newSpecPage({
      components: [EeOrderEditor],
      html: `<ee-order-editor entry-id="test-entry" ambulance-id="test-ambulance" api-base="http://sample.test/api"></ee-order-editor>`,
    });
    await delay(300);
    await page.waitForChanges();

    const items: any = await page.root.shadowRoot.querySelectorAll("md-filled-text-field");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute("value")).toEqual(sampleEntry.name);
  });

  it('should emit editor-closed event on cancel button click', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleStatuses), { status: 200 }]
    );
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="entry-1" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    await page.waitForChanges();

    const editorClosedSpy = jest.spyOn(page.rootInstance.editorClosed, 'emit');

    const cancelButton = page.root.shadowRoot.querySelector('md-outlined-button');
    cancelButton.click();

    await delay(300);

    expect(editorClosedSpy).toHaveBeenCalledWith('cancel');
  });

  it('should emit editor-closed event on delete button click', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleStatuses), { status: 200 }]
    );
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="entry-1" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    await page.waitForChanges();

    const editorClosedSpy = jest.spyOn(page.rootInstance.editorClosed, 'emit');

    const deleteButton = page.root.shadowRoot.querySelector('md-filled-tonal-button');
    deleteButton.click();

    await delay(300);

    expect(editorClosedSpy).toHaveBeenCalledWith('delete');
  });

  it('should emit editor-closed event on confirm button click', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleStatuses), { status: 200 }]
    );
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="entry-1" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    await page.waitForChanges();

    const editorClosedSpy = jest.spyOn(page.rootInstance.editorClosed, 'emit');

    const confirmButton = page.root.shadowRoot.querySelector('md-filled-button');
    confirmButton.click();

    await delay(300);

    expect(editorClosedSpy).toHaveBeenCalledWith('store');
  });
});
