import { newSpecPage } from '@stencil/core/testing';
import { EeMedicineInventory } from '../ee-medicine-inventory';
import { MedicineInventoryEntry, MedicineOrderEntry } from '../../../api/medicine';
import fetchMock from 'jest-fetch-mock';

describe('ee-medicine-inventory', () => {
  const sampleEntries: MedicineInventoryEntry[] = [
    {
      id: "entry-1",
      medicineId: "p-1",
      name: "Paralen",
      count: 20
    },
    {
      id: "entry-2",
      medicineId: "p-2",
      name: "Mig 400",
      count: 30
    }
  ];

  const sampleOrders: MedicineOrderEntry[] = [
    {
      id: "entry-1",
      medicineId: "p-1",
      name: "Paralen",
      count: 20,
      status: {
        value: "Shipping"
      }
    },
    {
      id: "entry-2",
      medicineId: "p-2",
      name: "Mig 400",
      count: 30,
      status: {
        value: "Shipping"
      }
    },
    {
      id: "entry-3",
      medicineId: "p-3",
      name: "Ibuprofin",
      count: 40,
      status: {
        value: "Shipping"
      }
    }
  ];

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('renders', async () => {
    // Mock the API response using sampleEntries
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntries));
    fetchMock.mockResponseOnce(JSON.stringify(sampleOrders));

    const page = await newSpecPage({
      components: [EeMedicineInventory],
      html: `<ee-medicine-inventory ambulance-id="test-ambulance" api-base="http://test/api"></ee-medicine-inventory>`,
    });
    const instance = page.rootInstance as EeMedicineInventory;
    const expectedMedicines = instance?.medicineInventory;
    const expectedOrders = instance?.medicineOrders.filter((order) =>
      !expectedMedicines.map((medicine) => medicine.medicineId)
        .includes(order.medicineId)
    )?.length || 0;

    // Wait for the DOM to update
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    // Assert that the expected number of patients and rendered items match the sample entries
    expect(expectedMedicines?.length).toEqual(sampleEntries.length);
    expect(items.length).toEqual((expectedMedicines?.length || 0) + expectedOrders);
  });

  it('renders with network issues on order api', async () => {
    // Mock the API response using sampleEntries
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntries));

    const page = await newSpecPage({
      components: [EeMedicineInventory],
      html: `<ee-medicine-inventory ambulance-id="test-ambulance" api-base="http://test/api"></ee-medicine-inventory>`,
    });
    const wlList = page.rootInstance as EeMedicineInventory;
    const expectedMedicines = wlList?.medicineInventory?.length

    // Wait for the DOM to update
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    // Assert that the expected number of patients and rendered items match the sample entries
    expect(expectedMedicines).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedMedicines);
  });

  it('renders error message on network issues', async () => {
    // Mock the network error
    fetchMock.mockReject(new Error('Network Error'));
    // fetchMock.mockRejectOnce(new Error('Network Error'));

    const page = await newSpecPage({
      components: [EeMedicineInventory],
      html: `<ee-medicine-inventory ambulance-id="test-ambulance" api-base="http://test/api"></ee-medicine-inventory>`,
    });

    const wlList = page.rootInstance as EeMedicineInventory;
    const expectedPatients = wlList?.medicineInventory?.length;

    // Wait for the DOM to update
    await page.waitForChanges();

    // Query the DOM for error message and list items
    const errorMessage = page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    // Assert that the error message is displayed and no patients are listed
    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedPatients).toEqual(0);
    expect(items.length).toEqual(expectedPatients);
  });
});
