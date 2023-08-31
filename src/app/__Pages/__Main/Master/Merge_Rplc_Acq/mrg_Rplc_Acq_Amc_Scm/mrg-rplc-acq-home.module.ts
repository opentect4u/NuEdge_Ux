import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MrgRplcAcqHomeComponent } from './mrg-rplc-acq-home.component';
import { RouterModule, Routes } from '@angular/router';
import { MrgRplcAcqAmcComponent } from './mrg-rplc-acq-amc/mrg-rplc-acq-amc.component';
import { MrgRplcAcqScmComponent } from './mrg-rplc-acq-scm/mrg-rplc-acq-scm.component';
import { SharedModule } from 'src/app/shared/shared.module';
/** Material Stepper */
import {MatStepperModule} from '@angular/material/stepper';
/** End */
import { SharedTblComponent } from './shared/shared-tbl/shared-tbl.component';
import { FinalPreviewCardComponent } from './shared/final-preview-card/final-preview-card.component';
// import {MatListModule} from '@angular/material/list';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AmcDtlsPreviewComponent } from './Dialog/amc-dtls-preview/amc-dtls-preview.component';
import { AlertCtrlModule } from 'src/app/__Core/alert-ctrl/alert-ctrl.module';
const routes: Routes = [{path:'',component:MrgRplcAcqHomeComponent}]

@NgModule({
  declarations: [
    MrgRplcAcqHomeComponent,
    MrgRplcAcqAmcComponent,
    MrgRplcAcqScmComponent,
    SharedTblComponent,
    FinalPreviewCardComponent,
    AmcDtlsPreviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatStepperModule,
    AlertCtrlModule,
    ScrollPanelModule
  ]
})
export class MrgRplcAcqHomeModule { }
