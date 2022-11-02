import { Component } from "@angular/core";
import { Page, Dialogs, EventData, ListPicker } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { ILoginResponse, IDevice } from "~/models/ILoginResponse";
import { AppState } from "../shared/app.state";
import DataService from "../shared/data.service";

@Component({
    selector: "Duo",
    moduleId: module.id,
    templateUrl: "./duo.component.html",
    styleUrls: ["./duo.component.scss"],
})
export class DuoComponent {
    isBusy: boolean = true;
    displayName: string = "";
    devices: Array<IDevice>;
    // Auth Methods
    canPush: boolean = false;
    canSMS: boolean = false;
    canPhone: boolean = false;
    canMobileOTP: boolean = false;
    deviceId: string = "";

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Duo .ctor", this._appState.loginResponse.value);
        this._page.actionBarHidden = true;
        if (this._appState.loginResponse.value) {
            this.devices = this._appState.loginResponse.value.devices;
            this.displayName = this._appState.loginResponse.value.displayName;
        } else {
            this.devices = new Array<IDevice>();
        }
        if (this.devices.length > 0) {
            this.setDevice(0);
        }
        this.isBusy = false;
    }

    setDevice(index: number): void {
        const device = this.devices[index];
        this.canMobileOTP = device.CanMobileOTP;
        this.canPhone = device.CanPhone;
        this.canPush = device.CanPush;
        this.canSMS = device.CanSMS;
        this.deviceId = device.DeviceId;
    }

    onSelectedIndexChanged(args: EventData) {
        const picker = <ListPicker>args.object;
        this.setDevice(picker.selectedIndex);
    }

    handleError(error: Error): void {
        console.log("Duo error", JSON.stringify(error));
        Dialogs.alert({
            title: "Failed",
            message: error.message,
            okButtonText: "Ok",
        });
    }

    navHome(response: ILoginResponse): void {
        this._appState.loginResponse.next(response);
        console.log("Navigating to home screen");
        this._dataService
            .getMessagesModule()
            .then(() => {
                this._routerExtension.navigate(["/home/default"], {
                    clearHistory: true,
                });
            })
            .catch((err) => {
                console.log("getMessagesModule error " + err);
            });
    }

    handlePasscodeRequest(response?: ILoginResponse): void {
        this.isBusy = false;
        if (response) {
            this._appState.loginResponse.next(response);
        }
        Dialogs.prompt({
            title: "Enter Code",
            message: "Enter the code you've received.",
            okButtonText: "Ok",
            cancelButtonText: "Cancel",
            inputType: "number",
        }).then((r) => {
            if (r.result === true) {
                this._dataService
                    .login(r.text, "", this.deviceId)
                    .then((r2) => this.navHome(r2))
                    .catch((e) => this.handleError(e));
            }
        });
    }

    doPush(ev): void {
        this.isBusy = true;
        this._dataService
            .login("", "push", this.deviceId)
            .then((r) => this.navHome(r))
            .catch((e) => this.handleError(e));
    }

    doSMS(ev): void {
        this.isBusy = true;
        this._dataService
            .login("", "sms", this.deviceId)
            .then((r) => this.handlePasscodeRequest(r))
            .catch((e) => this.handleError(e));
    }

    doPhone(ev): void {
        this.isBusy = true;
        this._dataService
            .login("", "phone", this.deviceId)
            .then((r) => this.handlePasscodeRequest(r))
            .catch((e) => this.handleError(e));
    }

    doCode(ev): void {
        this.handlePasscodeRequest();
    }
}
