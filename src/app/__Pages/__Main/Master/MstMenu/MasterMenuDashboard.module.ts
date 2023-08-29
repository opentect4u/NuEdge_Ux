import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastermenudashboardComponent } from './MasterMenuDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MastermenudashboardComponent,
    data: { breadcrumb: 'Mutual Fund' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
        data: {
          breadcrumb: null,
          parentId: 4,
          id: 1,
          title: 'NuEdge - Master Dashboard',
          pageTitle: '',
          has_menubar: 'N',
        },
      },
      {
        path: 'rnt',
        loadChildren: () =>
          import('../RNT/rntMainLading/rntMainLading.module').then(
            (m) => m.RntMainLadingModule
          ),
      },
      {
        path: 'amc',
        loadChildren: () =>
          import('../AMC/amcMainLanding/amcMainLanding.module').then(
            (m) => m.AmcMainLandingModule
          ),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('../category/catMainLanding/catMainLanding.module').then(
            (m) => m.CatMainLandingModule
          ),
      },
      {
        path: 'subcategory',
        loadChildren: () =>
          import(
            '../subcategory/subcatMainLanding/subcatMainLanding.module'
          ).then((m) => m.SubcatMainLandingModule),
      },
      {
        path: 'plan',
        loadChildren: () =>
          import('../Plan/planMainLanding/planMainLanding.module').then(
            (m) => m.PlanMainLandingModule
          ),
      },
      {
        path: 'option',
        loadChildren: () =>
          import('../Option/optMainLanding/optMainLanding.module').then(
            (m) => m.OptMainLandingModule
          ),
      },
      {
        path: 'scheme',
        loadChildren: () =>
          import('../scheme/scmMainLanding/scmMainLanding.module').then(
            (m) => m.ScmMainLandingModule
          ),
      },
      /** Transaction type */
      {
        path:'trnsType',
        loadChildren:() => import('../transType/home/home.module').then(m => m.HomeModule),
      },
      /** End */
      /** Transaction*/
      {
        path:'trns',
        loadChildren:()=> import('../transaction/transaction.module').then(m => m.TransactionModule),
      },
      /** End */

      {
        path:'sipType',
        loadChildren:()=> import('../SipType/sipType.module').then(m => m.SiptypeModule)
      },
      {
        path:'swpType',
        loadChildren:()=> import('../SWPType/swp-type.module').then(m => m.SwpTypeModule)
      },
      {
        path:'stpType',
        loadChildren:()=> import('../STPType/stp-type.module').then(m => m.StpTypeModule)
      },
      {
        path:'exchange',
        loadChildren:()=> import('../exchange/exchange.module').then(m => m.ExchangeModule)
      },
      {
        path:'benchmark',
        loadChildren:()=> import('../benchmark/benchmark.module').then(m => m.BenchmarkModule)
      },
      {
        path:'type',
        loadChildren:()=> import('../Merge_Rplc_Acq/merge-rplc-acq.module').then(m => m.MergeRplcAcqModule)
      }
    ],
  },
];

@NgModule({
  declarations: [MastermenudashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [],
})
export class MastermenudashboardModule {}
