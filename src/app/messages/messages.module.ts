import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptRouterModule,
    NativeScriptCommonModule,
} from "@nativescript/angular";
import { MessagesComponent } from "./messages.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "messages" },
            { path: "messages", component: MessagesComponent },
        ])
    ],
    declarations: [
        MessagesComponent,
    ],
    providers: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MessagesModule {}
