import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { NotificationsService } from '../services/notifications.service';
import { StorageService } from '../services/storage.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Network } from '@capacitor/network';

@Component({
  selector: 'app-choose-channel',
  templateUrl: './choose-channel.page.html',
  styleUrls: ['./choose-channel.page.scss'],
})
export class ChooseChannelPage implements OnInit, OnDestroy {

  channelForm: FormGroup;
  isSubmitted = false;

  // channelName: string = "";
  // userName: string = "";

  loading = null;

  internetConnection: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private router: Router,
    private loadingController: LoadingController,
    private storage: StorageService,
    public formBuilder: FormBuilder,
    private alertController: AlertController) { }

  ngOnInit() {
    this.channelForm = this.formBuilder.group({
      channelName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.storage.get("channelName").then(channelName => {
      console.log("ngOnInit1-choose------------------------------")
      console.log(JSON.stringify(channelName))
      if (channelName) this.channelForm.get("channelName").setValue(channelName);
    });

    this.storage.get("userName").then(userName => {
      console.log("ngOnInit2-choose-----------------------------")
      console.log(JSON.stringify(userName))
      if (userName) this.channelForm.get("userName").setValue(userName);
    });

    this.checkNetworkStatus();
  }

  checkNetworkStatus(){
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed-------------------------------------------', JSON.stringify(status));
      if(!status.connected){
        this.presentAlert('Connection Error. Check that you have INTERNET.');
        this.internetConnection = false;
      } else {
        this.internetConnection = true;
      }
    });
  }

  get errorControl() {
    return this.channelForm.controls;
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

  async submitForm() {
    this.isSubmitted = true;
    if (!this.channelForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.channelForm.value)
      const status = await Network.getStatus();
      if(!status.connected) {
        this.presentAlert('Connection Error. Check your INTERNET Connection.');
        return;
      }
      
      this.useOrCreateChannel();
    }
  }

  useOrCreateChannel() {
    if (!this.loading) this.showLoading();

    console.log("useOrCreateChannel0-------------------------------------------------")
    console.log(this.channelForm.get("channelName").value);
    this.firebaseService.getChannelCollectionByChannelName(this.channelForm.get("channelName").value).get().subscribe(channels => {
      console.log("useOrCreateChannel1-------------------------------------------------")
      console.log(JSON.stringify(channels));
      // if(channels.metadata.;
      // ) {
      //   this.presentAlert();
      //   return;
      // }
      if (channels.size == 0) {
        console.log("useOrCreateChannel2-------------------------------------------------")
        this.createChannelAndAddDevice(this.channelForm.get("channelName").value, this.notificationsService.currentToken,
          this.channelForm.get("userName").value);
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
            this.addDeviceToChannel(channelId, this.notificationsService.currentToken, this.channelForm.get("userName").value);
            console.log("useOrCreateChannel8-------------------------------------------------")
            return;
          }

          const oldUserName = devices.docs[0].get("user_name");
          const deviceId = devices.docs[0].id;
          if (oldUserName != this.channelForm.get("userName").value) {
            this.updateUserNameToChannelDevice(channelId, deviceId, this.channelForm.get("userName").value);
            return;
          }
          console.log("useOrCreateChannel9-------------------------------------------------")

          this.goToNotificationsPage(channelId, this.channelForm.get("userName").value);
          console.log("useOrCreateChannel10-------------------------------------------------")
        }, (error) => {
          console.log("Error5-------------------------------------------------")
          console.log(JSON.stringify(error));
          this.presentAlert(error.message);
        });
      console.log("useOrCreateChannel11-------------------------------------------------")
    }, (error) => {
      console.log("Error4-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert(error.message);
    });
    console.log("useOrCreateChannel12-------------------------------------------------")
  }

  goToNotificationsPage(channelId: string, userName: string) {
    this.notificationsService.currentChannelId = channelId;
    this.notificationsService.currentUserName = userName;
    this.notificationsService.currentChannelName = this.channelForm.get("channelName").value;

    this.storage.set("channelName", this.channelForm.get("channelName").value);
    this.storage.set("userName", this.channelForm.get("userName").value);

    if (this.loading) this.loading.dismiss();

    this.router.navigate(['/tabs']);
  }

  createChannelAndAddDevice(channelName: string, token: string, userName: string) {
    console.log("useOrCreateChannel13-------------------------------------------------")
    this.firebaseService.createChannel(channelName).then(channel => {
      console.log("useOrCreateChannel14-------------------------------------------------")
      this.addDeviceToChannel(channel.id, token, userName);
      console.log("useOrCreateChannel15-------------------------------------------------")
    }).catch(error => {
      console.log("Error3-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert(error.message);
    });;
  }

  addDeviceToChannel(channelId: string, token: string, userName: string) {
    console.log("useOrCreateChannel16-------------------------------------------------")
    this.firebaseService.addDeviceToChannel(channelId, token, userName).then(res => {
      this.goToNotificationsPage(channelId, userName);
    }).catch(error => {
      console.log("Error2-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert(error.message);
    });
  }

  updateUserNameToChannelDevice(channelId: string, deviceId: string, userName: string) {
    this.firebaseService.updateUserNameToChannelDevice(channelId, deviceId, userName).then(res => {
      this.goToNotificationsPage(channelId, userName);
    }).catch(error => {
      console.log("Error1-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert(error.message);
    });
  }

  async presentAlert(msg: string) {
    if (this.loading) this.loading.dismiss();

    const alert = await this.alertController.create({
      header: 'Alert!',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        }
      ]
    });

    await alert.present();
  }

}
