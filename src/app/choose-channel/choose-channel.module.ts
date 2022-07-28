import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseChannelPageRoutingModule } from './choose-channel-routing.module';

import { ChooseChannelPage } from './choose-channel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseChannelPageRoutingModule
  ],
  declarations: [ChooseChannelPage]
})
export class ChooseChannelPageModule {}
