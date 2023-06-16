import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualUpdateComponent } from './manual-update.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ManualUpdateComponent,
    data: { breadcrumb: 'Manual Update' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'financial',
        loadChildren: () =>
          import('./Financial/financial.module').then((m) => m.FinancialModule),
        data: { breadcrumb: 'Financial' },
      },
      {
        path: 'nfo',
        loadChildren: () => import('./NFO/nfo.module').then((m) => m.NfoModule),
        data: { breadcrumb: 'NFO' },
      },
      {
        path: 'nonfinancial',
        loadChildren: () =>
          import('./NonFinancial/nonfinancial.module').then(
            (m) => m.NonfinancialModule
          ),
        data: { breadcrumb: 'Non Financial' },
      },
    ],
  },
];

@NgModule({
  declarations: [ManualUpdateComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ManualUpdateModule {}
