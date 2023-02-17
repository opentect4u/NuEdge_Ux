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
      {
        path: 'clientmaster',
        loadChildren: () =>
          import('./client_manage/client_manage.module').then(
            (m) => m.Client_manageModule
          ),
        data: {
          breadcrumb: 'Client Master',
          parentId: 4,
          id: 2,
          title: 'NuEdge - Client Master',
          pageTitle: 'Client Master',
          has_menubar: 'Y',
        },
      },
      {
        path: 'bank',
        loadChildren: () =>
          import('./bank/bank.module').then((m) => m.BankModule),
        data: {
          breadcrumb: 'Bank Master',
          parentId: 4,
          id: 7,
          title: 'NuEdge - Bank  Master',
          pageTitle: 'Bank Master',
          has_menubar: 'Y',
        },
      },
      {
        path: 'bnkDashboard',
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
      {
        path: 'bnkModify',
        loadChildren: () =>
          import('./bank/bankModify/bankModify.module').then(
            (m) => m.BankModifyModule
          ),
        data: {
          parentId: 4,
          id: 26,
          title: 'NuEdge - Bank Modification',
          pageTitle: 'Bank Addtion / Updation',
          has_menubar: 'Y',
        },
      },
      {
        path: 'uploadbnk',
        loadChildren: () =>
          import('./bank/bankUpload/bankUpload.module').then(
            (m) => m.BankUploadModule
          ),
        data: {
          parentId: 4,
          id: 27,
          title: 'NuEdge - Bank Uploadation',
          pageTitle: 'Bank Upload',
          has_menubar: 'Y',
        },
      },
      {
        path: 'mstOperations',
        loadChildren: () =>
          import('../Dashboards/mstOpDashboard/mstOpDashboard.module').then(
            (m) => m.MstOpDashboardModule
          ),
        data: {
          parentId: 4,
          id: 10,
          title: 'NuEdge - Master Operations Dasboard',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path: 'clntMstHome',
        loadChildren: () =>
          import(
            './client_manage/clntMstDashboard/clntMstDashboard.module'
          ).then((m) => m.ClntMstDashboardModule),
        data: {
          parentId: 4,
          id: 11,
          title: 'NuEdge - Client Master Dasboard',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path: 'clOption',
        loadChildren: () =>
          import(
            './client_manage/clietCdDaasboard/clietCdDaasboard.module'
          ).then((m) => m.ClietCdDaasboardModule),
        data: {
          parentId: 4,
          id: 41,
          title: 'NuEdge - Client Options',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path: 'claddnew',
        loadChildren: () =>
          import('./client_manage/clExistOrAddnew/clExistOrAddnew.module').then(
            (m) => m.ClExistOrAddnewModule
          ),
        data: {
          parentId: 4,
          id: 42,
          title: 'NuEdge - Client Add New Options',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path: 'clModify',
        loadChildren: () =>
          import('./client_manage/clientModify/clientModify.module').then(
            (m) => m.ClientModifyModule
          ),
        data: {
          parentId: 4,
          id: 43,
          title: 'NuEdge - Client Modification',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path: 'clUploadCsv',
        loadChildren: () =>
          import('./client_manage/uploadCsv/uploadCsv.module').then(
            (m) => m.UploadCsvModule
          ),
        data: {
          parentId: 4,
          id: 51,
          title: 'NuEdge - Client Uploadation',
          pageTitle: 'NuEdge - Client Upload',
          has_member: 'Y',
        },
      },
      {
        path: 'docs',
        loadChildren: () =>
          import('./document/document.module').then((m) => m.DocumentModule),
        data: {
          parentId: 4,
          id: 12,
          title: 'NuEdge - Document Master',
          pageTitle: 'Document Master',
        },
      },
      {
        path: 'docsDashboard',
        loadChildren: () =>
          import('./document/docsDashboard/docsDashboard.module').then(
            (m) => m.DocsDashboardModule
          ),
        data: {
          parentId: 4,
          id: 44,
          title: 'NuEdge - Document Dashboard',
          pageTitle: 'Document Dashboard',
        },
      },
      {
        path: 'docsModify',
        loadChildren: () =>
          import('./document/docModify/docModify.module').then(
            (m) => m.DocModifyModule
          ),
        data: {
          parentId: 4,
          id: 45,
          title: 'NuEdge - Document Modification',
          pageTitle: 'Document Addition / Modification',
        },
      },
      {
        path: 'uploadCsv',
        loadChildren: () =>
          import('./document/uploadDocCsv/uploadDocCsv.module').then(
            (m) => m.UploadDocCsvModule
          ),
        data: {
          parentId: 4,
          id: 46,
          title: 'NuEdge - Document Uploadation',
          pageTitle: 'NuEdge - Document Upload',
        },
      },
      /**Documnet Type */
      {
        path: 'docType',
        loadChildren: () =>
          import('./docsMaster/docsMaster.module').then(
            (m) => m.DocsMasterModule
          ),
        data: {
          breadcrumb: 'Doc Master',
          parentId: 4,
          id: 50,
          title: 'NuEdge - Document Type Master',
          pageTitle: 'Document Type Master',
        },
      },
      {
        path: 'docTypeDashboard',
        loadChildren: () =>
          import('./docsMaster/docTypeDashboard/docTypeDashboard.module').then(
            (m) => m.DocTypeDashboardModule
          ),
        data: {
          parentId: 4,
          id: 47,
          title: 'NuEdge - Document Type Dashboard',
          pageTitle: 'NuEdge - Document Type Dashboard',
        },
      },
      {
        path: 'docTypeModify',
        loadChildren: () =>
          import('./docsMaster/docTypeModify/docTypeModify.module').then(
            (m) => m.DocTypeModifyModule
          ),
        data: {
          parentId: 4,
          id: 48,
          title: 'NuEdge - Document Type Modification',
          pageTitle: 'NuEdge - Document Type Modification',
        },
      },
      {
        path: 'uploadDocTypeCsv',
        loadChildren: () =>
          import('./docsMaster/uploadCsv/uploadCsv.module').then(
            (m) => m.UploadCsvModule
          ),
        data: {
          parentId: 4,
          id: 49,
          title: 'NuEdge - Document Type Uploadation',
          pageTitle: 'NuEdge - Document Type Upload',
        },
      },

      /**End */
      

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
