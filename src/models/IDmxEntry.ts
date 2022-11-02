export interface IDmxEntry {
    Cid: number;
    Eid: number;
    Pid: number;
    Etype: string;
    IsFile: boolean;
    IsFolder: boolean;
    IsLink: boolean;
    Title: string;
    Filename: string;
    LastModified: Date;
    Author: string;
}

export class DmxEntry implements IDmxEntry {
    Cid: number;
    Eid: number;
    Pid: number;
    Etype: string = "Collection";
    IsFile: boolean = false;
    IsFolder: boolean = true;
    IsLink: boolean = false;
    Title: string;
    Filename: string;
    LastModified: Date;
    Author: string;
    constructor(id: number, pid: number, title: string) {
        this.Eid = id;
        this.Pid = pid;
        this.Title = title;
        this.LastModified = new Date();
    }
}
