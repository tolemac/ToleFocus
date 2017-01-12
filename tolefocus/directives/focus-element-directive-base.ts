import { ElementRef } from "@angular/core";
import { FocusGroupDirective } from "./focus-group.directive";

export class FocusElementDirectiveBase {
    protected focusOrder: number;
    constructor(protected fg: FocusGroupDirective, protected element: ElementRef) {
    }

    ngOnInit() {
        if (this.fg) {
            this.fg.registerChild(this.element.nativeElement, this.focusOrder);
        }
    }
}
