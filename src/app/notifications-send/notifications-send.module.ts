import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsSendPageRoutingModule } from './notifications-send-routing.module';

import { NotificationsSendPage } from './notifications-send.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsSendPageRoutingModule
  ],
  declarations: [NotificationsSendPage]
})
export class NotificationsSendPageModule {}
