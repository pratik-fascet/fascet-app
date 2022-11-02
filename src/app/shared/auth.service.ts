import Service from "./service";
import { IJwtToken, JwtToken } from "~/models/IJwtToken";
import { ServiceConfig } from "~/models/IServiceConfig";
import { ILoginResponse } from "~/models/ILoginResponse";
import { IDnnModule } from "~/models/IDnnModule";
import { ISite } from "~/models/ISite";
import { IUser } from "~/models/IUser";
import { SiteUrl } from "../shared/globals";

export default class AuthService extends Service {
    refreshing: boolean = false;

    login(
        passCode?: string,
        authMethod?: string,
        deviceId?: string
    ): Promise<any> {
        console.log("login");

        const loginCmd: any = {
            u: this.config.site.Username,
            p: this.config.site.Password,
        };
        if (passCode) {
            loginCmd.c = passCode;
        }
        if (authMethod) {
            loginCmd.m = authMethod;
        }
        if (deviceId) {
            loginCmd.d = deviceId;
        }

        return this.authRequest(
            "POST",
            "login",
            false,
            JSON.stringify(loginCmd)
        )
            .then((response) => {
                console.log("login response", JSON.stringify(response));
                if (response.status === 401) {
                    console.log("login", response.status);
                    throw new Error("Login Failed");
                } else if (response.status > 399) {
                    throw new Error("Invalid Request");
                } else {
                    return response;
                }
            })
            .then((response) => response.json())
            .then((response: ILoginResponse) => {
                const token = new JwtToken(response);
                this.saveConfig(this.config.site, token);
                this.refreshing = false;

                return response;
            });
    }

    logout(): Promise<any> {
        console.log("logout");

        return this.authRequest("GET", "logout", true, null)
            .then((response) => {
                if (response.status === 401) {
                    console.log("logout", response.status);
                    throw new Error("Login Failed");
                } else if (response.status > 399) {
                    throw new Error("Invalid Request");
                } else {
                    return response;
                }
            })
            .then((response) => response.json());
    }

    refreshToken(): Promise<any> {
        console.log("refreshToken " + this.refreshing.toString());
        if (!this.config.token) {
            throw new Error("Cannot refresh 6 empty token");
        }

        if (this.refreshing) {
            throw new Error("Must wait for refresh");
        }

        this.refreshing = true;

        return this.authRequest(
            "POST",
            "extendtoken",
            true,
            JSON.stringify({ rtoken: this.config.token.renewalToken })
        )
            .then((response) => {
                console.log("refreshToken", response.status);
                if (response.status === 401) {
                    return this.login();
                } else if (response.status > 399) {
                    throw new Error("Invalid Request");
                } else {
                    this.refreshing = false;

                    return response;
                }
            })
            .then((response) => response.json())
            .then((token: IJwtToken) => {
                console.log("refreshToken response: ", token);
                this.saveConfig(this.config.site, token);
            });
    }

    testGet(): Promise<any> {
        return this.authRequest("GET", "testget", true, null);
    }

    switchUser(user: IUser): Promise<any> {
        console.log("switchUser");

        return this.authRequest(
            "POST",
            "SwitchUser",
            true,
            JSON.stringify(user)
        )
            .then((response) => {
                console.log("switchUser", response.status);
                if (response.status !== 200) {
                    throw new Error("Can't switch to this user");
                } else {
                    return response;
                }
            })
            .then((response) => response.json())
            .then((token: IJwtToken) => {
                console.log("switchUser response: ", token);
                this.saveConfig(this.config.site, token);
                this.persistConfig();
                return true;
            });
    }

    testPost(msg: string): Promise<any> {
        return this.authRequest(
            "POST",
            "testpost",
            true,
            JSON.stringify({ text: msg })
        );
    }

    ping(): Promise<boolean> {
        console.log("Running ping");

        return this.authRequest("GET", "Ping", false, null).then((response) => {
            console.log("ping", response);

            return response.status === 200;
        });
    }

    test(): Promise<any> {
        console.log("Running test");

        return this.authRequest("GET", "testget", true, null).then(
            (response) => {
                console.log("test", response.status);
                if (response.status === 401) {
                    if (
                        this.config.token &&
                        this.config.token.renewalToken &&
                        this.config.token.renewalToken !== ""
                    ) {
                        return this.refreshToken();
                    } else {
                        throw new Error("Logged Out");
                    }
                } else if (response.status > 399) {
                    throw new Error("Invalid Request");
                } else {
                    return response;
                }
            }
        );
    }

    saveMessagesModule(module: IDnnModule) {
        console.log("saveMessagesModule ", module);
        const site = this.config.site;
        site.MessagesModuleId = module.ModuleId;
        site.MessagesTabId = module.TabId;
        this.saveConfig(site, this.config.token);
    }

    private saveConfig(site: ISite, token: IJwtToken) {
        console.log("saveConfig ", site, token);
        this.config = new ServiceConfig(site, token);
    }

    private authRequest(
        method: string,
        action: string,
        includeAuth: boolean,
        body: any
    ): Promise<any> {
        const url = `https://${SiteUrl}/DesktopModules/DuoJwtAuth/API/mobile/${action}`;
        const headers: any = {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json; charset=utf-8",
            "Cache-Control": "no-cache",
        };
        console.log(url, includeAuth, this.config.token, body);
        if (includeAuth && this.config.token) {
            headers.Authorization = "Bearer " + this.config.token.accessToken;
        }
        const fetchParams: RequestInit = {
            method,
            mode: "cors",
            credentials: "omit",
            body,
            headers,
        };

        return fetch(url, fetchParams);
    }
}
