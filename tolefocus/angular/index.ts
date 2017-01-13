import { NgModule } from "@angular/core";

import "../index";
import { FocusGroupDirective } from "./FocusGroupDirective";
import { FocusOrderDirective, createElementDirectives } from "./ElementDirectives";

const exportedDeclarations = [
    FocusGroupDirective,
    FocusOrderDirective,
    ... createElementDirectives()
];

@NgModule({
    declarations: [...exportedDeclarations],
    exports: [...exportedDeclarations]
})
export class ToleFocusModule { }
