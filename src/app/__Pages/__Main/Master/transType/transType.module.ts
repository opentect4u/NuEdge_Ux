import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransTypeComponent } from './transType.component';
import { RouterModule, Routes } from '@angular/router';
import { TrnstypeModificationComponent } from './trnstypeModification/trnstypeModification.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { TrnstyperptComponent } from './trnsTypeRpt/trnsTypeRpt.component';

const routes: Routes = [
  {
    path:'',
    component:TransTypeComponent,
  }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [TransTypeComponent,TrnstyperptComponent,TrnstypeModificationComponent]
})
export class TransTypeModule {
  constructor() {
    console.log('Trans Type Module Loaded');

  }
}
