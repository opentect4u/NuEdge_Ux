import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
     path:'',
     component:CompanyComponent,
    children:[
       {
        path:'',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
       },
       {
        path:'uploadCompany',
        loadChildren:()=> import('./upload-csv/upload-csv.module').then(m => m.UploadCSVModule),
        data:{breadcrumb:'Upload Company'}
       }
    ]
    }]

@NgModule({
  declarations: [
    CompanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  SharedModule
  ]
})
export class CompanyModule { }
