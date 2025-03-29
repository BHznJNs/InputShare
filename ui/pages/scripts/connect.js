import { css, html, LitElement } from "../libs/lit-all.min.js"

class PairingTab extends LitElement {
  static styles = css`
    :host {
      font-family: var(--text-font);
      user-select: none;
    }
    div.frame {
      margin: 0 2rem;
    }
    div.input-container {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
    }
    div.ip-port-container {
      display: flex;
      align-items: flex-end;
    }
    div.ip-port-container .divider {
      padding: .6rem;
      font-size: 1.125rem;
      font-weight: bold;
    }
    div.ip-port-container #ip-input {
      flex: 1;
    }

    .spacer {
      height: 3rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 1rem;
      margin: 0 2rem;
    }
  `

  /**
   * @param {string} addr 
   * @param {string} pairingCode 
   */
  static SubmitEventFactory(addr, pairingCode) {
    return new CustomEvent("submit", {
      detail: { addr, pairingCode},
      bubbles: true,
      composed: true,
    })
  }

  firstUpdated() {
    this.inputs = {
      ip: this.shadowRoot.querySelector("#ip-input"),
      port: this.shadowRoot.querySelector("#port-input"),
      pairingCode: this.shadowRoot.querySelector("#pairingcode-input")
    }

    const inputContainer = this.shadowRoot.querySelector(".input-container")
    inputContainer.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return

      const ip = this.inputs.ip.value
      const port = this.inputs.port.value
      const pairingCode = this.inputs.pairingCode.value
      this.dispatchEvent(PairingTab.SubmitEventFactory(
        ip + port, pairingCode,
      ))
    })
  }

  render() {
    return html`
      <div class="frame">
        <div class="input-container">
          <div class="ip-port-container">
            <sl-input id="ip-input" label="Pairing IP and port" filled clearable>
              <sl-icon name="globe-asia-australia" slot="prefix"></sl-icon>
            </sl-input>
            <span class="divider">:</span>
            <sl-input id="port-input" placeholder="*****" maxlength=5 filled clearable></sl-input>
          </div>
          <sl-input id="pairingcode-input" label="Pairing Code" placeholder="******" maxlength=6 filled clearable>
            <sl-icon name="123" slot="prefix"></sl-icon>
          </sl-input>
        </div>
        <div class="spacer"></div>
        <div class="actions">
          <sl-button variant="default">Paired? Skip></sl-button>
          <sl-button variant="primary">Pair</sl-button>
        </div>
      </div>
    `
  }
}

class AppRoot extends LitElement {
  static styles = css`
    :host {
      height: 100%;
    }
  `

  pair() {
    console.log("pair")
  }

  render() {
    return html`
      <sl-tab-group>
        <sl-tab slot="nav" panel="pairing">Pairing</sl-tab>
        <sl-tab slot="nav" panel="connect">Connect</sl-tab>

        <sl-tab-panel name="pairing">
          <pairing-tab @submit=${this.pair}></pairing-tab>
        </sl-tab-panel>
        <sl-tab-panel name="connect">This is the custom tab panel.</sl-tab-panel>
      </sl-tab-group>
    `
  }
}

customElements.define("pairing-tab", PairingTab)
customElements.define("app-root", AppRoot)
