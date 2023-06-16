import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { ManualEntryResolver } from 'src/app/__Core/Resolver/manual-entry.resolver';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { breadcrumb: 'MF Trax' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'financial/:trans_type_id',
        loadChildren: () =>
          import('./Products/Financial/financial.module').then(
            (fin) => fin.FinancialModule
          ),
        resolve: {
          data: ManualEntryResolver,
        },
      },
      {
        path: 'nonfinancial/:trans_type_id',
        loadChildren: () =>
          import('./Products/NonFinancial/non-fin.module').then(
            (nonfin) => nonfin.NonFinModule
          ),
        resolve: {
          data: ManualEntryResolver,
        },
      },
      {
        path: 'nfo/:trans_type_id',
        loadChildren: () =>
          import('./Products/NFO/nfo.module').then((nfo) => nfo.NfoModule),
        resolve: {
          data: ManualEntryResolver,
        },
      },
    ],
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MainModule {}
