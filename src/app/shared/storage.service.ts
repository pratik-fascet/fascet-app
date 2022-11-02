import { SecureStorage } from "nativescript-secure-storage";
import { ILogin, Login } from "~/models/ILogin";
import { IServiceConfig, ServiceConfig } from "~/models/IServiceConfig";
import { Site } from "~/models/ISite";
import { SiteUrl } from "./globals";

export default class StorageService {
    private _secureStorage: SecureStorage;
    private _config: IServiceConfig;
    private _authStorageKey = "auth";
    private _loginStorageKey = "login";

    constructor() {
        this._secureStorage = new SecureStorage();
    }

    retrieveLoginFromStorage(): ILogin {
        const login: string = this._secureStorage.getSync({
            key: this._loginStorageKey,
        });
        if (login === null) {
            return new Login("", "");
        } else {
            return JSON.parse(login);
        }
    }

    removeLoginFromStorage() {
        this._secureStorage.setSync({
            key: this._loginStorageKey,
            value: JSON.stringify(new Login("", "")),
        });
    }

    saveLoginToStorage(username: string, password: string) {
        this._secureStorage.setSync({
            key: this._loginStorageKey,
            value: JSON.stringify(new Login(username, password)),
        });
    }

    get config(): IServiceConfig {
        console.log("Getting config");
        if (this._config) {
            return this._config;
        } else {
            const auth: string = this._secureStorage.getSync({
                key: this._authStorageKey,
            });
            if (auth == null) {
                return new ServiceConfig(new Site(SiteUrl));
            } else {
                return JSON.parse(auth);
            }
        }
    }

    set config(config: IServiceConfig) {
        console.log("Setting config");
        this._config = config;
    }

    persistConfig(): void {
        console.log("Storing config", JSON.stringify(this._config));
        this._secureStorage.setSync({
            key: this._authStorageKey,
            value: JSON.stringify(this._config),
        });
    }

    removeConfig(): void {
        this._secureStorage.removeSync({
            key: this._authStorageKey,
        });
    }

    clearConfig(): Promise<boolean> {
        this._config = null;

        return this._secureStorage.remove({
            key: this._authStorageKey,
        });
    }
}
