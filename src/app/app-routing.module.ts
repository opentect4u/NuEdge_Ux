import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./__Pages/__Auth/Auth.module').then(m => m.AuthModule) },
  { path: 'main',
  loadChildren: () => import('./__Pages/__Main/main.module').then(m => m.MainModule)},
  {path:'',redirectTo:'auth',pathMatch:'full'},
  {
    path:'downloadLink/:token',
    loadChildren:() => import('./__Pages/__DownloadLink/valuation-rpt-download-link/valuation-rpt-download-link.module').then(m => m.ValuationRptDownloadLinkModule)
  },
  {
      path:'query_dtls/:query_id',
      loadChildren:() => import('./__Pages/QueryDtls/query-dtls.module').then(m => m.QueryDtlsModule)
  },
  {
    path:'feedback/:query_id',
    loadChildren:() => import('./__Pages/query-feedback/query-feedback.module').then(m => m.QueryFeedbackModule)
  },
  {
    path:'**',
    loadChildren:() => import('./__Pages/__DownloadLink/valuation-rpt-download-link/valuation-rpt-download-link.module').then(m => m.ValuationRptDownloadLinkModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled',onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
