import { FocusGroup } from "./FocusGroup";

export class FocusManager {
    root = new FocusGroup(null, null);

    focusNext(currentElement: HTMLElement) {
        const {group, elementIndex} = this.root.locateElementRecursively(currentElement);
        if (group) {
            const element = group.getNextElement(currentElement);
            if (element) {
                element.focus();
            }
        //     const element = direction === "next" ?
        //         this.getNextElement(group, groupIndex, elementIndex) :
        //         this.getPriorElement(group, groupIndex, elementIndex);
        //     if (element) {
        //         element.focus();
        //     }
        }
    }

    focusPrior(currentElement: HTMLElement) {
        const {group, elementIndex} = this.root.locateElementRecursively(currentElement);
        if (group) {
            const element = group.getPriorElement(currentElement);
            if (element) {
                element.focus();
            }
        }
    }
}

export const focusManager = new FocusManager();
