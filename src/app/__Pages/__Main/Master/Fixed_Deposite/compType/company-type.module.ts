import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanytypeComponent } from './companytype.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
// import { RptComponent } from './dialog/rpt/rpt.component';
// import { ComptypeCrudComponent } from './dialog/comptype-crud/comptype-crud.component';

const routes: Routes = [{
  path:'',
  component:CompanytypeComponent,
  children:[
    {
      path:'',
      loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:'uploadCompanyType',
      loadChildren:()=> import('./upload-csv/upload-csv.module').then(m => m.UploadCsvModule),
      data:{breadcrumb:'Upload Company Type'}

    }
  ]
}]

@NgModule({
  declarations: [
    CompanytypeComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CompanyTypeModule { }
