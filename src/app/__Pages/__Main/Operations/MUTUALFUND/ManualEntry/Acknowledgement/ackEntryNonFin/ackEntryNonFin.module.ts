import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AckEntryNonFinComponent } from './ackEntryNonFin.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManualEntryForNonFinComponent } from './manualEntryForNonFin/manualEntryForNonFin.component';
import { AckRPTForNonFinComponent } from './ackRPTForNonFin/ackRPTForNonFin.component';
const routes: Routes = [
  {
    path: '',
    component: AckEntryNonFinComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  declarations: [
    AckEntryNonFinComponent,
    AckRPTForNonFinComponent,
    ManualEntryForNonFinComponent,
  ],
})
export class AckEntryNonFinModule {}
