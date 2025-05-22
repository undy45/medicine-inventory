import { Component, Host, Prop, State, h } from '@stencil/core';

declare global {
  interface Window {
    navigation: any;
  }
}

@Component({
  tag: 'ee-medicine-app',
  styleUrl: 'ee-medicine-app.css',
  shadow: true,
})
export class EeMedicineApp {
  @State() private relativePath = '';
  @Prop() basePath: string = '';
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      let path = new URL((ev as any).destination.url).pathname;
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

    const navigate = (
      path: string,
      options?: { state?: any; info?: any; history?: 'auto' | 'replace' | 'push'; }) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute, options);
    };

    return (
      <Host>
        {
          element === 'editor'
            ? <ee-inventory-editor entry-id={entryId}
                                   ambulance-id={this.ambulanceId}
                                   api-base={this.apiBase}
                                   oneditor-closed={() => navigate('./list')}
                                   oncreate-order-clicked={(ev: CustomEvent<string>) => navigate('./order/' + ev.detail)}>
            </ee-inventory-editor> :
            element === 'order'
              ? <ee-order-editor entry-id={entryId}
                                 ambulance-id={this.ambulanceId}
                                 api-base={this.apiBase}
                                 oneditor-closed={() => navigate('./list')}>
              </ee-order-editor>
              :
              <ee-medicine-inventory ambulance-id={this.ambulanceId} api-base={this.apiBase}
                                     onentry-clicked={(ev: CustomEvent<string>) => navigate('./entry/' + ev.detail)}
                                     onorder-clicked={(ev: CustomEvent<string>) => navigate('./order/' + ev.detail)}>
              </ee-medicine-inventory>
        }

      </Host>
    );
  }
}
