import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptRouterModule,
    NSEmptyOutletComponent,
    NativeScriptCommonModule,
} from "@nativescript/angular";
import { HomeComponent } from "./home.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            {
                path: "default",
                component: HomeComponent,
                children: [
                    {
                        path: "dundas",
                        outlet: "dundasTab",
                        component: NSEmptyOutletComponent,
                        loadChildren: () =>
                            import("~/app/dundas/dundas.module").then(
                                (m) => m.DundasModule
                            ),
                    },
                    {
                        path: "messages",
                        outlet: "messagesTab",
                        component: NSEmptyOutletComponent,
                        loadChildren: () =>
                            import("~/app/messages/messages.module").then(
                                (m) => m.MessagesModule
                            ),
                    },
                    {
                        path: "documents",
                        outlet: "documentsTab",
                        component: NSEmptyOutletComponent,
                        loadChildren: () =>
                            import("~/app/documents/documents.module").then(
                                (m) => m.DocumentsModule
                            ),
                    },
                ],
            },
        ]),
    ],
    declarations: [HomeComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}
