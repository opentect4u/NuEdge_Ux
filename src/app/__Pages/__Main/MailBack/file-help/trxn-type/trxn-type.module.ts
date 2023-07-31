import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrxnTypeComponent } from './trxn-type.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: TrxnTypeComponent,
    data: { breadcrumb: 'R&T Trxn Type' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
          data:{title:' R&T Trxn Type',pageTitle:'R&T Trxn Type'}
      },
    ],
  },
];

@NgModule({
  declarations: [TrxnTypeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TrxnTypeModule {}
