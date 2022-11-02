import { NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Page } from "@nativescript/core/ui/page";
import { ITotalsDTO } from "~/models/ITotalsDTO";
import DataService from "../shared/data.service";
import { AppState } from "./app.state";

export class AppScreen {
    private timerId: NodeJS.Timeout;

    constructor(
        public _activeRoute: ActivatedRoute,
        public _routerExtension: RouterExtensions,
        public _page: Page,
        public _dataService: DataService,
        public _appState: AppState
    ) {
        console.log("App Screen .ctor");
        this._page.on(Page.navigatedToEvent, () => this.pageOnInit());
        this._page.on(Page.navigatedFromEvent, () => this.pageDestroy());
    }

    pageOnInit() {
        this.timerId = setInterval(
            this.testConnection,
            5000,
            this._dataService,
            this._routerExtension,
            this._appState
        );
    }
    pageDestroy() {
        clearInterval(this.timerId);
    }

    testConnection(ds: DataService, re: RouterExtensions, st: AppState): void {
        console.log("Test Connection");
        ds.test()
            .then(() => {
                console.log("Connected");
                ds.getTotals().then((t: ITotalsDTO) => {
                    console.log(t);
                    st.setTotals(t);
                });
            })
            .catch((error: Error) => {
                if (error.message === "Logged Out") {
                    ds.clearConfig().then((success) => {
                        console.log("logoff", success);
                        re.navigate(["/login"], {
                            clearHistory: true,
                        });
                    });
                }
            });
    }
}
