import { newSpecPage } from '@stencil/core/testing';
import { EeInventoryEditor } from '../ee-inventory-editor';
import { MedicineInventoryEntry } from '../../../api/medicine';
import fetchMock from 'jest-fetch-mock';

describe('ee-inventory-editor', () => {

  const sampleEntry: MedicineInventoryEntry = {
    id: 'entry-1',
    medicineId: 'p-1',
    name: 'Paralen',
    count: 20,
  };

  let delay = async (milliseconds: number) => await new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('renders error message on network issues', async () => {
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="${sampleEntry.id}" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    const wlList = page.rootInstance as EeInventoryEditor;
    const foundEntry = wlList?.entry;

    // Wait for the DOM to update
    await page.waitForChanges();

    // Query the DOM for error message and list items
    const errorMessage = page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    // Assert that the error message is displayed and no patients are listed
    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(foundEntry).toBeUndefined();
    expect(items.length).toEqual(0);
  });

  it('buttons shall be of different type', async () => {
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="${sampleEntry.id}" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-filled-icon-button');
    expect(items.length).toEqual(1);
  });

  it('should render required elements', async () => {
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="${sampleEntry.id}" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    const textFields = await page.root.shadowRoot.querySelectorAll('md-filled-text-field');
    expect(textFields.length).toEqual(2);
    const countSlider = await page.root.shadowRoot.querySelector('md-slider');
    expect(countSlider).not.toBeNull();
  });

  it('first text field is medicine name', async () => {
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="${sampleEntry.id}" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    await delay(300);
    await page.waitForChanges();

    const items: any = await page.root.shadowRoot.querySelectorAll("md-filled-text-field");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute("value")).toEqual(sampleEntry.name);
  });

  it('should emit editor-closed event on cancel button click', async () => {
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
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
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
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
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
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

  it('should emit create order clicked event on add button click', async () => {
    // Mock the API response using sampleEntry
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntry));
    const page = await newSpecPage({
      components: [EeInventoryEditor],
      html: `<ee-inventory-editor entry-id="entry-1" ambulance-id="test-ambulance" api-base="http://test/api"></ee-inventory-editor>`,
    });
    await page.waitForChanges();

    const createOrderClickedSpy = jest.spyOn(page.rootInstance.createOrderClicked, 'emit');

    const addButton = page.root.shadowRoot.querySelector('md-filled-icon-button');
    addButton.click();

    await delay(300);

    expect(createOrderClickedSpy).toHaveBeenCalledWith('@new');
  });
});
