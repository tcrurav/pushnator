import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsReadPageRoutingModule } from './notifications-read-routing.module';

import { NotificationsReadPage } from './notifications-read.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsReadPageRoutingModule
  ],
  declarations: [NotificationsReadPage]
})
export class NotificationsReadPageModule {}
