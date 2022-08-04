import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { NotificationsService } from '../services/notifications.service';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-notifications-send',
  templateUrl: './notifications-send.page.html',
  styleUrls: ['./notifications-send.page.scss'],
})
export class NotificationsSendPage implements OnInit, OnDestroy {
  sendForm: FormGroup;
  isSubmitted = false;

  userName: string = "";
  channelName: string = "";

  title: string = "";
  body: string = "";
  recipient: string = "";
  recipients = [];

  loading = null;

  constructor(private notificationService: NotificationsService,
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public formBuilder: FormBuilder,
    private alertController: AlertController) { }

  ngOnDestroy(): void {
    if (this.loading) this.loading.dismiss();
    console.log("ngOnDestroy------------------------------")
    //console.log(this.loading)
  }

  ngOnInit() {
    this.sendForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      body: ['', [Validators.required, Validators.minLength(2)]],
      recipient: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.userName = this.notificationService.currentUserName;
    this.channelName = this.notificationService.currentChannelName;

    this.getRecipients();
  }

  get errorControl() {
    return this.sendForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.sendForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.sendForm.value)
      this.sendNotification();
    }
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
      }), (error) => {
        this.presentAlert();
      }
    });
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
    }, (error) => {
      this.presentAlert();
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

  async presentAlert() {
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
