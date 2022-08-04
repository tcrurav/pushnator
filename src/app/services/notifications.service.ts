import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

const FCM_URL = "https://fcm.googleapis.com/fcm/send";
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json', 
    'Authorization': `key=${environment.SERVER_KEY}` 
  })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  currentToken: string = "";
  currentChannelId: string = "";
  currentChannelName: string = "";
  currentUserName: string = "";

  constructor(private httpClient: HttpClient, private storage: StorageService) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      console.log("Hola1---------------------------------------------");
      this.registerPush();
      console.log("Hola2---------------------------------------------");
    }
  }

  private registerPush() {
    console.log("Hola3---------------------------------------------");
    PushNotifications.requestPermissions().then(permission => {
      console.log("Hola4---------------------------------------------");
      if (permission.receive === 'granted') {
        console.log("Hola5---------------------------------------------");
        PushNotifications.register();
        console.log("Hola6---------------------------------------------");
      }
      else {
        // If permission is not granted
        console.log("Hola7---------------------------------------------");
      }
    });

    PushNotifications.addListener('registration', (token) => {
      console.log("Hola8---------------------------------------------");
      console.log(JSON.stringify(token));
      this.currentToken = token.value;
      console.log("Hola9---------------------------------------------");
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.log("Hola10---------------------------------------------");
      console.log(JSON.stringify(err));
      console.log("Hola11---------------------------------------------");
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification) => {
      console.log("Hola12---------------------------------------------");
      console.log(JSON.stringify(notification));
      console.log("Hola13---------------------------------------------");

      let foregroundReceivedSoFar = await this.storage.get("foregroundReceived");
      if (foregroundReceivedSoFar == null){
        foregroundReceivedSoFar = { data: [] };
      }
      console.log("Hola40---------------------------------------------");
      console.log(JSON.stringify({title: notification.title, body: notification.body}));
      foregroundReceivedSoFar.data.push({title: notification.title, body: notification.body, channelName: this.currentChannelName});
      console.log(JSON.stringify(foregroundReceivedSoFar));
      console.log("Hola41---------------------------------------------");
      this.storage.set("foregroundReceived", foregroundReceivedSoFar);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
      console.log("Hola14---------------------------------------------");
      console.log(JSON.stringify(notification));
      console.log("Hola15---------------------------------------------");

      let backgroundReceivedSoFar = await this.storage.get("backgroundReceived");
      if (backgroundReceivedSoFar == null){
        backgroundReceivedSoFar = { data: [] };
      }
      console.log("Hola30---------------------------------------------");
      backgroundReceivedSoFar.data.push({title: notification.notification.data.title, body: notification.notification.data.body, 
        channelName: this.currentChannelName});
      console.log(backgroundReceivedSoFar);
      console.log("Hola31---------------------------------------------");
      this.storage.set("backgroundReceived", backgroundReceivedSoFar);
    });

  }

  sendNotification(title: string, body: string, recipient: string) {
    const reqBody = {
      "to": recipient,
      "notification": {
        "title": title,
        "body": body,
        "sound": "default"
      },
      "data" : {
          "body" : body,
          "title": title
      }
    };

    return this.httpClient.post(FCM_URL, reqBody, httpOptions);
  }
}
