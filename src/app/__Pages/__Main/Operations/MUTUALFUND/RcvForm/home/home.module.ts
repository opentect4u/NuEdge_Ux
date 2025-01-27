import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FinancialFormRecieveComponent } from './financial-form-recieve/financial-form-recieve.component';
import { NonFinancialFormReceiveComponent } from './non-financial-form-receive/non-financial-form-receive.component';
import { NFOFormReceiveComponent } from './nfoform-receive/nfoform-receive.component';

 const routes: Routes = [{path:'',component:HomeComponent}]

@NgModule({
  declarations: [
    HomeComponent,
    FinancialFormRecieveComponent,
    NonFinancialFormReceiveComponent,
    NFOFormReceiveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class HomeModule { }
