import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixdepositeComponent } from './fixdeposite.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path:'',
    component:FixdepositeComponent,
    data:{breadcrumb:'Fixed Deposit'},
    children:[
      {
        path:'',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'companytype',
        loadChildren:()=> import('./compType/company-type.module').then(m => m.CompanyTypeModule),
        data:{breadcrumb:'Company Type'},

      },
      {
        path:'company',
        loadChildren:() => import('./comp/company.module').then(m => m.CompanyModule),
        data:{breadcrumb:'Company'},
      },
      {
        path:'scheme',
        loadChildren:() => import('./scheme/scheme.module').then(m => m.SchemeModule),
        data:{breadcrumb:'Scheme'},
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
