import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { MedicineInventoryApi, MedicineInventoryEntry, Configuration } from '../../api/medicine';

@Component({
  tag: 'ee-medicine-inventory',
  styleUrl: 'ee-medicine-inventory.css',
  shadow: true,
})
export class EeMedicineInventory {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;
  @State() errorMessage: string;

  medicineInventory: MedicineInventoryEntry[];

  private async getMedicineInventoryAsync(): Promise<MedicineInventoryEntry[]> {
    // be prepared for connectivity issues
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const waitingListApi = new MedicineInventoryApi(configuration);
      const response = await waitingListApi.getMedicineInventoryEntriesRaw({ ambulanceId: this.ambulanceId });
      if (response.raw.status < 299) {
        return await response.value();
      } else {
        this.errorMessage = `Cannot retrieve list of waiting patients: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of waiting patients: ${err.message || 'unknown'}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.medicineInventory = await this.getMedicineInventoryAsync();
  }

  render() {
    return (
      <Host>
        {this.errorMessage
          ? <div class="error">{this.errorMessage}</div>
          :
          <md-list>
            {this.medicineInventory.map(medicine =>
              <md-list-item onClick={() => this.entryClicked.emit(medicine.id)}>
                <div slot="headline">{medicine.name}</div>
                <div slot="supporting-text">{'Pocet kusov: ' + medicine.count}</div>
                <md-icon slot="start">pill</md-icon>
              </md-list-item>,
            )}
          </md-list>
        }
      </Host>
    );
  }
}
