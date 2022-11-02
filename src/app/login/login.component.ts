import { Component } from "@angular/core";
import { Dialogs, EventData, Frame, Page, Switch } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { ServiceConfig } from "~/models/IServiceConfig";
import { ILoginResponse } from "~/models/ILoginResponse";
import DataService from "../shared/data.service";
import { AppState } from "../shared/app.state";

const topmost = Frame.topmost;

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    password: string;
    email: string;
    isBusy: boolean = true;
    saveLogin: boolean = false;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Login .ctor");
        this._page.actionBarHidden = true;
        this._appState.resetDocuments.next(true);
        this._appState.resetDundas.next(true);
        this._appState.resetHome.next(true);
        this._appState.resetMessages.next(true);
        this._appState.resetSwitchUsers.next(true);
        const login = this._dataService.retrieveLoginFromStorage();
        this.email = login.Username;
        this.password = login.Password;
        if (login.Username !== "") {
            this.saveLogin = true;
        }
        this._dataService
            .ping()
            .then((operational) => {
                if (operational) {
                    this._dataService
                        .test()
                        .then(() => {
                            const c = this._dataService.config;
                            this._dataService.removeConfig();
                            this._dataService.config = c;
                            this._routerExtension.navigate(["/home/default"], {
                                clearHistory: true,
                            });
                        })
                        .catch(() => {
                            this.isBusy = false;
                        });
                } else {
                    this.isBusy = false;
                    this._routerExtension.navigate(["/maintenance"], {
                        clearHistory: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Ping exception", error);
                this.isBusy = false;
                this._routerExtension.navigate(["/maintenance"], {
                    clearHistory: true,
                });
            });
    }

    doLogin(args: EventData): void {
        console.log("doLogin");
        this.isBusy = true;
        const page = topmost().currentPage;
        const txtEmail = page.getViewById("txtEmail");
        const txtPassword = page.getViewById("txtPassword");

        if (!this.email) {
            txtEmail.className = "form-input m-t-10 form-input-required";
        } else {
            txtEmail.className = "form-input m-t-10";
        }

        if (!this.password) {
            txtPassword.className = "form-input m-t-10 form-input-required";
        } else {
            txtPassword.className = "form-input m-t-10";
        }

        if (this.email && this.password) {
            this._dataService.config = new ServiceConfig({
                ...this._dataService.config.site,
                Username: this.email,
                Password: this.password,
            });
            if (this.saveLogin) {
                this._dataService.saveLoginToStorage(this.email, this.password);
            }
            this._dataService
                .login()
                .then((response: ILoginResponse) => {
                    this.isBusy = false;
                    this._appState.loginResponse.next(response);
                    if (response.accessToken && response.accessToken !== "") {
                        this._dataService
                            .getMessagesModule()
                            .then(() => {
                                this._routerExtension.navigate(
                                    ["/home/default"],
                                    {
                                        clearHistory: true,
                                    }
                                );
                            })
                            .catch((err) => {
                                console.log("getMessagesModule error " + err);
                            });
                    } else {
                        this._routerExtension.navigate(["/duo"], {
                            clearHistory: true,
                        });
                    }
                })
                .catch((error: Error) => {
                    console.log("login error", error);
                    Dialogs.alert({
                        title: "Login Problem",
                        message: error.message,
                        okButtonText: "Ok",
                        cancelable: false,
                    }).then(() => {
                        this.isBusy = false;
                    });
                });
        }
    }

    onCheckedChange(args: EventData) {
        const sw = args.object as Switch;
        this.saveLogin = sw.checked;
        if (!this.saveLogin) {
            this._dataService.removeLoginFromStorage();
        }
    }
}
