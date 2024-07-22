import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./__Pages/__Auth/Auth.module').then(m => m.AuthModule) },
  { path: 'main',
  loadChildren: () => import('./__Pages/__Main/main.module').then(m => m.MainModule)},
  {path:'',redirectTo:'auth',pathMatch:'full'},
  {
    path:'donwloadLink/:token',
    loadChildren:() => import('./__Pages/__DownloadLink/valuation-rpt-download-link/valuation-rpt-download-link.module').then(m => m.ValuationRptDownloadLinkModule)
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
