import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixdepositeComponent } from './fixdeposite.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path:'',
    component:FixdepositeComponent,
    children:[
      {
        path:'',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'companytype',
        loadChildren:()=> import('./compType/company-type.module').then(m => m.CompanyTypeModule)
      },
      {
        path:'company',
        loadChildren:() => import('./comp/company.module').then(m => m.CompanyModule)
      },
      {
        path:'scheme',
        loadChildren:() => import('./scheme/scheme.module').then(m => m.SchemeModule)
      },
      {
        path:'uploadcsv',
        loadChildren:()=> import('./comp/upload-csv/upload-csv.module').then(m => m.UploadCSVModule)
      },
      {
        path:'uploadcsvforcompanytype',
        loadChildren:()=>import('./compType/upload-csv/upload-csv.module').then(m => m.UploadCsvModule)
      },
      {
        path:'uploadscheme',
        loadChildren:()=> import('./scheme/upload-csv/upload-csv.module').then(m => m.UploadCsvModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    FixdepositeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FixdepositeModule { }
