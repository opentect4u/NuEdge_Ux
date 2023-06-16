import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialComponent } from './financial.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FinrptComponent } from './Dialog/finRPT/finRPT.component';
import { FinmodificationComponent } from './Dialog/financialModification/finModification.component';
const routes: Routes = [{ path: '', component: FinancialComponent }];

@NgModule({
  declarations: [FinancialComponent, FinrptComponent, FinmodificationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class FinancialModule {}
