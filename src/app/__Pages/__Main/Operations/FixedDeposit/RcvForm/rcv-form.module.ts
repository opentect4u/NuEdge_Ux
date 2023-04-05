import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RcvFormComponent } from './rcv-form.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RcvFormRPTComponent } from './Dialog/rcv-form-rpt/rcv-form-rpt.component';
import { RcvFormCrudComponent } from './Dialog/rcv-form-crud/rcv-form-crud.component';
import { CreateInvComponent } from './Dialog/create-inv/create-inv.component';
import { DialogDtlsComponent } from './Dialog/dialog-dtls/dialog-dtls.component';

 const routes: Routes = [{path:'',component:RcvFormComponent}]

@NgModule({
  declarations: [
    RcvFormComponent,
    RcvFormRPTComponent,
    RcvFormCrudComponent,
    CreateInvComponent,
    DialogDtlsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class RcvFormModule { }
