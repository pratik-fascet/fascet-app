export interface ISite {
    Username: string;
    Password: string;
    MessagesModuleId: number;
    MessagesTabId: number;
}

export class Site implements ISite {
    Username: string;
    Password: string;
    MessagesModuleId: number;
    MessagesTabId: number;
    constructor(host: string) {
        this.Username = "";
        this.Password = "";
        this.MessagesModuleId = -1;
        this.MessagesTabId = -1;
    }
}
