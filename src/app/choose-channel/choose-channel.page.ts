import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-choose-channel',
  templateUrl: './choose-channel.page.html',
  styleUrls: ['./choose-channel.page.scss'],
})
export class ChooseChannelPage implements OnInit, OnDestroy {

  channelName: string = "";
  userName: string = "";

  loading = null;

  constructor(
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private router: Router,
    private loadingController: LoadingController) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.loading) this.loading.dismiss();
    console.log("ngOnDestroy------------------------------")
    //console.log(this.loading)
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'connecting to channel...',
      duration: 10000
    });
    
    this.loading.present();
  }

  useOrCreateChannel() {
    if (!this.loading) this.showLoading();

    console.log("useOrCreateChannel0-------------------------------------------------")
    this.firebaseService.getChannelCollectionByChannelName(this.channelName).get().subscribe(channels => {
      console.log("useOrCreateChannel1-------------------------------------------------")
      if (channels.size == 0) {
        console.log("useOrCreateChannel2-------------------------------------------------")
        this.createChannelAndAddDevice(this.channelName, this.notificationsService.currentToken, this.userName);
        console.log("useOrCreateChannel3-------------------------------------------------")
        return;
      }

      console.log("useOrCreateChannel4-------------------------------------------------")
      console.log(JSON.stringify(channels));

      const channelId = channels.docs[0].id;
      console.log("useOrCreateChannel5-------------------------------------------------")
      this.firebaseService.getDeviceCollectionByChannelIdAndToken(channelId,
        this.notificationsService.currentToken).get().subscribe(devices => {
          console.log("useOrCreateChannel6-------------------------------------------------")
          if (devices.size == 0) {
            console.log("useOrCreateChannel7-------------------------------------------------")
            this.addDeviceToChannel(channelId, this.notificationsService.currentToken, this.userName);
            console.log("useOrCreateChannel8-------------------------------------------------")
            return;
          }

          const oldUserName = devices.docs[0].get("user_name");
          const deviceId = devices.docs[0].id;
          if (oldUserName != this.userName) {
            this.updateUserNameToChannelDevice(channelId, deviceId, this.userName);
            return;
          }
          console.log("useOrCreateChannel9-------------------------------------------------")

          this.goToNotificationsPage(channelId, this.userName);
          console.log("useOrCreateChannel10-------------------------------------------------")
        });
      console.log("useOrCreateChannel11-------------------------------------------------")
    });
    console.log("useOrCreateChannel12-------------------------------------------------")
  }

  goToNotificationsPage(channelId: string, userName: string) {
    this.notificationsService.currentChannelId = channelId;
    this.notificationsService.currentUserName = userName;
    this.notificationsService.currentChannelName = this.channelName;

    if (this.loading) this.loading.dismiss();

    this.router.navigate(['/tabs']);
  }

  createChannelAndAddDevice(channelName: string, token: string, userName: string) {
    console.log("useOrCreateChannel13-------------------------------------------------")
    this.firebaseService.createChannel(channelName).then(channel => {
      console.log("useOrCreateChannel14-------------------------------------------------")
      this.addDeviceToChannel(channel.id, token, userName);
      console.log("useOrCreateChannel15-------------------------------------------------")
    });
  }

  addDeviceToChannel(channelId: string, token: string, userName: string) {
    console.log("useOrCreateChannel16-------------------------------------------------")
    this.firebaseService.addDeviceToChannel(channelId, token, userName).then(res => {
      this.goToNotificationsPage(channelId, userName);
    });
  }

  updateUserNameToChannelDevice(channelId: string, deviceId: string, userName: string) {
    this.firebaseService.updateUserNameToChannelDevice(channelId, deviceId, userName).then(res => {
      this.goToNotificationsPage(channelId, userName);
    });
  }

}
