import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ee-medicine-inventory',
  styleUrl: 'ee-medicine-inventory.css',
  shadow: true,
})
export class EeMedicineInventory {

  medicineInventory: any[];

  private async getMedicineInventoryAsync(){
    return await Promise.resolve(
      [{
        name: 'Paralen',
        patientId: '10001',
        count: 20
      }, {
        name: 'Mig 400',
        patientId: '10096',
        count: 30
      }, {
        name: 'Espumisan',
        patientId: '10028',
        count: 10
      }]
    );
  }

  async componentWillLoad() {
    this.medicineInventory = await this.getMedicineInventoryAsync();
  }

  render() {
    return (
      <Host>
        <md-list>
          {this.medicineInventory.map(medicine =>
            <md-list-item>
              <div slot="headline">{medicine.name}</div>
              <div slot="supporting-text">{"Pocet kusov: " + medicine.count}</div>
              <md-icon slot="start">pill</md-icon>
            </md-list-item>
          )}
        </md-list>
      </Host>
    );
  }
}
