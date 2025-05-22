var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Host, Prop, State, h } from '@stencil/core';
let EeMedicineApp = class EeMedicineApp {
    relativePath = '';
    basePath = '';
    apiBase;
    ambulanceId;
    componentWillLoad() {
        const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;
        const toRelative = (path) => {
            if (path.startsWith(baseUri)) {
                this.relativePath = path.slice(baseUri.length);
            }
            else {
                this.relativePath = '';
            }
        };
        window.navigation?.addEventListener('navigate', (ev) => {
            if (ev.canIntercept) {
                ev.intercept();
            }
            let path = new URL(ev.destination.url).pathname;
            toRelative(path);
        });
        toRelative(location.pathname);
    }
    render() {
        let element = 'list';
        let entryId = '@new';
        if (this.relativePath.startsWith('order/')) {
            element = 'order';
            entryId = this.relativePath.split('/')[1];
        }
        if (this.relativePath.startsWith('entry/')) {
            element = 'editor';
            entryId = this.relativePath.split('/')[1];
        }
        const navigate = (path) => {
            const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
            window.navigation.navigate(absolute);
        };
        return (h(Host, null, element === 'editor'
            ? h("ee-inventory-editor", { "entry-id": entryId, "ambulance-id": this.ambulanceId, "api-base": this.apiBase, "oneditor-closed": () => navigate('./list'), "oncreate-order": (ev) => navigate('./order/' + ev.detail) }) :
            element === 'order'
                ? h("ee-inventory-editor", { "entry-id": entryId, "ambulance-id": this.ambulanceId, "api-base": this.apiBase, "oneditor-closed": () => navigate('./list') })
                :
                    h("ee-medicine-inventory", { "ambulance-id": this.ambulanceId, "api-base": this.apiBase, "onentry-clicked": (ev) => navigate('./entry/' + ev.detail) })));
    }
};
__decorate([
    State()
], EeMedicineApp.prototype, "relativePath", void 0);
__decorate([
    Prop()
], EeMedicineApp.prototype, "basePath", void 0);
__decorate([
    Prop()
], EeMedicineApp.prototype, "apiBase", void 0);
__decorate([
    Prop()
], EeMedicineApp.prototype, "ambulanceId", void 0);
EeMedicineApp = __decorate([
    Component({
        tag: 'ee-medicine-app',
        styleUrl: 'ee-medicine-app.css',
        shadow: true,
    })
], EeMedicineApp);
export { EeMedicineApp };
