import { ILoginResponse } from "./ILoginResponse";

export interface IJwtToken {
    displayName: string;
    isEmployee: boolean;
    accessToken: string;
    renewalToken: string;
}

export class JwtToken implements IJwtToken {
    displayName: string;
    isEmployee: boolean;
    accessToken: string;
    renewalToken: string;
    constructor(response: ILoginResponse) {
        this.accessToken = response.accessToken;
        this.displayName = response.displayName;
        this.isEmployee = response.isEmployee;
        this.renewalToken = response.renewalToken;
    }
}

export interface IJwtPayload {
    sid: string;
    role: Array<string>;
    iss: string;
    exp: number;
    nbf: number;
}
