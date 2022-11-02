import {
    NgModule,
    NgModuleFactoryLoader,
    NO_ERRORS_SCHEMA,
    ErrorHandler,
} from "@angular/core";
import {
    NativeScriptModule,
    NSModuleFactoryLoader,
    NativeScriptFormsModule,
} from "@nativescript/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { DuoComponent } from "./duo/duo.component";
import { Trace } from "@nativescript/core";
import { MessagethreadComponent } from "./messagethread/messagethread.component";
import { MessagecomposeComponent } from "./messagecompose/messagecompose.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { SwitchusersComponent } from "./switchusers/switchusers.component";
import { TeamusersComponent } from "./teamusers/teamusers.component";

Trace.enable();

export class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("### ErrorHandler Error: " + error.toString());
        console.log("### ErrorHandler Stack: " + error.stack);
    }
}

// tslint:disable-next-line:max-classes-per-file
@NgModule({
    bootstrap: [AppComponent],
    imports: [NativeScriptModule, NativeScriptFormsModule, AppRoutingModule],
    declarations: [
        AppComponent,
        MaintenanceComponent,
        LoginComponent,
        DuoComponent,
        MessagethreadComponent,
        MessagecomposeComponent,
        SwitchusersComponent,
        TeamusersComponent
    ],
    providers: [
        { provide: ErrorHandler, useClass: MyErrorHandler },
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
