import { ELEMENT_INFO_TOKEN, ElementInfo, FocusGroup } from "../core/FocusGroup";
import {
    focusableTagNames, focusOrderAttributeName,
    focusGroupAttributeName, focusManager
} from "../core/FocusManager";

class DomProcessor {
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

    processFromElement(rootElement: HTMLElement) {
        const selector = [...focusableTagNames, `[${focusGroupAttributeName}]`, `[${focusOrderAttributeName}]`].join(",");
        const elements = rootElement.querySelectorAll(selector);

        for (let i = 0, j = elements.length; i < j; i++) {
            this.processAddedElement(elements.item(i) as HTMLElement);
        }
    }
}

export const domProcessor = new DomProcessor();
