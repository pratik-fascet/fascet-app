import { NativeScriptConfig } from "@nativescript/core";

export default {
    id: "com.sageworthapps.portal",
    appPath: "src",
    appResourcesPath: "App_Resources",
    android: {
        v8Flags: "--expose_gc",
        markingMode: "none",
    },
} as NativeScriptConfig;
