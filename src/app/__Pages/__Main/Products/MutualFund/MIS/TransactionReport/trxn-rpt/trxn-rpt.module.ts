import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrxnRptComponent } from './trxn-rpt.component';
/*************PRIMENG DIALOG BOX********************* */
import { DialogModule } from 'primeng/dialog';
/******************END***************************** */
const routes: Routes = [{ path: '', component: TrxnRptComponent ,data:{breadcrumb:'Transaction Report',title: "NuEdge - Transaction Report", pageTitle: "Transaction Report"}}];

@NgModule({
  declarations: [
    TrxnRptComponent  ],
  imports: [CommonModule,
    SharedModule,RouterModule.forChild(routes),
    DialogModule
  ]
})
export class TrxnRptModule {}

