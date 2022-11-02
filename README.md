# Fascet Mobile App

This project is written in [Nativescript](https://nativescript.org). Nativescript allows you
to build mobile apps targeting both Android and iOS using Typescript and Angular. It is an open source technology
maintained by [Telerik](https://telerik.com).

The app provides the following functionality:

1. Implements DUO two factor authentication (in combination with the right DNN JWT auth provider)
2. Shows the user their Dundas BI dashboard
3. Shows the user their DNN messages and allows them to reply and create new messages
4. Shows documents and allows them to view those documents

Todo:

- Allow certain users to switch and emulate other users

## Code Organization

All code is under /src. Here are the main screens:

### ```login```

The login screen is the one that kicks things off. It does the following:
- Check the server is not under maintenance
- Test the authentication to see if the user is still logged in (potentially refreshes the JWT token)
- If authenticated it will go straight to the home screen, otherwise it will remain visible and prompt for login

### ```duo```

If the user is logging in, then this screen will be shown to provide the user the choice of DUO options. Once cleared we can move on to the home screen.

### ```home```

This is a tabbed screen (3 tabs) allowing the user to switch easily between the main parts of the application.

### ```dundas```, ```messages```, ```documents```

The three main panels of the home screen

### ```messagecompose```, ```messagethread```

Detail screens for the messages part

### ```maintenance```

Screen to be shown when the server is down for maintenance

## Running this app

You'll need to install Nativescript. Description is here:
[https://docs.nativescript.org/angular/start/quick-setup](https://docs.nativescript.org/angular/start/quick-setup)
I only did steps 1 and 2 from the Quick setup as I already had XCode on my Mac OSX installed.

Then all you'd need to do is clone the repository and use

```
tns run ios
```

(or "android" respectively) to start running the app on either a simulator or a real device.


