import { Directive, ElementRef, Optional, SkipSelf, Host } from "@angular/core";
import { focusManager, focusGroupAttributeName } from "../core/FocusManager";
import { FocusGroup } from "../core/FocusGroup";

@Directive({
    selector: `[${focusGroupAttributeName}]`
})
export class FocusGroupDirective {
    group: FocusGroup;
    focusOrder: number;

    constructor(private element: ElementRef, @SkipSelf() @Host() @Optional() private parentGroup: FocusGroupDirective) {
        this.group = new FocusGroup(parentGroup ? parentGroup.group : focusManager.root, element.nativeElement);
    }

    ngOnInit() {
        if (this.parentGroup) {
            this.parentGroup.registerChild(this.group, this.focusOrder);
        } else {
            focusManager.root.add(this.group, this.focusOrder);
        }
    }

    registerChild(elem: any, order?: number) {
        if (elem === this.element.nativeElement) {
            return;
        }
        this.group.add(elem);
    }

    ngOnDestroy() {
        if (this.parentGroup) {
            this.parentGroup.group.remove(this.group);
        } else {
            focusManager.root.remove(this.group);
        }
    }
}
