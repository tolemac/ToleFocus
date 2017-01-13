import { ELEMENT_INFO_TOKEN, ElementInfo, FocusGroup } from "../core/FocusGroup";
import {
    focusableTagNames, focusOrderAttributeName,
    focusGroupAttributeName, focusManager
} from "../core/FocusManager";

export class FocusObserver {
    private _enabled = false;
    private _rootElement: HTMLElement;
    private observer = new MutationObserver((mutations) => this.observerCallback(mutations));

    get enabled() {
        return this._enabled;
    }

    get rootElement() {
        return this._rootElement;
    }

    disable() {
        if (!this._enabled) {
            return;
        }
        this.observer.disconnect();
        this._enabled = false;
    }

    enableOnBody() {
        this.enable(document.body);
    }

    enable(rootElement: HTMLElement) {
        if (this._enabled) {
            this.disable();
        }

        const config = {
            // attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        };
        this.observer.observe(rootElement as Node, config);
    }

    observerCallback(mutations: MutationRecord[]) {
        mutations.forEach((mutation) => this.processMutation(mutation));
    }

    getElementInfo(element: HTMLElement) {
        return element[ELEMENT_INFO_TOKEN] as ElementInfo;
    }

    removeGroup(element: HTMLElement) {
        const info = this.getElementInfo(element);
        info.parentGroup.remove(info.group);
    }

    removeElement(element: HTMLElement) {
        const info = this.getElementInfo(element);
        info.parentGroup.remove(element);
    }

    isGroup(element: HTMLElement) {
        const focusGroupAttributeValue = element.getAttribute(focusGroupAttributeName);
        return focusGroupAttributeValue !== null && focusGroupAttributeValue !== undefined;
    }

    isElement(element: HTMLElement) {
        const focusOrderAttributeValue = element.getAttribute(focusOrderAttributeName);
        return focusableTagNames.indexOf(element.tagName.toLowerCase()) >= 0 ||
            (focusOrderAttributeValue !== null && focusOrderAttributeValue !== undefined)
    }

    processRemovedElement(element: HTMLElement) {
        if (!element.getAttribute) {
            return;
        }
        if (this.isGroup(element)) {
            this.removeGroup(element);
        } else if (this.isElement(element)) {
            this.removeElement(element);
        }
    }

    processMutation(mutation: MutationRecord) {
        if (mutation.type === "childList") {
            for (let i = 0, j = mutation.addedNodes.length; i < j; i++) {
                this.processAddedElement(mutation.addedNodes.item(i) as HTMLElement);
            }
            for (let i = 0, j = mutation.removedNodes.length; i < j; i++) {
                this.processRemovedElement(mutation.removedNodes.item(i) as HTMLElement);
            }
        }
    }

    locateParentGroupElement(element: HTMLElement): HTMLElement {
        let current = element;
        while ((current = current.parentElement) !== null) {
            if (this.isGroup(current)) {
                return current;
            }
        }
        return current;
    }

    getElementOrder(element: HTMLElement) {
        const focusOrderAttributeValue = element.getAttribute(focusOrderAttributeName);
        if (focusOrderAttributeValue !== null && focusOrderAttributeValue !== undefined) {
            return parseInt(focusOrderAttributeValue, 10);
        }
    }

    addGroup(element: HTMLElement) {
        const parentGroupElement = this.locateParentGroupElement(element);
        const parentGroup = parentGroupElement ?
            this.getElementInfo(parentGroupElement).group :
            focusManager.root;

        parentGroup.add(new FocusGroup(parentGroup, element), this.getElementOrder(element));
    }

    addElement(element: HTMLElement) {
        const parentGroupElement = this.locateParentGroupElement(element);
        const parentGroup = parentGroupElement ?
            this.getElementInfo(parentGroupElement).group :
            focusManager.root;

        parentGroup.add(element, this.getElementOrder(element));
    }

    processAddedElement(element: HTMLElement) {
        if (!element.getAttribute) {
            return;
        }
        if (this.isGroup(element)) {
            this.addGroup(element);
        } else if (this.isElement(element)) {
            this.addElement(element);
        }
    }
}

export const focusObserver = new FocusObserver();
