import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/__Pages/__Main/Products/core/core.module';

const routes:Routes =[
  {
    path:'',
    component:HomeComponent,
  }
]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule
  ]
})
export class HomeModule { }
