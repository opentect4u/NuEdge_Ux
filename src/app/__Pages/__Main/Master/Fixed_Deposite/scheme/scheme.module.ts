import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
  path:'',
  component:SchemeComponent,
  children:[
    {
      path:'',
      loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:'uploadscheme',
      loadChildren:()=> import('./upload-csv/upload-csv.module').then(m => m.UploadCsvModule),
      data:{breadcrumb:'Upload Scheme'},
    }
  ]
}]

@NgModule({
  declarations: [
    SchemeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SchemeModule { }
