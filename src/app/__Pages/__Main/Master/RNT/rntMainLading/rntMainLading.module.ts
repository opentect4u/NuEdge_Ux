import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RntMainLadingComponent } from './rntMainLading.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RntMainLadingComponent,
    data: { breadcrumb: 'R&T' },
    children: [
      // { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () =>
          import('../../RNT/RNT.module').then((m) => m.RNTModule),
        data: {
          parentId: 4,
          breadcrumb: null,
          id: 13,
          title: 'NuEdge - R&T Master',
          pageTitle: 'R&T Master',
          has_menubar: 'Y',
        },
      },
      // {
      //   path: 'rntDashboard',
      //   loadChildren: () =>
      //     import('../../RNT/rntDashboard/rntDashboard.module').then(
      //       (m) => m.RntDashboardModule
      //     ),
      //   data: {
      //     parentId: 4,
      //     id: 14,
      //     title: 'NuEdge - R&T Dashboard',
      //     pageTitle: 'R&T Dashboard',
      //     has_menubar: 'Y',
      //   },
      // },
      {
        path: 'rntUpload',
        loadChildren: () =>
          import('../../RNT/uploadCsv/uploadCsv.module').then(
            (m) => m.UploadCsvModule
          ),
        data: {
          breadcrumb: null,
          parentId: 4,
          id: 15,
          title: 'NuEdge - R&T Uploadation',
          pageTitle: 'R&T Uploadation',
          has_menubar: 'Y',
        },
      },

      // {
      //   path: 'rntmodify',
      //   loadChildren: () =>
      //     import('../../RNT/rntModify/rntModify.module').then(
      //       (m) => m.RntModifyModule
      //     ),
      //   data: {
      //     parentId: 4,
      //     id: 3,
      //     title: 'NuEdge - R&T',
      //     pageTitle: 'R&T Master',
      //     has_menubar: 'Y',
      //   },
      // },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [RntMainLadingComponent],
})
export class RntMainLadingModule {}