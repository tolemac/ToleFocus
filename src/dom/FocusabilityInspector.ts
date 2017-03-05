import { domProcessor } from "./DomProcessor";

const frequency = 100;
export type FocusabilityInspectorCallback = (isFocusable: boolean) => void;

export class FocusabilityInspector {
    static inspectorsList: FocusabilityInspector[] = [];
    focusable: boolean;
    intervalHandle: any;

    static stopAll() {
        while (this.inspectorsList.length > 0) {
            this.inspectorsList[0].stop();
        }
    }

    constructor(private element: HTMLElement, private callback: FocusabilityInspectorCallback) {
        this.focusable = domProcessor.canElementGetFocus(element);
        this.intervalHandle = setInterval(this.check, frequency);
        FocusabilityInspector.inspectorsList.push(this);
    }

    check = () => {
        const focusable = domProcessor.canElementGetFocus(this.element);
        if (focusable !== this.focusable) {
            this.focusable = focusable;
            this.callback(this.focusable);
        }
    }

    stop() {
        clearInterval(this.intervalHandle);
        const index = FocusabilityInspector.inspectorsList.indexOf(this);
        FocusabilityInspector.inspectorsList.splice(index, 1);
    }
}
