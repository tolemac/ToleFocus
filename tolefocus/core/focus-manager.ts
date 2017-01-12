import { OrderedList } from "./ordered-list";
import { ElementEventsHandler } from "./element-events-handler";

type Elem = HTMLElement;

// type FocusElement = {
//     element: Elem;
//     order?: number;
// };

const HANDLED_TOKEN = "HANDLED_TOKEN";

export class FocusGroup {
    elements = new OrderedList<Elem>();

    constructor(public groupElement: Elem) {
    }

    addElement(element: Elem, focusOrder?: number) {
        this.elements.add(element, focusOrder);
        if (!element[HANDLED_TOKEN]) {
            element[HANDLED_TOKEN] = new ElementEventsHandler(element);
        }
    }

    removeElement(element: Elem) {
        if (element[HANDLED_TOKEN]) {
            (element[HANDLED_TOKEN] as ElementEventsHandler).unhandle();
        }
        this.elements.remove(element);
    }
}

type LoopBehavior = "stop" | "loop";

class FocusManager {

    headBehavior: LoopBehavior = "stop";
    tailBehavior: LoopBehavior = "stop";

    groups = new OrderedList<FocusGroup>();
    addGroup(element: Elem, order?: number) {
        if (this.groups.orderedItems.findIndex((item) => item.object.groupElement === element) < 0) {
            this.groups.add(new FocusGroup(element), order);
        }
    }

    getGroup(element: Elem) {
        const result = this.groups.orderedItems.find((item) => item.object.groupElement === element);
        if (result) {
            return result.object;
        }
        return undefined;
    }

    removeGroup(element: Elem) {
        this.groups.remove(this.getGroup(element));
    }

    private locateGroupByContentElement(element: Elem): {
        group: FocusGroup,
        groupIndex: number,
        elementIndex: number
    } {
        const group = this.groups.orderedItems.find((currentGroup) => {
            let _elem = currentGroup.object.elements.orderedItems.find((currentElem) => {
                return currentElem.object === element;
            });

            return !!_elem;
        });

        if (group) {
            const groupIndex = this.groups.orderedItems.findIndex((item) => item.object === group.object);
            const elementIndex = group.object.elements.orderedItems.findIndex((item) => item.object === element);
            return { group: group.object, groupIndex, elementIndex };

        } else {
            return { group: undefined, groupIndex: null, elementIndex: null };
        }
    }

    getNextElementInGroup(group: FocusGroup, elementIndex: number) {
        if (elementIndex < group.elements.orderedItems.length - 1) {
            return group.elements.orderedItems[elementIndex + 1].object;
        } else {
            if (this.tailBehavior === "loop") {
                return group.elements.orderedItems[0].object;
            }
        }
    }

    getPriorElementInGroup(group: FocusGroup, elementIndex: number) {
        if (elementIndex > 0) {
            return group.elements.orderedItems[elementIndex - 1].object;
        } else {
            if (this.headBehavior === "loop") {
                return group.elements.orderedItems[group.elements.orderedItems.length - 1].object;
            }
        }
    }

    getNextElement(group: FocusGroup, groupIndex: number, elementIndex: number) {
        let nextElement = this.getNextElementInGroup(group, elementIndex);
        if (!nextElement) {
            if (groupIndex < this.groups.orderedItems.length - 1) {
                nextElement = this.groups.orderedItems[groupIndex + 1].object.elements.orderedItems[0].object;
            } else {
                if (this.tailBehavior === "loop") {
                    nextElement = this.groups.orderedItems[0].object.elements.orderedItems[0].object;
                }
            }
        }
        return nextElement;
    }

    getPriorElement(group: FocusGroup, groupIndex: number, elementIndex: number) {
        let priorElement = this.getPriorElementInGroup(group, elementIndex);
        if (!priorElement) {
            if (groupIndex > 0) {
                const elemCount = this.groups.orderedItems[groupIndex - 1].object.elements.orderedItems.length;
                priorElement = this.groups.orderedItems[groupIndex - 1].object.elements.orderedItems[elemCount - 1].object;
            } else {
                if (this.headBehavior === "loop") {
                    priorElement = this.groups.orderedItems[this.groups.orderedItems.length - 1].object.elements.orderedItems[0].object;
                }
            }
        }
        return priorElement;
    }

    private moveFocus(currentElem: Elem, direction: "next" | "prior") {
        const {group, groupIndex, elementIndex} = this.locateGroupByContentElement(currentElem);
        if (group) {
            const element = direction === "next" ?
                this.getNextElement(group, groupIndex, elementIndex) :
                this.getPriorElement(group, groupIndex, elementIndex);
            if (element) {
                element.focus();
            }
        }
    }

    focusNext(currentElem: Elem) {
        this.moveFocus(currentElem, "next");
    }

    focusPrior(currentElem: Elem) {
        this.moveFocus(currentElem, "prior");
    }
}

export const focusManager = new FocusManager();
