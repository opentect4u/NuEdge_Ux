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
import { IsinComponent } from './component/entry_dialog/isin/isin.component';
import { SchemeComponent } from './component/entry_dialog/scheme/scheme.component';
/***** Mat Badge  module */
import {MatBadgeModule} from '@angular/material/badge';
import { BusinessTypeComponent } from './component/entry_dialog/business-type/business-type.component';
import { FrequencyComponent } from './component/entry_dialog/frequency/frequency.component';
import { MapPlanOptionComponent } from './component/entry_dialog/map-plan-option/map-plan-option.component';
/******End ***************/


const routes: Routes = [
  {
    path: '',
    component: MailbackMismatchComponent,
    data: { breadcrumb: 'Mailback Mismatch',title:' Mailback Mismatch',pageTitle:'Mailback Mismatch'},
  },
];

@NgModule({
  declarations: [MailbackMismatchComponent, TrxnRptWithoutScmComponent, IsinComponent, SchemeComponent, BusinessTypeComponent, FrequencyComponent, MapPlanOptionComponent],
  imports: [CommonModule,RouterModule.forChild(routes),
    SharedModule,
    TabModule,
    ConfirmPopupModule,
    DialogModule,
    MatBadgeModule
  ],
})
export class MailbackMismatchModule {}
