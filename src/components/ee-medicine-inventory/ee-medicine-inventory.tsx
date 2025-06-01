import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import {
  Configuration,
  MedicineInventoryApi,
  MedicineInventoryEntry,
  MedicineOrderApi,
  MedicineOrderEntry,
} from '../../api/medicine';
import { CustomError } from '../../global/custom-error';

@Component({
  tag: 'ee-medicine-inventory',
  styleUrl: 'ee-medicine-inventory.css',
  shadow: true,
})

export class EeMedicineInventory {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Event({ eventName: 'order-clicked' }) orderClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;
  @State() error: CustomError;

  @State() medicineInventory: MedicineInventoryEntry[];
  @State() medicineOrders: MedicineOrderEntry[];

  private async getMedicineInventoryAsync(): Promise<MedicineInventoryEntry[]> {
    // be prepared for connectivity issues
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const medicineInventoryApi = new MedicineInventoryApi(configuration);
      const response = await medicineInventoryApi.getMedicineInventoryEntriesRaw({ ambulanceId: this.ambulanceId });
      if (response.raw.status < 299) {
        return await response.value();
      } else {
        this.error = {
          isCritical: true,
          errorMessage: `Cannot retrieve list of medicine inventory: ${response.raw.statusText}`,
        };
      }
    } catch (err: any) {
      this.error = {
        isCritical: true,
        errorMessage: `Cannot retrieve list of medicine inventory: ${err.message || 'unknown'}`,
      };
    }
    return [];
  }

  private async getMedicineOrderAsync(): Promise<MedicineOrderEntry[]> {
    if (this.error) {
      return [];
    }
    // be prepared for connectivity issues
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const medicineOrderApi = new MedicineOrderApi(configuration);
      const response = await medicineOrderApi.getMedicineOrderEntriesRaw({ ambulanceId: this.ambulanceId });
      if (response.raw.status < 299) {
        const medicineOrders = await response.value();
        const nonEmptyOrders = medicineOrders.filter(order => order.count > 0);
        return nonEmptyOrders.filter(medicineOrder => medicineOrder.status?.validTransitions?.length > 0)
      } else {
        this.error = {
          isCritical: false,
          errorMessage: `Cannot retrieve list of medicine orders: ${response.raw.statusText}`,
        };
      }
    } catch (err: any) {
      this.error = {
        isCritical: false,
        errorMessage: `Cannot retrieve list of medicine orders: ${err.message || 'unknown'}`,
      };
    }
    return [];
  }

  async componentWillLoad() {
    this.medicineInventory = await this.getMedicineInventoryAsync();
    this.medicineOrders = await this.getMedicineOrderAsync();
  }

  render() {
    return (
      <Host>
        {this.renderComponent()}
        <md-filled-icon-button className="add-button"
                               onclick={() => this.orderClicked.emit('@new')}>
          <md-icon>add</md-icon>
        </md-filled-icon-button>
      </Host>
    );
  }

  private renderComponent() {
    if (this.error?.isCritical === true) {
      return (
        <div class="error">{this.error.errorMessage}</div>
      );
    }
    if (this.error) {
      console.error(this.error.errorMessage);
    }
    return (
      <md-list>
        {this.renderMedicineInventory()}
        {this.renderRemainingOrders()}
      </md-list>
    );
  }

  private renderMedicineInventory() {
    return this.medicineInventory.map((medicine) =>
      <md-list-item onClick={() => this.entryClicked.emit(medicine.id)}>
        <div slot="headline">{medicine.name}</div>
        <md-icon slot="start">pill</md-icon>
        <div slot="supporting-text">{'Pocet kusov: ' + medicine.count}</div>
        <md-icon slot="end" type="button" onClick={(event: { stopPropagation: () => void; }) => {
          event.stopPropagation();
          this.orderClicked.emit(this.getOrderId(medicine));
        }}>package
        </md-icon>
        {this.renderOrderCount(medicine)}
      </md-list-item>,
    );
  }

  private renderRemainingOrders() {
    const alreadyDrawnMedicineIds = this.medicineInventory.map((order) => order.medicineId);
    return this.medicineOrders
      .filter((order) => !alreadyDrawnMedicineIds.includes(order.medicineId))
      .map((order) =>
        <md-list-item onClick={() => this.orderClicked.emit(order.id)}>
          <div slot="headline">{order.name}</div>
          <md-icon slot="start">package</md-icon>
          <div slot="supporting-text">Pocet kusov: 0</div>
          <md-icon slot="end">package</md-icon>
          <div slot="trailing-supporting-text">{'+' + order.count}</div>
        </md-list-item>,
      );
  }

  private renderOrderCount(medicine: MedicineInventoryEntry) {
    const orderCount = this.getOrder(medicine)?.count;
    if (!orderCount) {
      return;
    }
    return (
      <div slot="trailing-supporting-text">{'+' + orderCount}</div>
    );
  }

  private getOrderId(medicine: MedicineInventoryEntry): string {
    return this.getOrder(medicine)?.id || '@new';
  }

  private getOrder(medicine: MedicineInventoryEntry): MedicineOrderEntry {
    return this.medicineOrders
      .find(order => order.medicineId === medicine.medicineId);
  }
}
