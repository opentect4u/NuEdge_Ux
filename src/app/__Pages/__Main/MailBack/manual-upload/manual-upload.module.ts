import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualUploadComponent } from './manual-upload.component';
import { RouterModule, Routes } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { fileTypePipe } from 'src/app/__Pipes/fileType.pipe';
// import { AuthGuard } from 'src/app/__Gaurd/auth.guard';
 const routes:Routes = [{
  path:'',
  component:ManualUploadComponent,
  data:{breadcrumb:'Manual Upload',title:' Manual Upload',pageTitle:'Manual Upload'}}]

@NgModule({
  declarations: [
    ManualUploadComponent,
    fileTypePipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PanelModule,
    SharedModule,

    TabModule
  ],
  providers:[]
})
export class ManualUploadModule { }
