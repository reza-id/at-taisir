import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesContainerComponent } from './pages-container/pages-container.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':page', component: PagesContainerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
