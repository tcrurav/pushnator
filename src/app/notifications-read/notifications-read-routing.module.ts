import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsReadPage } from './notifications-read.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsReadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsReadPageRoutingModule {}
