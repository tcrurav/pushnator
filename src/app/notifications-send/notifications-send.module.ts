import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsSendPageRoutingModule } from './notifications-send-routing.module';

import { NotificationsSendPage } from './notifications-send.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NotificationsSendPageRoutingModule
  ],
  declarations: [NotificationsSendPage]
})
export class NotificationsSendPageModule {}
