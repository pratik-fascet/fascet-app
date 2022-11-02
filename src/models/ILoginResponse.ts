export interface ILoginResponse {
    userId: number;
    displayName: string;
    isEmployee: boolean;
    accessToken: string;
    renewalToken: string;
    devices: Array<IDevice>;
}

export interface IDevice {
    CanAuto: boolean;
    CanPush: boolean;
    CanSMS: boolean;
    CanPhone: boolean;
    CanMobileOTP: boolean;
    Capabilities: Array<string>;
    DeviceId: string;
    DisplayName: string;
    Name: string;
    SMS_NextCode: string;
    PhoneNumber: string;
    Type: string;
}
