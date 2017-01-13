import { FocusGroup } from "./FocusGroup";
import { domProcessor } from "../dom/DomProcessor";

export const focusGroupAttributeName = "focusGroup";
export const focusOrderAttributeName = "focusOrder";
export const focusableTagNames = ["a", "select", "button", "input", "textarea"];

export class FocusManager {
    private _enabled = false;
    private _root: FocusGroup;

    get root() {
        return this._root;
    }
    get enabled() {
        return this._enabled;
    }

    focusNext(currentElement: HTMLElement) {
        const {group} = this.root.locateElementRecursively(currentElement);
        if (group) {
            const element = group.getNextElement(currentElement);
            if (element) {
                element.focus();
            }
        }
    }

    focusPrior(currentElement: HTMLElement) {
        const {group} = this.root.locateElementRecursively(currentElement);
        if (group) {
            const element = group.getPriorElement(currentElement);
            if (element) {
                element.focus();
            }
        }
    }

    disable() {
        if (!this._enabled) {
            return;
        }
        this._enabled = false;
    }

    enable(rootElement?: HTMLElement) {
        if (this._enabled) {
            this.disable();
        }
        if (!rootElement) {
            rootElement = document.body;
        }
        this._root = new FocusGroup(null, null);

        this._enabled = true;

        domProcessor.processFromElement(rootElement);
    }
}

export const focusManager = new FocusManager();
