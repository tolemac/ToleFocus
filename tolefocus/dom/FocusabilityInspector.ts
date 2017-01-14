import { domProcessor } from "./DomProcessor";

const frequency = 100;
type FocusabilityInspectorCallback = (isFocusable: boolean) => void;

export class FocusabilityInspector {
    focusable: boolean;
    intervalHandle: any;

    constructor(private element: HTMLElement, private callback: FocusabilityInspectorCallback) {
        this.focusable = domProcessor.canElementGetFocus(element);
        this.intervalHandle = setInterval(this.check, frequency);
    }

    check = () => {
        const focusable = domProcessor.canElementGetFocus(this.element);
        if (focusable !== this.focusable) {
            this.focusable = focusable;
            this.callback(this.focusable);
        }
    };

    stop() {
        clearInterval(this.intervalHandle);
    }
}
