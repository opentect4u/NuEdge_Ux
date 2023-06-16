import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AckentryComponent } from './ackEntry.component';
import { AckrptComponent } from './ackRPT/ackRPT.component';
import { ManualentrforackfinComponent } from './manualEntrForAckFin/manualEntrforAckFin.component';
const routes: Routes = [
  {
    path: '',
    component: AckentryComponent,
  },
];

@NgModule({
  declarations: [
    ManualentrforackfinComponent,
    AckrptComponent,
    AckentryComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [],
})
export class AckentryModule {}
