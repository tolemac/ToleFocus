import { Directive, ElementRef } from "@angular/core";
import { focusManager, FocusGroup } from "../core/focus-manager";

@Directive({
    selector: "[focusGroup]"
})
export class FocusGroupDirective {
    group: FocusGroup;

    constructor(private element: ElementRef) {
        focusManager.addGroup(element.nativeElement);
        this.group = focusManager.getGroup(element.nativeElement);
    }

    registerChild(elem: any, order?: number) {
        if (elem === this.element.nativeElement) {
            return;
        }
        this.group.addElement(elem);
    }
}
