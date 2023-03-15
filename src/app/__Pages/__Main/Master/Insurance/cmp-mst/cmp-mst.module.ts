import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmpMstComponent } from './cmp-mst.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CmpCrudComponent } from './Dialog/cmp-crud/cmp-crud.component';
import { CmpRPTComponent } from './Dialog/cmp-rpt/cmp-rpt.component';

const routes:Routes = [{path:'',component:CmpMstComponent}]

@NgModule({
  declarations: [
    CmpMstComponent,
    CmpCrudComponent,
    CmpRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CmpMstModule { }
