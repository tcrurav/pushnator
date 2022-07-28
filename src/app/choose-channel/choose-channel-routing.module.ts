import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseChannelPage } from './choose-channel.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseChannelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseChannelPageRoutingModule {}
