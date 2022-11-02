// This does nothing except keep the app running when it is switched to the background.
// It solves the issue where during a PUSH Duo authentication, the app was pushed to
// the background but then failed to wait for Duo's response.

@NativeClass()
class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
  static ObjCProtocols = [UIApplicationDelegate];
  static ObjCExposedMethods = {
    runOnBackground: { returns: interop.types.void },
  };

  private bgTask;
  private timer;
  private timerCounter;

  applicationDidEnterBackground(application: UIApplication) {
    console.log("Enter background");
    this.bgTask = application.beginBackgroundTaskWithNameExpirationHandler(
      "MyTask",
      () => {
        this.endBackgroundTask();
      }
    );

    this.timerCounter = 5;
    console.log("Start logging numbers on background.");
    this.timer = NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(
      2,
      this,
      "runOnBackground",
      null,
      true
    );
  }

  applicationDidFinishLaunchingWithOptions(
    application: UIApplication,
    launchOptions: NSDictionary<string, any>
  ): boolean {
    return true;
  }

  runOnBackground(): void {
    if (this.timerCounter <= 0) {
      this.endBackgroundTask();

      return;
    }
    console.log(`${this.timerCounter} (the app is on background)`);
    this.timerCounter--;
  }

  private endBackgroundTask(): void {
    if (this.timer) {
      this.timer.invalidate();
      this.timer = null;
    }
    this.timerCounter = 5;
    UIApplication.sharedApplication.endBackgroundTask(this.bgTask);
    this.bgTask = UIBackgroundTaskInvalid;
    console.log("End of background task.");
  }
}

export { CustomAppDelegate };
