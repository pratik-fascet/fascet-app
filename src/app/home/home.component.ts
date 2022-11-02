import { Component, HostListener, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Dialogs, Page } from "@nativescript/core";
import DataService from "../shared/data.service";
import { AppState } from "../shared/app.state";
import { AppScreen } from "../shared/appscreen";
import { ITotalsDTO } from "~/models/ITotalsDTO";
import { Subscription } from "rxjs";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})
export class HomeComponent extends AppScreen {
    displayName: string = "";
    currentTabName: string = "";
    isEmployee: boolean = false;
    totals: ITotalsDTO = {
        TotalNotifications: 0,
        TotalUnreadMessages: 0,
    };
    private totalsSub: Subscription;

    constructor(
        public _ngZone: NgZone,
        _activeRoute: ActivatedRoute,
        _routerExtension: RouterExtensions,
        _page: Page,
        _dataService: DataService,
        _appState: AppState
    ) {
        super(_activeRoute, _routerExtension, _page, _dataService, _appState);
        console.log("Home .ctor");
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        console.log("Home ngOnInit");
        this.totalsSub = this._appState.totals.subscribe((value) => {
            this._ngZone.run(() => (this.totals = value));
        });
        this._routerExtension.navigate(
            [
                {
                    outlets: {
                        dundasTab: ["dundas"],
                        messagesTab: ["messages"],
                        documentsTab: ["documents"],
                    },
                },
            ],
            { relativeTo: this._activeRoute }
        );
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.totalsSub.unsubscribe();
    }

    @HostListener("loaded")
    loaded(): void {
        console.log("Login loaded");
        if (this._appState.resetHome.value) {
            this.currentTabName = this._dataService.config.token.displayName;
            this.displayName = this._dataService.config.token.displayName;
            this.isEmployee = this._dataService.config.token.isEmployee;
            if (this.isEmployee) {
                this._dataService
                    .getSwitchableUsers()
                    .then((users) => {
                        console.log(users);
                        this._appState.switchUsers.next(users);
                    })
                    .catch((error) => {
                        console.log("get sw users error", error);
                        Dialogs.alert({
                            title: "Getting Users Problem",
                            message: error.message,
                            okButtonText: "Ok",
                            cancelable: false,
                        });
                    });
            } else {
                this._dataService
                    .getTeamUsers()
                    .then((users) => {
                        console.log(users);
                        this._appState.teamUsers.next(users);
                    })
                    .catch((error) => {
                        console.log("get team users error", error);
                        Dialogs.alert({
                            title: "Getting Team Problem",
                            message: error.message,
                            okButtonText: "Ok",
                            cancelable: false,
                        });
                    });
            }
            this._appState.resetHome.next(false);
        }
    }

    doSwitchUsers(): void {
        this._routerExtension.navigate(["/switchusers"], {
            clearHistory: false,
        });
    }

    doTeamUsers(): void {
        this._routerExtension.navigate(["/teamusers"], {
            clearHistory: false,
        });
    }

    doLogoff(): void {
        console.log("logoff");
        Dialogs.confirm({
            title: "Log off",
            message: "Do you wish to log off?",
            okButtonText: "Ok",
            cancelButtonText: "Cancel",
        }).then((r) => {
            if (r) {
                this._dataService.logout().then((response) => {
                    console.log(response);
                    this._dataService.clearConfig().then((success) => {
                        console.log("logoff", success);
                        if (success) {
                            this._routerExtension.navigate(["/login"], {
                                clearHistory: true,
                            });
                        }
                    });
                });
            }
        });
    }
}
