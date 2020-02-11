import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesContainerComponent } from './pages-container/pages-container.component';
import { HomeComponent } from './home/home.component';
import { ReminderComponent } from './reminder/reminder.component';


const routes: Routes = [
  { path: '', component: HomeComponent },  
  { path: 'notif/settings', component: ReminderComponent },
  { path: 'notif/:page/:position', component: PagesContainerComponent },
  { path: ':page', component: PagesContainerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
