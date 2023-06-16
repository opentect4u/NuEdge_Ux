import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptMainLandingComponent } from './optMainLanding.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OptMainLandingComponent,
    data: { breadcrumb: 'Option' },
    children: [
      /** Options*/
      {
        path: '',
        loadChildren: () =>
          import('../../Option/option/option.module').then(
            (m) => m.OptionModule
          ),
        data: {
          breadcrumb: null,
          parentId: 4,
          id: 37,
          title: 'NuEdge - Option Master',
          pageTitle: 'Option Master',
        },
      },
      {
        path: 'uploadOption',
        loadChildren: () =>
          import('../../Option/uploadOption/uploadOption.module').then(
            (m) => m.UploadOptionModule
          ),
        data: {
          breadcrumb: 'Upload Option',
          parentId: 4,
          id: 39,
          title: 'NuEdge - Option Uploadation',
          pageTitle: 'Option Upload',
        },
      },
      /**End */
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [OptMainLandingComponent],
})
export class OptMainLandingModule {}
