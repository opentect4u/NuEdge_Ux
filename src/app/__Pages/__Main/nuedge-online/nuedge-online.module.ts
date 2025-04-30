import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuedgeOnlineLayoutComponent } from './nuedge-online-layout.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    component:NuedgeOnlineLayoutComponent,
    data:{breadcrumb:'Nuedge Online'},
    children:[
      {
        path:'',
        loadChildren:() => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path:'client-onboarding',
        loadChildren:()=> import('./Client-Onboarding/client-onboarding.module').then(m => m.ClientOnboardingModule)
      },
      {
        path:'transact-online',
        loadChildren:()=> import('./Transact-Online/transact-online.module').then(m => m.TransactOnlineModule)
      },
      {
        path:'bulk-order',
        loadChildren:()=> import('./Bulk-Order/bulk-order.module').then(m => m.BulkOrderModule)
      },
      {
        path:'cart',
        loadChildren:()=> import('./Cart/cart.module').then(m => m.CartModule)
      },
      {
        path:'transaction-log',
        loadChildren:()=> import('./Transaction-Log/transaction-log.module').then(m => m.TransactionLogModule)
      },
      // {
      //   path:'nse',
      //   loadChildren:() => import('./NSE/nse-layout.module').then(m => m.NseLayoutModule)
      // },
      // {
      //   path:'bse',
      //   loadChildren:() => import('./BSE/bse-layout.module').then(m => m.BseLayoutModule)
      // }
    ]
  }
]

@NgModule({
  declarations: [
    NuedgeOnlineLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NuedgeOnlineModule { }
