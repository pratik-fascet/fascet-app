import { IJwtToken } from "./IJwtToken";
import { ISite } from "./ISite";

export interface IServiceConfig {
    token?: IJwtToken | null;
    site: ISite;
}

export class ServiceConfig implements IServiceConfig {
    token?: IJwtToken;
    site: ISite;
    constructor(site: ISite, token?: IJwtToken) {
        this.site = site;
        this.token = token;
    }
}
