import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveMfPortFolioComponent } from './live-mf-port-folio.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {DialogModule} from 'primeng/dialog';
import { PlTrxnDtlsComponent } from './pl-trxn-dtls/pl-trxn-dtls.component';
import { RecentTrxnComponent } from './recent-trxn/recent-trxn.component';
import { LiveSIPComponent } from './live-sip/live-sip.component';
import { LiveSTPComponent } from './live-stp/live-stp.component';
import { LiveSWPComponent } from './live-swp/live-swp.component';
import { UpcommingTrxnComponent } from './upcomming-trxn/upcomming-trxn.component';
import { SystematicMissedTrxnComponent } from './systematic-missed-trxn/systematic-missed-trxn.component';
import { RejectTrxnComponent } from './reject-trxn/reject-trxn.component';
const routes: Routes = [{path:'',component:LiveMfPortFolioComponent}]

@NgModule({
  declarations: [
    LiveMfPortFolioComponent,
    PlTrxnDtlsComponent,
    RecentTrxnComponent,
    LiveSIPComponent,
    LiveSTPComponent,
    LiveSWPComponent,
    UpcommingTrxnComponent,
    SystematicMissedTrxnComponent,
    RejectTrxnComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    RouterModule.forChild(routes),
  ]
})
export class LiveMfPortFolioModule { }
