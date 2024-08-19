import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceHomeComponent } from './customer-service-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [
  {
    path:'',
    component:CustomerServiceHomeComponent
  }
]

@NgModule({
  declarations: [
    CustomerServiceHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CustomerServiceHomeModule { }
