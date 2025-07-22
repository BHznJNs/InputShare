import interact from "interactjs"
import { css, html, LitElement } from "lit"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { customElement } from "lit/decorators.js"
import type { SlCheckbox, SlInput } from "@shoelace-style/shoelace"

import { I18n } from "../utils/i18n.ts"

declare global {
  interface Backend {
    config: () => Promise<ConfigFile>
    save_config: (new_config: Partial<ConfigFile>) => Promise<void>
    log_file_path: () => Promise<string>
  }
  var backend: Backend
  var config: ConfigFile
  var i18n: I18n
}

@customElement("edge-toggling-tab")
export class EdgeTogglingTab extends LitElement {
  static styles = css`
    .frame {
      display: flex;
      flex-direction: column;
      row-gap: .6rem;
      margin: .5rem 1rem;
      padding-bottom: 1rem;
    }

    .enable {
      margin: .3rem 0;
    }

    .frame p {
      margin: 0;
    }

    .drag-container {
      --card-height: 4.2rem;

      display: grid;
      align-items: center;
      grid-gap: .6rem;
      grid-template-columns: .75fr 1fr .75fr;
      grid-template-rows: var(--card-height) 1fr var(--card-height);
      height: 240px;
      grid-template-areas:
          "___1  top   ____2"
          "left center right"
          "___3 bottom ____4";
      border: solid var(--track-width) var(--track-color);
      border-radius: .25rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    .draggable {
      position: relative;
      width: var(--card-height);
      height: var(--card-height);
      z-index: 1;
      font-size: 1.5rem;
      transform-origin: 0 0;
    }
    .draggable::part(body) {
      padding: 0;
    }
    .draggable.snap-transition {
      transition: transform 0.3s;
    }
    .draggable.dropped::part(base) {
      background-color: transparent;
      border-color: transparent;
      transition: background 0.3s ease,
                  border 0.3s ease;
    }
    .dropzone {
      height: var(--card-height);
      opacity: .6;
      transition: opacity .3s;
    }
    .dropzone.drop-complete {
      opacity: 1;
    }
    @media screen and (prefers-color-scheme: light) {
      sl-card {
        --border-color: #666;
      }
      .dropzone {
        opacity: .4;
      }
    }
    sl-card.center {
      width: 100%;
      height: 100%;
    }
    sl-card.top,
    sl-card.bottom {
      margin-left: 1.8rem;
      margin-right: 1.8rem;
    }
    sl-card.left {
      margin-left: 1.2rem;
    }
    sl-card.right {
      margin-right: 1.2rem;
    }
    sl-card::part(base),
    sl-card::part(body) {
      width: 100%;
      height: 100%;
    }
    sl-card::part(body) {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: .4rem;
    }
    .top {
      grid-area: top;
    }
    .left {
      grid-area: left;
    }
    .center {
      grid-area: center;
    }
    .right {
      grid-area: right;
    }
    .bottom {
      grid-area: bottom;
    }
  `

  private enableRef: Ref<SlCheckbox> = createRef()
  private triggerMarginRef: Ref<SlInput> = createRef()
  private devicePosition = config.device_position

  get enable(): boolean {
    return this.enableRef.value?.checked || false
  }
  get position(): string {
    return this.devicePosition
  }
  get triggerMargin(): number {
    return Number.parseInt(this.triggerMarginRef.value?.value || "0")
  }

  private draggable_: HTMLElement | null = null
  private draggablePosition = { x: 0, y: 0 }
  private isActivated = false

  activated() {
    if (this.isActivated) return
    const initialDropzone = this.shadowRoot!.querySelector("." + config.device_position) as HTMLElement
    const draggable = this.draggable_!
    const dropzoneRect = initialDropzone.getBoundingClientRect()
    const draggableRect = draggable.getBoundingClientRect()
    const initX = dropzoneRect.left + dropzoneRect.width/2  - draggable.clientWidth/2  - draggableRect.left
    const initY = dropzoneRect.top  + dropzoneRect.height/2 - draggable.clientHeight/2 - draggableRect.top

    if (initX && initY) this.isActivated = true

    draggable.style.transform = `translate(${initX}px, ${initY}px)`
    this.draggablePosition.x = initX
    this.draggablePosition.y = initY
    draggable.classList.add("snap-transition")
    draggable.classList.add("dropped")
    initialDropzone.classList.add("drop-complete")
  }

  firstUpdated() {
    const setDevicePosition = (newValue: string) => {
      this.devicePosition = newValue
    }
    const draggable = this.draggable_ = this.shadowRoot!.querySelector(".draggable")! as HTMLElement
    const dropzones = this.shadowRoot!.querySelectorAll(".dropzone")
    const position = this.draggablePosition

    interact(draggable! as HTMLElement).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrict({
          restriction: "parent",
          endOnly: true,
          elementRect: { left: 0, top: 0, right: 1, bottom: 1 }
        }),
        interact.modifiers.snap({
          targets: [],
          relativePoints: [{ x: 0.5, y: 0.5 }],
          range: 40,
          endOnly: true,
        })
      ],
      listeners: {
        start(event) {
          draggable.classList.remove("snap-transition")
          draggable.classList.remove("dropped")
          dropzones.forEach(dropzone => dropzone.classList.remove("drop-complete"))
          const targets = Array.from(dropzones).map(zone => {
            const rect = zone.getBoundingClientRect()
            return {
              x: rect.left + rect.width  / 2,
              y: rect.top  + rect.height / 2,
              range: 60
            }
          })
          const mods = event.interactable.options.drag.modifiers
          // @ts-ignore
          const snapMod = mods.find(m => m.name === "snap")
          snapMod.options.targets = targets
        },
        move(event) {
          position.x += event.dx
          position.y += event.dy
          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      },
    })
    for (const dropzone of dropzones) {
      interact(dropzone as HTMLElement).dropzone({
        accept: ".draggable",
        ondrop(event) {
          draggable.classList.add("snap-transition")
          draggable.classList.add("dropped")
          const dropzone = event.target as HTMLElement
          setDevicePosition(dropzone.dataset.position!)
          dropzone.classList.add("drop-complete")
        }
      })
    }
  }

  render() {
    const enable = html`
      <setting-item class="enable">
        <div slot="title">${i18n.select("Edge Toggling: ", "贴边切换：")}</div>
        <div slot="description">${i18n.select(
          "When enabled, the control will be toggled when the mouse reaches the screen edge.",
          "启用后，当鼠标移至屏幕边缘时会自动切换控制。",
        )}</div>
        <sl-checkbox
          ${ref(this.enableRef)}
          slot="control"
          ?checked=${config.edge_toggling}
        ></sl-checkbox>
      </setting-item>
    `
    const position = html`
      <p>${i18n.select("Android device position: ", "安卓设备位置：")}</p>
      <div class="drag-container">
        <sl-card class="draggable">
          <sl-icon name="android2"></sl-icon>
        </sl-card>
        <sl-card class="dropzone top" data-position="top"></sl-card>
        <sl-card class="dropzone left" data-position="left"></sl-card>
        <sl-card class="center">
          <sl-icon name="laptop"></sl-icon>
          ${i18n.select("This PC", "此电脑")}
        </sl-card>
        <sl-card class="dropzone right" data-position="right"></sl-card>
        <sl-card class="dropzone bottom" data-position="bottom"></sl-card>
      </div>
    `

    const triggerMargin = html`
      <setting-item>
        <div slot="title">${i18n.select("Trigger Margin: ", "触发边距：")}</div>
        <div slot="description">${i18n.select(
          "Prevents triggers when the mouse reaches the corners. Larger values reduce accidents.",
          "避免鼠标触及屏幕角落时触发切换。更大的值可以避免误操作。",
        )}</div>
        <sl-input
          ${ref(this.triggerMarginRef)}
          slot="control"
          value="${config.trigger_margin}"
          type="number"
        ></sl-input>
      </setting-item>
    `
    return html`
      <div class="frame">
        ${position}
        ${enable}
        ${triggerMargin}
      </div>
    `
  }
}
