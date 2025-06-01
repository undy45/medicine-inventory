import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import {
  Configuration,
  MedicineOrderEntry,
  MedicineOrderApi,
  Status, OrderStatusesApi, ApiResponse,
} from '../../api/medicine';

@Component({
  tag: 'ee-order-editor',
  styleUrl: 'ee-order-editor.css',
  shadow: true,
})
export class EeOrderEditor {
  @Prop() entryId: string;
  @Prop() ambulanceId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;
  @State() private count = 2;
  @State() entry: MedicineOrderEntry;
  @State() originalStatus: Status;
  @State() statuses: Status[];
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  async componentWillLoad() {
    this.getStatuses();
    this.getMedicineOrderEntryAsync();
  }

  private async getMedicineOrderEntryAsync(): Promise<MedicineOrderEntry> {
    if (this.entryId === '@new') {
      this.isValid = false;
      this.getInitialStatus().then(status => {
        this.originalStatus = status;
      })
      this.entry = {
        id: '@new',
        medicineId: '',
        count: 15,
        status: this.originalStatus
      };
      return this.entry;
    }
    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const waitingListApi = new MedicineOrderApi(configuration);

      const response = await waitingListApi.getMedicineOrderEntryRaw({
        ambulanceId: this.ambulanceId,
        entryId: this.entryId,
      });

      if (response.raw.status < 299) {
        this.entry = await response.value();
        this.originalStatus = this.entry.status;
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve medicine order entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve medicine order entry: ${err.message || 'unknown'}`;
    }
    return undefined;
  }

  private async getStatuses(): Promise<Status[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const orderStatusesApi = new OrderStatusesApi(configuration);

      const response = await orderStatusesApi.getStatusesRaw();
      if (response.raw.status < 299) {
        this.statuses = await response.value();
      }
    } catch (err: any) {
      // no strong dependency on conditions
    }
    // always have some fallback condition
    return this.statuses || [{
      id: 0,
      value: 'Neurčený status',
    }];
  }

  private async getInitialStatus(): Promise<Status> {
    let result: Status = {
      id: 0,
      value: 'Neurčený status',
      validTransitions: []
    };
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const orderStatusesApi = new OrderStatusesApi(configuration);

      const response = await orderStatusesApi.getInitialStatusRaw();
      if (response.raw.status < 299) {
        result = await response.value();
      }
    } catch (err: any) {
      // no strong dependency on conditions
    }

    return result;
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
          <md-filled-text-field label="Nazov lieku order editor"
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
          {this.renderStatuses()}
        </form>

        <div class="count-slider">
          <span class="label">Pocet baleni:&nbsp; </span>
          <span class="label">{this.count}</span>
          <span class="label">&nbsp; ks baleni</span>
          <md-slider
            min="1" max="99" value={this.entry?.count || 15} ticks labeled
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.count
                  = Number.parseInt(this.handleInputEvent(ev));
              }
              this.handleSliderInput(ev);
            }}></md-slider>
        </div>

        <md-divider></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={!this.entry || this.entry?.id === '@new'}
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
      </Host>
    );
  }

  private renderStatuses() {
    if (this.entry?.id === '@new') {
      return
    }
    let statuses = this.statuses || [];
    const validIds = this.originalStatus?.validTransitions;
    statuses = statuses.filter(status => validIds.includes(status.id));
    if (this.originalStatus) {
      statuses.unshift(this.originalStatus);
    }
    return (
      <md-filled-select label="Stav objednavky"
                        display-text={this.entry?.status?.value}
                        oninput={(ev: InputEvent) => this.handleStatus(ev)}>
        <md-icon slot="leading-icon">package</md-icon>
        {statuses.map(status => {
          return (
            <md-select-option
              value={status.value}
              selected={status.value === this.entry?.status?.value}>
              <div slot="headline">{status.value}</div>
            </md-select-option>
          );
        })}
      </md-filled-select>
    );
  }

  private handleStatus(ev: InputEvent) {
    if (this.entry) {
      const value = this.handleInputEvent(ev);
      const status = this.statuses.find(status => status.value === value);
      this.entry.status = Object.assign({}, status);
    }
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

      const medicineOrderApi = new MedicineOrderApi(configuration);
      let response: ApiResponse<MedicineOrderEntry>;
      this.entry.id = null
      if (this.entryId == '@new') {
        response = await medicineOrderApi.createMedicineOrderEntryRaw({
          ambulanceId: this.ambulanceId,
          medicineOrderEntry: this.entry,
        })
      } else {
        this.updateStatus()
        this.prepareStatusForRequest()
        response = await medicineOrderApi.updateMedicineOrderEntryRaw({
          ambulanceId: this.ambulanceId,
          entryId: this.entryId,
          medicineOrderEntry: this.entry,
        });
      }

      if (response.raw.status < 299) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Cannot store entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || 'unknown'}`;
    }
  }

  private updateStatus() {
    if (this.entry) {
      let selectedStatus = this.statuses.find(status => {
        return status.value === this.entry.status.value;
      });
      if (selectedStatus === this.originalStatus) {
        this.entry.status = undefined;
      } else {
        this.entry.status = selectedStatus;
      }
    }
  }

  private prepareStatusForRequest() {
    if (this.entry) {
      this.entry.status = {
        id: this.entry.status.id
      };
    }
  }

  private async deleteEntry() {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const medicineOrderApi = new MedicineOrderApi(configuration);

      const response = await medicineOrderApi.deleteMedicineOrderEntryRaw({
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
