import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptRouterModule,
    NativeScriptCommonModule,
} from "@nativescript/angular";
import { DocumentsComponent } from "./documents.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "documents" },
            { path: "documents", component: DocumentsComponent },
        ]),
    ],
    declarations: [DocumentsComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class DocumentsModule {}
