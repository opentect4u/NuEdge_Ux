import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { MenuDropdownDirective } from 'src/app/__Directives/menuDropdown.directive';
import { ListComponent } from './common/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      
      {
        path: 'home',
        loadChildren: () => import('../__Main/home/home.module').then(m => m.HomeModule),
        data: { id: 3, title: "NuEdge - Home",pageTitle:""}
      },
      {
        path: 'clientmaster',
        loadChildren: () => import('../__Main/Master/client_manage/client_manage.module').then(m => m.Client_manageModule),
        data: { id: 4, title: "NuEdge - Client Master",pageTitle:"Client Master"}
      },
      {
        path: 'rntmaster',
        loadChildren: () => import('../__Main/Master/RNT/RNT.module').then(m => m.RNTModule),
        data: { id: 5, title: "NuEdge - RNT Master",pageTitle:"RNT Master"}
      },
      {
        path: 'productmaster',
        loadChildren: () => import('../__Main/Master/product/product.module').then(m => m.ProductModule),
        data: { id: 6, title: "NuEdge - Product Master",pageTitle:"Product Master"}
      },
      {
        path: 'amcmaster',
        loadChildren: () => import('../__Main/Master/AMC/AMC.module').then(m => m.AMCModule),
        data: { id: 7, title: "NuEdge - AMC Master",pageTitle:"AMC Master"}
      },
      {
        path: 'category',
        loadChildren: () => import('../__Main/Master/category/category.module').then(m => m.CategoryModule),
        data: { id: 8, title: "NuEdge - Category Master",pageTitle:"Category Master"}
      },
      {
        path: 'subcategory',
        loadChildren: () => import('../__Main/Master/subcategory/subcategory.module').then(m => m.SubcategoryModule),
        data: { id: 9, title: "NuEdge - Sub-Category Master",pageTitle:"Sub-Category Master"}
      },
      {
        path: 'branch',
        loadChildren: () => import('../__Main/Master/branch/branch.module').then(m => m.BranchModule),
        data: { id: 10, title: "NuEdge - Branch Master",pageTitle:"Branch Master"}
      },
      {
        path: 'formmaster',
        loadChildren: () => import('../__Main/Master/form/form.module').then(m => m.FormModule),
        data: { id: 11, title: "NuEdge - Form Type Master",pageTitle:"Form Type Master"}
      },
      {
        path: 'transtype',
        loadChildren: () => import('../__Main/Master/transType/transType.module').then(m => m.TransTypeModule),
        data: { id: 12, title: "NuEdge - Transaction Type Master",pageTitle:"Transaction Type Master"}
      },
      {
        path: 'trans',
        loadChildren: () => import('../__Main/Master/transaction/transaction.module').then(m => m.TransactionModule),
        data: { id: 13, title: "NuEdge - Transaction  Master",pageTitle:"Transaction  Master"}
      },
      {
        path: 'bank',
        loadChildren: () => import('../__Main/Master/bank/bank.module').then(m => m.BankModule),
        data: { id: 14, title: "NuEdge - Bank  Master",pageTitle:"Bank Master"}
      },
      {
        path: 'scheme',
        loadChildren: () => import('../__Main/Master/scheme/scheme.module').then(m => m.SchemeModule),
        data: { id: 15, title: "NuEdge - Scheme  Master",pageTitle:"Scheme Master"}
      },
      {
        path: 'employee',
        loadChildren: () => import('../__Main/Master/employee/employee.module').then(m => m.EmployeeModule),
        data: { id: 16, title: "NuEdge - Employee Master",pageTitle:"Employee Master"}
      },
      {
        path:'docsType',
        loadChildren:() => import('../__Main/Master/docsMaster/docsMaster.module').then(m => m.DocsMasterModule),
        data:{id:17,title: "NuEdge - Document Master",pageTitle:"Document Master"}
      },
      {
        path:'docs',
        loadChildren:() => import('../__Main/Master/document/document.module').then(m => m.DocumentModule),
        data:{id:18,title: "NuEdge - Document Master",pageTitle:"Document Master"}
      },
      {
        path:'rcvForm',
        loadChildren:()=> import('../__Main/Operations/RcvFrm/RcvFrm.module').then(m => m.RcvFrmModule),
        data:{id:19,title:"NuEdge - Operation Recieve Form",pageTitle:"Recieve Form"}
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    ListComponent,
    MenuDropdownDirective,
  ],
})
export class MainModule {
  constructor() {
    console.log('Main Module Loaded');
  }
}
