var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Host, Prop, State, h, Event } from '@stencil/core';
import { MedicineInventoryApi, Configuration } from '../../api/medicine';
let EeInventoryEditor = class EeInventoryEditor {
    entryId;
    ambulanceId;
    apiBase;
    editorClosed;
    createOrder;
    count = 2;
    entry;
    errorMessage;
    isValid;
    formElement;
    async componentWillLoad() {
        this.getMedicineInventoryEntryAsync();
    }
    async getMedicineInventoryEntryAsync() {
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
            }
            else {
                this.errorMessage = `Cannot retrieve medicine inventory entry: ${response.raw.statusText}`;
            }
        }
        catch (err) {
            this.errorMessage = `Cannot retrieve medicine inventory entry: ${err.message || 'unknown'}`;
        }
        return undefined;
    }
    handleSliderInput(event) {
        console.log('Event:', event); // Log the entire event object
        console.log('Event target:', event.target); // Log the target element
        console.log('Slider value:', event.target.value); // Log the slider value
        this.count = +event.target.value;
    }
    render() {
        if (this.errorMessage) {
            return (h(Host, null,
                h("div", { class: "error" }, this.errorMessage)));
        }
        return (h(Host, null,
            h("form", { ref: el => this.formElement = el },
                h("md-filled-text-field", { label: "Nazov lieku", required: true, value: this.entry?.name, oninput: (ev) => {
                        if (this.entry) {
                            this.entry.name = this.handleInputEvent(ev);
                        }
                    } },
                    h("md-icon", { slot: "leading-icon" }, "pill")),
                h("md-filled-text-field", { label: "Registra\u010Dn\u00E9 \u010D\u00EDslo lieku", required: true, value: this.entry?.medicineId, oninput: (ev) => {
                        if (this.entry) {
                            this.entry.medicineId = this.handleInputEvent(ev);
                        }
                    } },
                    h("md-icon", { slot: "leading-icon" }, "fingerprint"))),
            h("div", { class: "count-slider" },
                h("span", { class: "label" }, "Pocet baleni, ktore chcete vybrat:\u00A0 "),
                h("span", { class: "label" }, this.count),
                h("span", { class: "label" }, "\u00A0 ks baleni"),
                h("md-slider", { min: "1", max: this.entry?.count || 1, value: this.count, ticks: true, labeled: true, oninput: (ev) => {
                        if (this.count) {
                            this.count = Number.parseInt(this.handleInputEvent(ev));
                        }
                        this.handleSliderInput(ev);
                    } })),
            h("md-divider", null),
            h("div", { class: "actions" },
                h("md-filled-tonal-button", { id: "delete", disabled: !this.entry, onClick: () => this.deleteEntry() },
                    h("md-icon", { slot: "icon" }, "delete"),
                    "Zmaza\u0165"),
                h("span", { class: "stretch-fill" }),
                h("md-outlined-button", { id: "cancel", onClick: () => this.editorClosed.emit('cancel') }, "Zru\u0161i\u0165"),
                h("md-filled-button", { id: "confirm", disabled: !this.isValid, onClick: () => this.updateEntry() },
                    h("md-icon", { slot: "icon" }, "save"),
                    "Ulo\u017Ei\u0165"))));
    }
    handleInputEvent(ev) {
        const target = ev.target;
        // check validity of elements
        this.isValid = true;
        for (let i = 0; i < this.formElement.children.length; i++) {
            const element = this.formElement.children[i];
            if ('reportValidity' in element) {
                const valid = element.reportValidity();
                this.isValid &&= valid;
            }
        }
        return target.value;
    }
    async updateEntry() {
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
            }
            else {
                this.errorMessage = `Cannot store entry: ${response.raw.statusText}`;
            }
        }
        catch (err) {
            this.errorMessage = `Cannot store entry: ${err.message || 'unknown'}`;
        }
    }
    async deleteEntry() {
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
            }
            else {
                this.errorMessage = `Cannot delete entry: ${response.raw.statusText}`;
            }
        }
        catch (err) {
            this.errorMessage = `Cannot delete entry: ${err.message || 'unknown'}`;
        }
    }
};
__decorate([
    Prop()
], EeInventoryEditor.prototype, "entryId", void 0);
__decorate([
    Prop()
], EeInventoryEditor.prototype, "ambulanceId", void 0);
__decorate([
    Prop()
], EeInventoryEditor.prototype, "apiBase", void 0);
__decorate([
    Event({ eventName: 'editor-closed' })
], EeInventoryEditor.prototype, "editorClosed", void 0);
__decorate([
    Event({ eventName: 'create-order' })
], EeInventoryEditor.prototype, "createOrder", void 0);
__decorate([
    State()
], EeInventoryEditor.prototype, "count", void 0);
__decorate([
    State()
], EeInventoryEditor.prototype, "entry", void 0);
__decorate([
    State()
], EeInventoryEditor.prototype, "errorMessage", void 0);
__decorate([
    State()
], EeInventoryEditor.prototype, "isValid", void 0);
EeInventoryEditor = __decorate([
    Component({
        tag: 'ee-inventory-editor',
        styleUrl: 'ee-inventory-editor.css',
        shadow: true,
    })
], EeInventoryEditor);
export { EeInventoryEditor };
