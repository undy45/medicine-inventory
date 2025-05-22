import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { MedicineInventoryApi, MedicineInventoryEntry, Configuration } from '../../api/medicine';

@Component({
  tag: 'ee-inventory-editor',
  styleUrl: 'ee-inventory-editor.css',
  shadow: true,
})
export class EeInventoryEditor {
  @Prop() entryId: string;
  @Prop() ambulanceId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;
  @Event({ eventName: 'create-order-clicked' }) createOrderClicked: EventEmitter<string>;
  @State() private count = 1;
  @State() entry: MedicineInventoryEntry;
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  async componentWillLoad() {
    this.getMedicineInventoryEntryAsync();
  }

  private async getMedicineInventoryEntryAsync(): Promise<MedicineInventoryEntry> {
    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const waitingListApi = new MedicineInventoryApi(configuration);

      const response = await waitingListApi.getMedicineInventoryEntryRaw({
        ambulanceId: this.ambulanceId,
        entryId: this.entryId,
      });

      if (response.raw.status < 299) {
        this.entry = await response.value();
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve medicine inventory entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve medicine inventory entry: ${err.message || 'unknown'}`;
    }
    return undefined;
  }

  private handleSliderInput(event: Event) {
    console.log('Event:', event); // Log the entire event object
    console.log('Event target:', event.target); // Log the target element
    console.log('Slider value:', (event.target as HTMLInputElement).value); // Log the slider value

    this.count = +(event.target as HTMLInputElement).value;
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }
    return (
      <Host>
        <form ref={el => this.formElement = el}>
          <md-filled-text-field label="Nazov lieku inventory editor"
                                required value={this.entry?.name}
                                oninput={(ev: InputEvent) => {
                                  if (this.entry) {
                                    this.entry.name = this.handleInputEvent(ev);
                                  }
                                }}>
            <md-icon slot="leading-icon">pill</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Registračné číslo lieku"
                                required value={this.entry?.medicineId}
                                oninput={(ev: InputEvent) => {
                                  if (this.entry) {
                                    this.entry.medicineId = this.handleInputEvent(ev);
                                  }
                                }}>
            <md-icon slot="leading-icon">fingerprint</md-icon>
          </md-filled-text-field>
        </form>

        <div class="count-slider">
          <span class="label">Pocet baleni, ktore chcete vybrat:&nbsp; </span>
          <span class="label">{this.count}</span>
          <span class="label">&nbsp; ks baleni</span>
          <md-slider
            min="1" max={this.entry?.count || 1} value={this.count} ticks labeled
            oninput={(ev: InputEvent) => {
              if (this.count) {
                this.count = Number.parseInt(this.handleInputEvent(ev));
              }
              this.handleSliderInput(ev);
            }}></md-slider>
        </div>

        <md-divider></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={!this.entry}
                                  onClick={() => this.deleteEntry()}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel"
                              onClick={() => this.editorClosed.emit('cancel')}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm" disabled={!this.isValid}
                            onClick={() => this.updateEntry()}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
        <md-filled-icon-button className="add-button"
                               onClick={() => this.createOrderClicked.emit('@new')}>
          <md-icon>add</md-icon>
        </md-filled-icon-button>
      </Host>
    );
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    // check validity of elements
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
      const element = this.formElement.children[i];
      if ('reportValidity' in element) {
        const valid = (element as HTMLInputElement).reportValidity();
        this.isValid &&= valid;
      }
    }
    return target.value;
  }

  private async updateEntry() {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const medicineInventoryApi = new MedicineInventoryApi(configuration);
      this.entry.count -= this.count;
      const response = await medicineInventoryApi.updateMedicineInventoryEntryRaw({
        ambulanceId: this.ambulanceId,
        entryId: this.entryId,
        medicineInventoryEntry: this.entry,
      });

      if (response.raw.status < 299) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Cannot store entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || 'unknown'}`;
    }
  }

  private async deleteEntry() {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const medicineInventoryApi = new MedicineInventoryApi(configuration);

      const response = await medicineInventoryApi.deleteMedicineInventoryEntryRaw({
        ambulanceId: this.ambulanceId,
        entryId: this.entryId,
      });
      if (response.raw.status < 299) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Cannot delete entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || 'unknown'}`;
    }
  }
}
