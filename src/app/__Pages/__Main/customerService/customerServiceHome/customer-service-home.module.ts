import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceHomeComponent } from './customer-service-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { ModifyQueryStatusComponent } from '../modify-query-status/modify-query-status.component';
import { DocViewComponent } from './dialog/doc-view.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
const routes:Routes = [
  {
    path:'',
    component:CustomerServiceHomeComponent
  }
]

@NgModule({
  declarations: [
    CustomerServiceHomeComponent,
    ModifyQueryStatusComponent,
    DocViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule,
    OverlayPanelModule
  ]
})
export class CustomerServiceHomeModule { }
