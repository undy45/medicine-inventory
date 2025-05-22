var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Event, Host, Prop, State, h } from '@stencil/core';
import { MedicineInventoryApi, Configuration } from '../../api/medicine';
let EeMedicineInventory = class EeMedicineInventory {
    entryClicked;
    apiBase;
    ambulanceId;
    errorMessage;
    medicineInventory;
    async getMedicineInventoryAsync() {
        // be prepared for connectivity issues
        try {
            const configuration = new Configuration({
                basePath: this.apiBase,
            });
            const waitingListApi = new MedicineInventoryApi(configuration);
            const response = await waitingListApi.getMedicineInventoryEntriesRaw({ ambulanceId: this.ambulanceId });
            if (response.raw.status < 299) {
                return await response.value();
            }
            else {
                this.errorMessage = `Cannot retrieve list of waiting patients: ${response.raw.statusText}`;
            }
        }
        catch (err) {
            this.errorMessage = `Cannot retrieve list of waiting patients: ${err.message || 'unknown'}`;
        }
        return [];
    }
    async componentWillLoad() {
        this.medicineInventory = await this.getMedicineInventoryAsync();
    }
    render() {
        return (h(Host, null, this.errorMessage
            ? h("div", { class: "error" }, this.errorMessage)
            :
                h("md-list", null, this.medicineInventory.map((medicine) => h("md-list-item", { onClick: () => this.entryClicked.emit(medicine.id) },
                    h("div", { slot: "headline" }, medicine.name),
                    h("div", { slot: "supporting-text" }, 'Pocet kusov: ' + medicine.count),
                    h("md-icon", { slot: "start" }, "pill"))))));
    }
};
__decorate([
    Event({ eventName: 'entry-clicked' })
], EeMedicineInventory.prototype, "entryClicked", void 0);
__decorate([
    Prop()
], EeMedicineInventory.prototype, "apiBase", void 0);
__decorate([
    Prop()
], EeMedicineInventory.prototype, "ambulanceId", void 0);
__decorate([
    State()
], EeMedicineInventory.prototype, "errorMessage", void 0);
EeMedicineInventory = __decorate([
    Component({
        tag: 'ee-medicine-inventory',
        styleUrl: 'ee-medicine-inventory.css',
        shadow: true,
    })
], EeMedicineInventory);
export { EeMedicineInventory };
