import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: null },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  declarations: [HomeComponent],
})
export class HomeModule {
  constructor() {
    console.log('Master Home Module Loaded');
  }
}
