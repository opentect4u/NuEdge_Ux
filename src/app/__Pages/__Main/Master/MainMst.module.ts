import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMstComponent } from './MainMst.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainMstComponent,
    data: { breadcrumb: 'Master' },
    children: [
      {
        path: 'productwisemenu',
        loadChildren: () =>
          import('./MstMenu/MasterMenuDashboard.module').then(
            (m) => m.MastermenudashboardModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./PrdMstDashboard/prdTypeMstDashboard.module').then(
            (m) => m.PrdtypemstdashboardModule
          ),
      },

      /** Bank Landing Page */
      {
        path: 'bank',
        loadChildren: () =>
          import('./bank/bankDashboard/bankDashboard.module').then(
            (m) => m.BankDashboardModule
          ),
        data: {
          parentId: 4,
          id: 25,
          title: 'NuEdge - Bank Dashboard',
          pageTitle: 'Bank Dashboard',
          has_menubar: 'Y',
        },
      },
      /** End */
      {
         path:'emailTemplate',
         loadChildren:()=> import('./EmailTemplate/emailTemplate.module').then(m => m.EmailtemplateModule),
         data:{
          parentId: 4,
          id: 27,
          title: 'NuEdge - Email Template',
          pageTitle: 'Email Template',
          has_menubar: 'Y',
         }
      },
      {
        path: 'mstOperations',
        loadChildren: () =>
          import('./Operations/main.module').then(
            (m) => m.MainModule
          ),
        data: {
          parentId: 4,
          id: 10,
          title: 'NuEdge - Master Operations Dasboard',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      /**Documnet Type Landing Page*/
      {
        path: 'docType',
        loadChildren: () =>
          import('./docsMaster/doc-type-home/doc-type-home.module').then(
            (m) => m.DocTypeHomeModule
          )
      },
      /**End */
      /** Insurance - Master*/
      {
        path:'insurance',
        loadChildren:()=> import('./Insurance/ins-lnd.module').then(m => m.InsLndModule),
      },
      /** END */
      /** Fixed Deposite - Master*/
      {
        path:'fixedeposit',
        loadChildren:()=>import('./Fixed_Deposite/fixdeposite.module').then(m => m.FixdepositeModule)
      },
      /** END */
      /** Geo-Graphical Master */
      {
        path:'geographic',
        loadChildren:()=> import('./GeoGraphic/geo-graphic.module').then(m=> m.GeoGraphicModule)
      },
      /** End */
      /** Company Master */
      {
        path:'company',
        loadChildren:() => import('./company/company.module').then(m => m.CompanyModule),
        data:{breadcrumb:'Company'}
      },
      /** End */
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],

  declarations: [MainMstComponent],
})
export class MainMstModule {}
