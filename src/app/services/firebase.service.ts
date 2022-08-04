import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public firestore: AngularFirestore
  ) { }

  getChannelCollection() {
    const collection = this.firestore.collection("channels");
    return collection;
  }

  getDeviceCollectionByChannelId(channelId: string) {
    const collection = this.firestore.collection("/channels/" + channelId + "/devices");
    return collection;
  }

  getDeviceCollectionByChannelIdAndToken(channelId: string, token: string) {
    const collection = this.firestore.collection("/channels/" + channelId + "/devices", ref => ref.where("token", "==", token));
    return collection;
  }

  getChannelCollectionByChannelName(channelName: string) {
    console.log("getChannelCollectionByChannelName0-------------------------------------------------")
    console.log(channelName);
    const collection = this.firestore.collection("/channels", ref => ref.where('channel_name', '==', channelName));
    return collection;
  }

  createChannel(channelName: string){
    return this.firestore.collection("/channels").add({
      channel_name: channelName
      }
    );
  }

  addDeviceToChannel(channelId: string, token: string, userName: string){
    return this.firestore.collection("/channels/" + channelId + "/devices").add({
      token: token,
      user_name: userName
    });
  }

  updateUserNameToChannelDevice(channelId: string, deviceId: string, userName: string){
    return this.firestore.collection("/channels/" + channelId + "/devices").doc(deviceId).update({
      user_name: userName
    });
  }

}
