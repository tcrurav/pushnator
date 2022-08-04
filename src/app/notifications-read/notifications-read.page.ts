import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-notifications-read',
  templateUrl: './notifications-read.page.html',
  styleUrls: ['./notifications-read.page.scss'],
})
export class NotificationsReadPage implements OnInit {
  userName: string = "";
  channelName: string = "";

  foreground = [];
  background = [];

  foregroundVisibility: string = "visible-msg";
  backgroundVisibility: string = "non-visible-msg";

  constructor(private notificationService: NotificationsService,
    private storage: StorageService) { }

  ngOnInit() {
    this.userName = this.notificationService.currentUserName;
    this.channelName = this.notificationService.currentChannelName;

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
