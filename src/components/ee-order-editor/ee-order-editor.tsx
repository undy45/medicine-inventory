import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'ee-order-editor',
  styleUrl: 'ee-order-editor.css',
  shadow: true,
})
export class EeOrderEditor {
  @Prop() entryId: string;

  @Event({eventName: "editor-closed"}) editorClosed: EventEmitter<string>;

  @State() private count = 2

  private handleSliderInput(event: Event) {
    console.log('Event:', event); // Log the entire event object
    console.log('Event target:', event.target); // Log the target element
    console.log('Slider value:', (event.target as HTMLInputElement).value); // Log the slider value

    this.count = +(event.target as HTMLInputElement).value;
  }

  render() {
    return (
      <Host>
        <md-filled-text-field label="Nazov lieku" >
          <md-icon slot="leading-icon">pill</md-icon>
        </md-filled-text-field>

        <md-filled-text-field label="Registračné číslo lieku" >
          <md-icon slot="leading-icon">fingerprint</md-icon>
        </md-filled-text-field>

        <div class="count-slider">
          <span class="label">Pocet baleni:&nbsp; </span>
          <span class="label">{this.count}</span>
          <span class="label">&nbsp; ks baleni</span>
          <md-slider
            min="1" max="99" value={this.count} ticks labeled
            oninput={this.handleSliderInput.bind(this)}></md-slider>
        </div>

        <md-divider></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete"
                                  onClick={() => this.editorClosed.emit("delete")}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel"
                              onClick={() => this.editorClosed.emit("cancel")}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm"
                            onClick={() => this.editorClosed.emit("store")}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }
}
