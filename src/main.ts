import { platformNativeScriptDynamic } from "@nativescript/angular";
import { AppModule } from "./app/app.module";
import * as application from "@nativescript/core/application";
import { Dialogs } from "@nativescript/core";
import { exit } from "nativescript-exit";
import { CustomAppDelegate } from "./app/shared/custom-app-delegate";

if (application.ios) {
  application.ios.delegate = CustomAppDelegate;
}

platformNativeScriptDynamic().bootstrapModule(AppModule);

if (!(global as any).process) {
  (global as any).process = {};
}
if (!(global as any).process.restart) {
  (global as any).process.restart = (msg) => {
    if (global.android) {
      const mStartActivity = new android.content.Intent(
        application.android.context,
        application.android.startActivity.getClass()
      );
      const mPendingIntentId = parseInt(
        (Math.random() * 100000).toString(),
        10
      );
      const mPendingIntent = android.app.PendingIntent.getActivity(
        application.android.context,
        mPendingIntentId,
        mStartActivity,
        android.app.PendingIntent.FLAG_CANCEL_CURRENT
      );
      const mgr = application.android.context.getSystemService(
        android.content.Context.ALARM_SERVICE
      );
      mgr.set(
        android.app.AlarmManager.RTC,
        java.lang.System.currentTimeMillis() + 100,
        mPendingIntent
      );
      android.os.Process.killProcess(android.os.Process.myPid());
    } else if ((global as any).ios) {
      Dialogs.alert({
        title: "Please restart application",
        message: msg || "The application needs to be restarted.",
        okButtonText: "Quit!",
      }).then(() => {
        exit();
      });

      return false;
    }
  };
}
