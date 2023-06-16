import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AckmainComponent } from './ackMain.component';
import { RouterModule, Routes } from '@angular/router';
import { ManualEntryResolver } from 'src/app/__Core/Resolver/manual-entry.resolver';
const routes: Routes = [
  {
    path: '',
    component: AckmainComponent,
    data: { breadcrumb: 'Acknowledgement Trax' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./ackHome/ackhome.module').then((m) => m.AckhomeModule),
        data: { breadcrumb: null },
      },
      {
        path: 'ackEntry/:trans_type_id',
        loadChildren: () =>
          import('./ackEntryfin/ackEntry.module').then((m) => m.AckentryModule),
        resolve: {
          data: ManualEntryResolver,
        },
      },
      {
        path: 'ackNonFin/:trans_type_id',
        loadChildren: () =>
          import('./ackEntryNonFin/ackEntryNonFin.module').then(
            (m) => m.AckEntryNonFinModule
          ),
        resolve: {
          data: ManualEntryResolver,
        },
      },
    ],
  },
];

@NgModule({
  declarations: [AckmainComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],

  providers: [],
})
export class AckmainModule {}
