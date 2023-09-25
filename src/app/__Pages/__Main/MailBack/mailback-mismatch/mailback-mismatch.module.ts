import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailbackMismatchComponent } from './mailback-mismatch.component';
import { RouterModule, Routes } from '@angular/router';
import { TrxnRptWithoutScmComponent } from './component/trxn-rpt-without-scm/trxn-rpt-without-scm.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';

/*** Angular primeng dialog box module*/
import { DialogModule } from 'primeng/dialog';
/*** End */

import { ConfirmPopupModule } from 'primeng/confirmpopup';
const routes: Routes = [
  {
    path: '',
    component: MailbackMismatchComponent,
    data: { breadcrumb: 'Mailback Mismatch',title:' Mailback Mismatch',pageTitle:'Mailback Mismatch'},
  },
];

@NgModule({
  declarations: [MailbackMismatchComponent, TrxnRptWithoutScmComponent],
  imports: [CommonModule,RouterModule.forChild(routes),
    SharedModule,
    TabModule,
    ConfirmPopupModule,
    DialogModule
  ],
})
export class MailbackMismatchModule {}
