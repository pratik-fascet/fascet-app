import { Component, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Page } from "@nativescript/core/ui/page";
import * as moment from "moment";
import DataService from "../shared/data.service";
import { IDmxEntry, DmxEntry } from "~/models/IDmxEntry";
import { ItemEventData } from "@nativescript/core/ui/list-view";
import * as http from "@nativescript/core/http";
import * as utils from "@nativescript/core/utils/utils";
import IParams from "../../models/IParams";
import { knownFolders, Folder, File, path } from "@nativescript/core/file-system";
import { SiteUrl } from "../shared/globals";
import { AppState } from "../shared/app.state";

@Component({
    selector: "documents",
    moduleId: module.id,
    templateUrl: "documents.component.html",
    styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent {
    entries: Array<IDmxEntry> = [];
    currentFolderId: number = -1;
    topFolderId: number = -1;
    parents: any = {};
    busy: boolean = false;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Documents .ctor 1");
        this._page.actionBarHidden = true;
    }

    @HostListener("loaded")
    loaded(): void {
        console.log("Documents loaded");
        if (this._appState.resetDocuments.value) {
            this.loadFolder(-1, false);
            this._appState.resetDocuments.next(false);
        }
    }

    loadFolder(folderId: number, navigatingUp: boolean) {
        console.log("loadFolder", folderId, navigatingUp);
        this.busy = true;
        this.entries = [];
        if (!navigatingUp) {
            this.parents[folderId] = this.currentFolderId;
        }
        this._dataService.getDmxFolderContents(folderId).then((r) => {
            if (folderId === -1 || folderId === this.topFolderId) {
                if (r.length > 0) {
                    this.topFolderId = r[0].Cid;
                }
            } else {
                this.entries.push(
                    new DmxEntry(
                        this.parents[folderId],
                        -1,
                        "Up one level ...."
                    )
                );
            }
            this.entries = this.entries.concat(r);
            this.currentFolderId = folderId;
            this.busy = false;
        });
    }

    onItemTap(args: ItemEventData) {
        if (this.busy) {
            return;
        }
        const index = args.index;
        const entry = this.entries[index];
        console.log(`ListView item tap ${entry.Eid}: ${entry.Title}`);
        if (entry.Pid === -1) {
            this.loadFolder(entry.Eid, true);
        } else if (entry.IsFolder) {
            this.loadFolder(entry.Eid, false);
        } else if (entry.IsFile) {
            this.openFile({
                name: entry.Title,
                authToken: this._dataService.config.token.accessToken,
                url: `https://${SiteUrl}/DesktopModules/Bring2mind/DMX/API/Entries/Download?PortalId=${entry.Pid}&EntryId=ent${entry.Eid}&Method=attachment`,
                fileName: entry.Filename,
            }).then((result) => {
                // return true if success
            });
        }
    }

    openFile(params: IParams): Promise<boolean> {
        const documentsFolder = knownFolders.documents();
        const dest = path.join(documentsFolder.path, params.fileName);
        this.busy = true;

        return http
            .getFile(
                {
                    url: params.url,
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + params.authToken,
                    },
                },
                dest
            )
            .then(
                (file) => {
                    console.log("Downloaded", file.path);
                    this.busy = false;
                    try {
                        utils.openFile(file.path);
                    } catch (e) {
                        console.log(e);

                        return false;
                    }

                    return true;
                },
                (e: Error) => {
                    console.log(e);
                    this.busy = false;

                    return false;
                }
            );
    }

    formatDate(date: Date): string {
        const d = moment(date);

        return d.format("l");
    }
}
