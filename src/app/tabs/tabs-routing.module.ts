import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'send',
        loadChildren: () => import('../notifications-send/notifications-send.module').then(m => m.NotificationsSendPageModule)
      },{
        path: 'read',
        loadChildren: () => import('../notifications-read/notifications-read.module').then(m => m.NotificationsReadPageModule)
      }
    ]
  }, {
    path: '',
    redirectTo: '/tabs/tabs/send',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
