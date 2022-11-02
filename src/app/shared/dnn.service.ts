import AuthService from "./auth.service";
import { IDnnModule } from "~/models/IDnnModule";
import { SiteUrl } from "../shared/globals";

export default class DnnService extends AuthService {
    FascetModule = "Fascet/DnnMobile";
    MessagesModule = "CoreMessaging";
    InternalServices = "InternalServices";

    getMessagesModule(): Promise<IDnnModule> {
        return this.request(
            "GET",
            this.FascetModule,
            "Dnn",
            "FindMessagesModule",
            null,
            null
        ).then((r: IDnnModule) => {
            console.log("Getting: ", r);
            this.saveMessagesModule(r);

            return r;
        });
    }

    request<T>(
        method: string,
        module: string,
        controller: string,
        action: string,
        params: any,
        body: any,
        moduleId: number = null,
        tabId: number = null,
        refreshToken: boolean = false,
        retryCount: number = 2
    ): Promise<T> {
        if (!this.config) {
            throw new Error("config is null");
        }
        if (!this.config.token) {
            throw new Error("config token is null");
        }
        if (!this.config.token.accessToken) {
            throw new Error("config access token is null");
        }
        console.log("We have a token");
        const url =
            `https://${SiteUrl}/API/${module}/${controller}/${action}` +
            this.getQueryString(params);
        const headers: any = {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json; charset=utf-8",
            "Cache-Control": "no-cache",
            ModuleId: moduleId,
            TabId: tabId,
            Authorization: "Bearer " + this.config.token.accessToken,
        };
        console.log(action, this.config.token, headers, retryCount);
        const fetchParams: RequestInit = {
            method,
            mode: "cors",
            credentials: "omit",
            body: body ? JSON.stringify(body) : null,
            headers,
        };

        if (refreshToken && retryCount > 0) {
            return this.refreshToken()
                .then(() => {
                    return this.request(
                        method,
                        module,
                        controller,
                        action,
                        params,
                        body,
                        moduleId,
                        tabId,
                        false,
                        retryCount - 1
                    ) as Promise<T>;
                })
                .catch(() => {
                    throw new Error("Logged Out");
                });
        } else if (retryCount > 0) {
            console.log("Fetching", url, fetchParams);

            return fetch(url, fetchParams)
                .then((response: Response) => {
                    console.log("Response", action, response.status);
                    if (response.status === 401) {
                        if (
                            this.config.token &&
                            this.config.token.renewalToken &&
                            this.config.token.renewalToken !== ""
                        ) {
                            throw new Error("Renew");
                        } else {
                            throw new Error("Logged Out");
                        }
                    } else if (response.status > 399) {
                        console.log(response.statusText);
                        throw new Error("Invalid Request here");
                    } else {
                        return response;
                    }
                })
                .then((r) => r.json())
                .catch((e) => {
                    console.log("Error", e);
                    if (e.message === "Renew") {
                        console.log("Must go on");

                        return this.request(
                            method,
                            module,
                            controller,
                            action,
                            params,
                            body,
                            moduleId,
                            tabId,
                            true,
                            retryCount - 1
                        );
                    } else {
                        throw new Error(e);
                    }
                });
        }
    }
}
