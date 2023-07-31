import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { breadcrumb: 'Manual Entry' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Home/home.module').then((m) => m.HomeModule),
          data:{title:' Manual Entry',pageTitle:'Manual Entry'}
      },
      {
        path: 'mfTrax',
        loadChildren: () =>
          import('./EntryForm/main.module').then((m) => m.MainModule),
      },
      {
        path: 'acknowldgement',
        loadChildren: () =>
          import('./Acknowledgement/ackMain.module').then(
            (ack) => ack.AckmainModule
          ),
      },
      {
        path: 'manualupdate',
        loadChildren: () =>
          import('./ManualUpdate/manual-update.module').then(
            (m) => m.ManualUpdateModule
          ),
      },
      {
        path:'kycTrax',
        loadChildren:()=> import('./kycTrax/kyc-trax.module').then(m => m.KycTraxModule),
      }
    ],
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MainModule {}
