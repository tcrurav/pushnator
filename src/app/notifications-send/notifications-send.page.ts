import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { NotificationsService } from '../services/notifications.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-notifications-send',
  templateUrl: './notifications-send.page.html',
  styleUrls: ['./notifications-send.page.scss'],
})
export class NotificationsSendPage implements OnInit, OnDestroy {
  userName: string = "";
  channelName: string = "";

  title: string = "";
  body: string = "";
  recipient: string = "";
  recipients = [];
  foreground = [];
  background = [];

  loading = null;

  foregroundVisibility: string = "visible-msg";
  backgroundVisibility: string = "non-visible-msg";

  constructor(private notificationService: NotificationsService,
    private firebaseService: FirebaseService,
    private storage: StorageService,
    private loadingController: LoadingController,
    private toastController: ToastController) { }

  ngOnDestroy(): void {
    if (this.loading) this.loading.dismiss();
    console.log("ngOnDestroy------------------------------")
    //console.log(this.loading)
  }

  ngOnInit() {
    this.userName = this.notificationService.currentUserName;
    this.channelName = this.notificationService.currentChannelName;

    this.getRecipients();

    this.readLocalStorage();

    this.listenToStorageChanges()
  }

  async readLocalStorage() {
    let f = await this.storage.get("foregroundReceived");
    if (f != null) this.foreground = [...f.data];

    let b = await this.storage.get("backgroundReceived");
    if (b != null) this.background = [...b.data];
  }

  listenToStorageChanges() {
    this.storage.watchStorage().subscribe(message => {
      console.log("Llegó el cambio---------------------------------------");
      this.readLocalStorage();
    })
  }

  getRecipients() {
    console.log("hola0---------------------------------getRecipients")
    this.firebaseService.getDeviceCollectionByChannelId(this.notificationService.currentChannelId).snapshotChanges().subscribe(devices => {
      this.recipients = [];
      devices.map(d => {
        console.log("adios1----------------------------------------------")
        const t = d.payload.doc.get("token");
        const u = d.payload.doc.get("user_name");
        console.log(t);
        console.log("adios2----------------------------------------------")
        if (t != this.notificationService.currentToken) this.recipients.push({ token: t, userName: u });
      })
    })
  }

  sendNotification() {
    if (!this.loading) this.showLoading();
    this.notificationService.sendNotification(this.title, this.body, this.recipient).subscribe(res => {
      console.log(res);
      if (this.loading) {
        this.loading.dismiss();
        this.presentToast("Message sent");
      }
      console.log("sendNotification-----------------------------")
      //console.log(this.loading)
    });
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'sending message...',
      duration: 10000
    });

    this.loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    console.log(ev.detail.value)
    if(ev.detail.value == "foreground"){

      this.backgroundVisibility = "non-visible-msg";
      this.foregroundVisibility = "visible-msg";
    } else {
      this.foregroundVisibility = "non-visible-msg";
      this.backgroundVisibility = "visible-msg";
    }
  }

}
