import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RcvFormComponent } from './rcv-form.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RcvFormCrudComponent } from './Dialog/rcv-form-crud/rcv-form-crud.component';
import { DialogDtlsComponent } from './Dialog/dialog-dtls/dialog-dtls.component';
import { CreateProposerComponent } from './Dialog/create-proposer/create-proposer.component';
import { RcvFormRPTComponent } from './Dialog/rcv-form-rpt/rcv-form-rpt.component';

 const routes: Routes = [{
  path:'',
  component:RcvFormComponent,
  data:{breadcrumb:'Form Recievable'}
}]

@NgModule({
  declarations: [
    RcvFormComponent,
    RcvFormCrudComponent,
    DialogDtlsComponent,
    CreateProposerComponent,
    RcvFormRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class RcvFormModule { }
