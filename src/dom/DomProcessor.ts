import { ELEMENT_INFO_TOKEN, ElementInfo, FocusGroup, LoopBehavior } from "../core/FocusGroup";
import {
    focusableTagNames, focusOrderAttributeName, autofocusAttributeName,
    focusGroupAttributeName, focusManager, autofocusInspectAttributeValue
} from "../core/FocusManager";
import { FocusabilityInspector } from "./FocusabilityInspector";
export { ElementInfo } from "../core/FocusGroup";

export const INSPECT_TOKEN = "TOLEFOCUS_INSPECTOR";

export class DomProcessor {

    private _customSelectors: string[] = [];
    private _canElementGetFocusHandler: (element: HTMLElement) => boolean;

    setCanElementGetFocusHandler(handler: (element: HTMLElement) => boolean) {
        this._canElementGetFocusHandler = handler;
    }

    addCustomSelector(selector: string) {
        this._customSelectors.push(selector);
    }

    removeCustomSelector(selector: string) {
        const index = this._customSelectors.indexOf(selector);
        if (index) {
            this._customSelectors.splice(index, 1);
        }
    }

    private getFocusElementsSelector() {
        return [
            ...focusableTagNames,
            "[" + focusGroupAttributeName + "]",
            "[" + focusOrderAttributeName + "]",
            ...this._customSelectors
        ].join(",");
    }

    removeGroup(element: HTMLElement) {
        const info = this.getElementInfo(element);
        if (info) {
            info.parentGroup.remove(info.group);
        }
    }

    removeElement(element: HTMLElement) {
        const info = this.getElementInfo(element);
        if (info) {
            info.parentGroup.remove(element);
        }

        if (element[INSPECT_TOKEN]) {
            (element[INSPECT_TOKEN] as FocusabilityInspector).stop();
        }
    }

    getElementInfo(element: HTMLElement): ElementInfo {
        return element[ELEMENT_INFO_TOKEN] as ElementInfo;
    }

    isGroup(element: HTMLElement) {
        const focusGroupAttributeValue = element.getAttribute(focusGroupAttributeName);
        return focusGroupAttributeValue !== null && focusGroupAttributeValue !== undefined;
    }

    isElement(element: HTMLElement) {
        const focusOrderAttributeValue = element.getAttribute(focusOrderAttributeName);
        return element.matches(this.getFocusElementsSelector()) ||
            (focusOrderAttributeValue !== null && focusOrderAttributeValue !== undefined);
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
        if (focusOrderAttributeValue !== null &&
            focusOrderAttributeValue !== undefined &&
            focusOrderAttributeValue !== "") {
            return parseInt(focusOrderAttributeValue, 10);
        }
    }

    isGroupChildren(group: HTMLElement, element: HTMLElement) {
        while (element.parentElement !== null) {
            if (this.isGroup(element.parentElement) || element.parentElement === document.body) {
                return element.parentElement === group;
            }
            element = element.parentElement;
        }
        return false;
    }

    getDOMOrderInGroup(groupElement: HTMLElement, element: HTMLElement) {
        const elements = groupElement.querySelectorAll(this.getFocusElementsSelector());
        const directChildren: any[] = [];
        for (let i = 0, j = elements.length; i < j; i++) {
            const current = elements.item(i);
            if (this.isGroupChildren(groupElement, current as HTMLElement)) {
                directChildren.push(current);
            }
        }
        for (let i = 0, j = directChildren.length; i < j; i++) {
            if (directChildren[i] === element) {
                return i;
            }
        };
    }

    getGroupProperties(element: HTMLElement) {
        const value = element.getAttribute(focusGroupAttributeName);
        if (value === "") {
            return { head: undefined, tail: undefined };
        }
        const parts = value.split(" ").filter(part => part !== "").filter((_value, index) => index < 2);

        let tail: string, head: string;

        if (parts.length === 1) {
            tail = parts[0];
            head = parts[0];
        } else if (parts.length === 2) {
            head = parts[0];
            tail = parts[1];
        }

        return { head, tail };
    }

    addGroup(element: HTMLElement) {
        const parentGroupElement = this.locateParentGroupElement(element);
        const parentGroup = parentGroupElement ?
            this.getElementInfo(parentGroupElement).group :
            focusManager.root;
        const { head, tail } = this.getGroupProperties(element);
        const group = new FocusGroup(parentGroup, element, head as LoopBehavior, tail as LoopBehavior);

        parentGroup.add(group, this.getElementOrder(element));
    }

    canElementGetFocus(element: HTMLElement) {
        if (this._canElementGetFocusHandler) {
            const result = this._canElementGetFocusHandler(element);
            if (result !== undefined) {
                return result;
            }
        }
        const visible = element.offsetParent !== null;
        const disable = !!element["disabled"];
        return visible && !disable;
    }

    addElement(element: HTMLElement) {
        const parentGroupElement = this.locateParentGroupElement(element);
        const parentGroup = parentGroupElement ?
            this.getElementInfo(parentGroupElement).group :
            focusManager.root;

        parentGroup.add(element, this.getElementOrder(element));
        const autofocusValue = element.getAttribute(autofocusAttributeName);
        if (autofocusValue !== null && autofocusValue !== undefined) {
            if (this.canElementGetFocus(element)) {
                element.focus();
            }
            if (autofocusValue === autofocusInspectAttributeValue) {
                element[INSPECT_TOKEN] = new FocusabilityInspector(element, (isFocusable) => {
                    if (isFocusable) {
                        element.focus();
                    }
                });
            }
        }
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

    removeChildrenFromElement(rootElement: HTMLElement) {
        if (!rootElement.getAttribute) {
            return;
        }
        const elements = rootElement.querySelectorAll(this.getFocusElementsSelector());

        for (let i = 0, j = elements.length; i < j; i++) {
            this.processRemovedElement(elements.item(i) as HTMLElement);
        }
    }

    processFromElement(rootElement: HTMLElement) {
        if (!rootElement.getAttribute) {
            return;
        }
        const elements = rootElement.querySelectorAll(this.getFocusElementsSelector());

        for (let i = 0, j = elements.length; i < j; i++) {
            this.processAddedElement(elements.item(i) as HTMLElement);
        }
    }
}

export const domProcessor = new DomProcessor();
