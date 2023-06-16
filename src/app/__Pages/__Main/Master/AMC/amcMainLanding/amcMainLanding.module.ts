import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmcMainLandingComponent } from './amcMainLanding.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AmcMainLandingComponent,
    data: { breadcrumb: 'AMC' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../AMC/AMC.module').then((m) => m.AMCModule),
        data: {
          parentId: 4,
          id: 4,
          title: 'NuEdge - AMC Master',
          pageTitle: 'AMC Master',
          has_menubar: 'Y',
        },
      },
      {
        path: 'amcUpload',
        loadChildren: () =>
          import('../../AMC/uploadAMC/uploadAMC.module').then(
            (m) => m.UploadAMCModule
          ),
        data: {
          parentId: 4,
          breadcrumb: 'Upload AMC',
          id: 18,
          title: 'NuEdge - AMC Uploadation',
          pageTitle: 'AMC Uploadation',
          has_menubar: 'Y',
        },
      }
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [AmcMainLandingComponent],
})
export class AmcMainLandingModule {}
