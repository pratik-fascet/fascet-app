fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### test

```sh
[bundle exec] fastlane test
```

test lane

----


## iOS

### ios prepare

```sh
[bundle exec] fastlane ios prepare
```



### ios build

```sh
[bundle exec] fastlane ios build
```



### ios sync_all_development

```sh
[bundle exec] fastlane ios sync_all_development
```

Only run this to register your devices with the various Dev Portals for the apps. Make sure you have created a Devicefile

----


## Android

### android prepare

```sh
[bundle exec] fastlane android prepare
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
