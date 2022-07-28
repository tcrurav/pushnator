import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsSendPage } from './notifications-send.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsSendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsSendPageRoutingModule {}
