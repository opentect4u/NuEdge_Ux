import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FinancialManualUpdateComponent } from '../screens/financial-manual-update/financial-manual-update.component';
import { NonFinancialManualUpdateComponent } from '../screens/non-financial-manual-update/non-financial-manual-update.component';
import { NfoManualUpdateComponent } from '../screens/nfo-manual-update/nfo-manual-update.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent,FinancialManualUpdateComponent,NfoManualUpdateComponent,NonFinancialManualUpdateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule,TabModule],
})
export class HomeModule {}
