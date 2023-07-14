import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualUploadComponent } from './manual-upload.component';
import { RouterModule, Routes } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { SharedModule } from 'src/app/shared/shared.module';
 const routes:Routes = [{path:'',component:ManualUploadComponent,data:{breadcrumb:'Manual Upload'}}]

@NgModule({
  declarations: [
    ManualUploadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PanelModule,
    SharedModule,
    TabModule
  ]
})
export class ManualUploadModule { }
