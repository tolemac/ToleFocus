import { NgModule } from "@angular/core";

import { FocusGroupDirective } from "./directives/FocusGroupDirective";
import { FocusOrderDirective, createElementDirectives } from "./directives/ElementDirectives";

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
