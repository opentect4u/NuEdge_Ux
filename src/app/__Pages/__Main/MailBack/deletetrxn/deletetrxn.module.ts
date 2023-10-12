import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletetrxnComponent } from './deletetrxn.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnlockTrxnComponent } from './dialog/unlock-trxn/unlock-trxn.component';

const routes:Routes = [{
  path:'',
  component:DeletetrxnComponent,
  data:{title:'Delete Transaction',pageTitle:'Delete Transaction',breadcrumb:'Delete Trxn'}
  }]
@NgModule({
  declarations: [DeletetrxnComponent, UnlockTrxnComponent],
  imports: [CommonModule,RouterModule.forChild(routes),SharedModule]
})
export class DeletetrxnModule {}
