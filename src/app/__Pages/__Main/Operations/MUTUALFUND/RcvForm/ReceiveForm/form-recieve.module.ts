import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecieveComponent } from './form-recieve.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RcvmodificationComponent } from './rcvModification/rcvModification.component';
import { RcvformrptComponent } from './rcvFormRpt/rcvFormRpt.component';
import { RcvformmodifyfornfoComponent } from './rcvFormModifyForNFO/rcvFormModifyForNFO.component';
import { RcvfrmmodificationfornonfinComponent } from './rcvFormmodificationForNonFIn/rcvFrmModificationForNonFin.component';
import { DeletercvComponent } from './deletercv/deletercv.component';

 const routes: Routes = [{path:'',component:FormRecieveComponent}]

@NgModule({
  declarations: [
    FormRecieveComponent,
    RcvmodificationComponent,
    RcvformrptComponent,
    RcvformmodifyfornfoComponent,
    RcvfrmmodificationfornonfinComponent,
    DeletercvComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FormRecieveModule { }
