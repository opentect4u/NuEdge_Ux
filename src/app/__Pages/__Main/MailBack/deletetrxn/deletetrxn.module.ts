import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletetrxnComponent } from './deletetrxn.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnlockTrxnComponent } from './dialog/unlock-trxn/unlock-trxn.component';
import { TabModule } from 'src/app/__Core/tab/tab.module';

const routes:Routes = [{
  path:'',
  component:DeletetrxnComponent,
  data:{title:'Delete Transaction',pageTitle:'Delete Transaction',breadcrumb:'Delete Trxn'}
  }]
@NgModule({
  declarations: [DeletetrxnComponent, UnlockTrxnComponent],
  imports: [CommonModule,RouterModule.forChild(routes),SharedModule,TabModule]
})
export class DeletetrxnModule {}
