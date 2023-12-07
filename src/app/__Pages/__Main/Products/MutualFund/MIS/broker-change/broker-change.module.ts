import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerChangeComponent } from './broker-change.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';

 const routes:Routes = [{
  path:'',
  component:BrokerChangeComponent,
  data:{breadcrumb:'Change Of Broker',
        pageTitle:'Change Of Broker',
        title:'Change Of Broker'
       }
}];

@NgModule({
  declarations: [
    BrokerChangeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DialogModule
  ]
})
export class BrokerChangeModule { }
