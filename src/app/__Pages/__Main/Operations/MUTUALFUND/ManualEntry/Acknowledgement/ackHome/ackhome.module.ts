import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AckhomeComponent } from './ackhome.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { NonfinancialAcknowledgementComponent } from './screens/nonfinancial-acknowledgement/nonfinancial-acknowledgement.component';
import { FinancialAcknowledgementComponent } from './screens/financial-acknowledgement/financial-acknowledgement.component';

const routes: Routes = [
  {
    path: '',
    component: AckhomeComponent,
    data: { breadcrumb: null },
  },
];
@NgModule({
  declarations: [AckhomeComponent, NonfinancialAcknowledgementComponent,FinancialAcknowledgementComponent],
  imports: [CommonModule, RouterModule.forChild(routes),TabModule, SharedModule],
  providers: [],
})
export class AckhomeModule {}
