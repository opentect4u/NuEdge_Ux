import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PincodeRPTComponent } from '../Dialog/pincode-rpt/pincode-rpt.component';
import { PincodeEntryComponent } from '../Dialog/pincode-entry/pincode-entry.component';

const routes: Routes = [{path:'',component: HomeComponent
}]


@NgModule({
  declarations: [
    HomeComponent,
    PincodeEntryComponent,
    PincodeRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }
