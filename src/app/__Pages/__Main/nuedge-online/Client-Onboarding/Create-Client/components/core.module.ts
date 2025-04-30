import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateCustomerByEntryComponent} from './create-customer-by-entry/create-customer-by-entry.component'
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CreateCustomerByEntryComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    SharedModule,
    CreateCustomerByEntryComponent
  ]
})
export class CoreModule { }
