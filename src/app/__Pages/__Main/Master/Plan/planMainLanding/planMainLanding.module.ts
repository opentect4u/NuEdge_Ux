import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanMainLandingComponent } from './planMainLanding.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PlanMainLandingComponent,
    data: { breadcrumb: 'Plan' },
    children: [
      /**PLAN */
      {
        path: '',
        loadChildren: () =>
          import('../../Plan/plan/plan.module').then((m) => m.PlanModule),
        data: {
          parentId: 4,
          breadcrumb: null,
          id: 33,
          title: 'NuEdge - Plan Master',
          pageTitle: 'Plan Master',
        },
      },
      {
        path: 'uploadPln',
        loadChildren: () =>
          import('../../Plan/uploadPln/uploadPln.module').then(
            (m) => m.UploadPlnModule
          ),
        data: {
          parentId: 4,
          breadcrumb: 'Upload Plan',
          id: 35,
          title: 'NuEdge - Plan Uploadation',
          pageTitle: 'Plan Upload',
        },
      },
      /**END */
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [PlanMainLandingComponent],
})
export class PlanMainLandingModule {}
