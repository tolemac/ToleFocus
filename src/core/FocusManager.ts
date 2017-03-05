import { FocusGroup, LoopBehavior } from "./FocusGroup";
import { domProcessor } from "../dom/DomProcessor";

export const focusGroupAttributeName = "focus-group";
export const focusOrderAttributeName = "focus-order";
export const autofocusAttributeName = "autofocus";
export const focusableTagNames = ["a", "select", "button", "input", "textarea"];
export const autofocusInspectAttributeValue = "observe";

export class FocusManager {
    private _enabled = false;
    private _root: FocusGroup;

    get root() {
        return this._root;
    }
    get enabled() {
        return this._enabled;
    }

    focusNext(currentElement?: HTMLElement) {
        if (!currentElement) {
            currentElement = document.activeElement as any;
        }
        const { group } = this.root.locateElementRecursively(currentElement);
        if (group) {
            let element = group.getNextElement(currentElement);
            while (!domProcessor.canElementGetFocus(element)) {
                const info = domProcessor.getElementInfo(element);
                element = info.parentGroup.getNextElement(element);
            }
            if (element) {
                element.focus();
            }
        }
    }

    focusPrior(currentElement?: HTMLElement) {
        if (!currentElement) {
            currentElement = document.activeElement as any;
        }
        const { group } = this.root.locateElementRecursively(currentElement);
        if (group) {
            let element = group.getPriorElement(currentElement);
            while (!domProcessor.canElementGetFocus(element)) {
                const info = domProcessor.getElementInfo(element);
                element = info.parentGroup.getPriorElement(element);
            }
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

    enable(rootElement?: HTMLElement,
        headBehavior: LoopBehavior = "loop",
        tailBehavior: LoopBehavior = "loop") {

        if (this._enabled) {
            this.disable();
        }
        if (!rootElement) {
            rootElement = document.body;
        }
        this._root = new FocusGroup(null, rootElement, headBehavior, tailBehavior);

        this._enabled = true;

        domProcessor.processFromElement(rootElement);
    }
}

export const focusManager = new FocusManager();
