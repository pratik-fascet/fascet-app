import { Component, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Page } from "@nativescript/core/ui/page";
import DataService from "../shared/data.service";
import { WebView, LoadEventData } from "@nativescript/core/ui/web-view";
import { AppState } from "../shared/app.state";

@Component({
    selector: "dundas",
    moduleId: module.id,
    templateUrl: "./dundas.component.html",
    styleUrls: ["./dundas.component.scss"],
})
export class DundasComponent {
    showBrowser: boolean = false;
    inError: boolean = false;
    busy: boolean = true;
    empty: boolean = false;
    webViewSrc: string;
    webView: WebView;
    loggedOff: boolean = false;
    timerId: NodeJS.Timeout;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Dundas .ctor");
        this._page.actionBarHidden = true;
        this._page.on(Page.navigatedToEvent, () => this.pageOnInit());
        this._page.on(Page.navigatedFromEvent, () => this.pageDestroy());
    }

    @HostListener("unloaded")
    onPause() {
        console.log("Dundas onPause 2");
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    pageOnInit() {
        console.log("Dundas onInit");
    }

    pageDestroy() {
        console.log("Dundas onDestroy");
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    @HostListener("loaded")
    loaded(): void {
        if (!this.timerId) {
            this.timerId = setInterval(this.testConnection.bind(this), 2000);
        }
        console.log("Dundas loaded");
        if (this._appState.resetDundas.value || !this.viewingDashboard()) {
            this.webViewSrc = "";
            if (this.webView) {
                console.log("Destroying web view");
                this.webView.stopLoading();
                if (this.webView.android) {
                    this.webView.android.clearCache(true);
                    this.webView.android.destroy();
                    this.webView.android.loadUrl("about:blank");
                }
            }
            this.resetDundasUrl();
            this._appState.resetDundas.next(false);
        }
    }

    resetDundasUrl() {
        console.log("Resetting Dundas Url");
        this.showBrowser = false;
        this.inError = false;
        this.busy = true;
        this.empty = false;
        this._dataService
            .getDashboardUrl()
            .then((url) => {
                console.log("New Dundas url", url);
                this.webViewSrc = url;
            })
            .catch((err) => {
                console.log("Dundas error", err);
                this.inError = true;
                this.busy = false;
                this.webView.reload();
                if (this.webView.android) {
                    this.webView.android.reload();
                }
            });
    }

    onLoadStarted(args: LoadEventData) {
        console.log("Load Started", this.webViewSrc);
        this.busy = true;
        this.inError = false;
        this.showBrowser = false;
        this.empty = false;
        this.webView = args.object as WebView;
        if (this.webView.android) {
            this.webView.android.getSettings().setDomStorageEnabled(true);
            this.webView.android.getSettings().setDatabaseEnabled(true);
        }
        if (!args.error) {
            console.log(`EventName: ${args.eventName}`);
            console.log(`NavigationType: ${args.navigationType}`);
            console.log(`Url: ${args.url}`);
            if (args.url.indexOf("LogOn") > -1) {
                this.loggedOff = true;
                console.log("We're logged off!");
            }
        } else {
            console.log(`EventName: ${args.eventName}`);
            console.log(`Error: ${args.error}`);
        }

        if (this.webView) {
            console.log("Current url", this.webView.src);
            let webTitle = "";
            if (this.webView.ios) {
                webTitle = this.webView.ios.title;
            } else if (this.webView.android) {
                webTitle = this.webView.android.getTitle();
            }
            console.log("webTitle", webTitle);
        }
    }

    onLoadFinished(args: LoadEventData) {
        console.log("Load Finished", this.webViewSrc);

        if (this.webView) {
            console.log("Current url", this.webView.src);
            let webTitle = "";
            if (this.webView.ios) {
                webTitle = this.webView.ios.title;
            } else if (this.webView.android) {
                webTitle = this.webView.android.getTitle();
            }
            console.log("webTitle", webTitle);
        }

        this.busy = false;
        if (args.url === "about:blank") {
            this.empty = true;

            return;
        }
        if (this.loggedOff) {
            this.loggedOff = false;
            this.resetDundasUrl();

            return;
        }
        this.empty = false;
        this.showBrowser = true;
        if (!args.error) {
            this.inError = false;
            console.log(`EventName: ${args.eventName}`);
            console.log(`NavigationType: ${args.navigationType}`);
            console.log(`Url: ${args.url}`);
        } else {
            this.inError = true;
            console.log(`EventName: ${args.eventName}`);
            console.log(`Error: ${args.error}`);
        }
    }

    viewingDashboard(): boolean {
        if (this.webView) {
            console.log("Current url", this.webView.src);
            let webTitle = "";
            if (this.webView.ios) {
                webTitle = this.webView.ios.title;
            } else if (this.webView.android) {
                webTitle = this.webView.android.getTitle();
            }
            console.log("webTitle", webTitle);
            if (webTitle.substr(0, 9) === "Dashboard") {
                return true;
            }
        }

        return false;
    }

    testConnection(): void {
        console.log("Test Dundas Connection");
        if (!this.showBrowser) {
            return;
        }
        if (!this.viewingDashboard()) {
            this.resetDundasUrl();
        }
    }
}
