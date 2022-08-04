import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { NotificationsService } from '../services/notifications.service';
import { StorageService } from '../services/storage.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-choose-channel',
  templateUrl: './choose-channel.page.html',
  styleUrls: ['./choose-channel.page.scss'],
})
export class ChooseChannelPage implements OnInit, OnDestroy {

  channelForm: FormGroup;
  isSubmitted = false;

  channelName: string = "";
  userName: string = "";

  loading = null;

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
      this.channelName = channelName;
    });

    this.storage.get("userName").then(userName => {
      this.userName = userName;
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

  submitForm() {
    this.isSubmitted = true;
    if (!this.channelForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.channelForm.value)
      this.useOrCreateChannel();
    }
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
        }, (error) => {
          console.log("Error5-------------------------------------------------")
          console.log(JSON.stringify(error));
          this.presentAlert();
        });
      console.log("useOrCreateChannel11-------------------------------------------------")
    }, (error) => {
      console.log("Error4-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert();
    });
    console.log("useOrCreateChannel12-------------------------------------------------")
  }

  goToNotificationsPage(channelId: string, userName: string) {
    this.notificationsService.currentChannelId = channelId;
    this.notificationsService.currentUserName = userName;
    this.notificationsService.currentChannelName = this.channelName;

    this.storage.set("channelName", this.channelName);
    this.storage.set("userName", this.userName);

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
      this.presentAlert();
    });;
  }

  addDeviceToChannel(channelId: string, token: string, userName: string) {
    console.log("useOrCreateChannel16-------------------------------------------------")
    this.firebaseService.addDeviceToChannel(channelId, token, userName).then(res => {
      this.goToNotificationsPage(channelId, userName);
    }).catch(error => {
      console.log("Error2-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert();
    });
  }

  updateUserNameToChannelDevice(channelId: string, deviceId: string, userName: string) {
    this.firebaseService.updateUserNameToChannelDevice(channelId, deviceId, userName).then(res => {
      this.goToNotificationsPage(channelId, userName);
    }).catch(error => {
      console.log("Error1-------------------------------------------------")
      console.log(JSON.stringify(error));
      this.presentAlert();
    });
  }

  async presentAlert() {
    if (this.loading) this.loading.dismiss();

    const alert = await this.alertController.create({
      header: 'Alert!',
      message: 'Connection Error. Try it later.',
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
