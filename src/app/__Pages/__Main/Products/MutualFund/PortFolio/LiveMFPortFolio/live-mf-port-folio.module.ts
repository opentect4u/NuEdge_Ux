import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveMfPortFolioComponent } from './live-mf-port-folio.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {DialogModule} from 'primeng/dialog';
import { PlTrxnDtlsComponent } from './pl-trxn-dtls/pl-trxn-dtls.component';
const routes: Routes = [{path:'',component:LiveMfPortFolioComponent}]

@NgModule({
  declarations: [
    LiveMfPortFolioComponent,
    PlTrxnDtlsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    RouterModule.forChild(routes),
  ]
})
export class LiveMfPortFolioModule { }
