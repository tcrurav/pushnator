# Pushnator

An App that shows how push notifications work with Ionic in 3 steps

## Getting Started

Install:
* a full ionic develop environment. 
* a full Android development environment.
* a Firebase Android project with Firestore module.

And after that:

* Download this project repo.

```
git clone https://github.com/tcrurav/pushnator.git
```

* Install dependencies:

```
cd push
npm install
```

* Edit the file push/environments/environment.ts with the firebaseConfig and SERVER_Key data of your firebase project:

```
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "<apiKey>",
    authDomain: "<authDomain>",
    databaseURL: "<databaseURL>",
    projectId: "<projectId>",
    storageBucket: "<storageBucket>",
    messagingSenderId: "<messagingSenderId>",
    appId: "<projectappIdId>",
    measurementId: "<measurementId>"
  },
  SERVER_KEY: '<SERVER_KEY>'
};
```

* Download the google-services.json file from Firebase. We will place this file in our android folder "/push/android/app/google-services.json"

* Build the ionic project. The folder www will be created:

```
ionic build
```

* Copy the assets and synchronize the plugins to the android project:

```
npx cap copy
npx cap sync
```

* Open the project in Android Studio:

```
npx cap open android
```

* Run the project in a mobile phone and/or an Android simulator. At least 2 instances so that you can send/receive a push notification from one to the other.

Enjoy!

### Prerequisites

All you need is... some time and...
* Visual Studio Code.
* Ionic.
* Android Studio.
* Firebase Android Project.
* Firebase Firestore Database.
* More hours than you first could think of...

## Built With

* [Visual Studio Code](https://code.visualstudio.com/) - The Editor used in this project
* [Ionic 6](https://ionicframework.com/docs/intro) - Ionic Framework is an open source UI toolkit for building performant, high-quality mobile and desktop apps using web technologies (HTML, CSS, and JavaScript).
* [Firebase Firestore](https://console.firebase.google.com/) - Store and sync data with a NoSQL cloud database.
* [Android Studio](https://developer.android.com/studio/install?hl=es-419) - Android Studio provides the fastest tools for building apps on every type of Android device.

## Acknowledgments

* https://gist.github.com/PurpleBooth/109311bb0361f32d87a2. A very complete template for README.md files.
* https://mabbkhawaja.medium.com/firebase-push-notifications-in-ionic-capacitor-app-android-eccea502dad3. Firebase push notifications in ionic capacitor app (Android).
* https://www.joshmorony.com/production-development-environment-variables-in-ionic-angular/. Production/Development Environment Variables in Ionic & Angular.
* https://ionicframework.com/docs/theming/color-generator. Ionic Theme Generator.
* https://www.positronx.io/ionic-form-validation-tutorial/. Ionic 6 Form Validation Tutorial with Reactive Forms.