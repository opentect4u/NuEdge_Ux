import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
    path:'',
    component:PortfolioComponent,
   data:{breadcrumb:'Portfolio Report'},
    children:[
      {
        path:'home',
        loadChildren:()=> import('./home/home.module').then(portHome => portHome.HomeModule),
        data:{title:' Portfolio Report',pageTitle:'Portfolio Report'}
      },
      {
         path:'liveMfPortFolio',
         loadChildren:()=> import('./LiveMFPortFolio/live-mf-port-folio.module').then( liveMF => liveMF.LiveMfPortFolioModule),
         data:{title:'PortFolio - Live MF Portfolio',pageTitle:'Live MF Portfolio',breadcrumb:'Live MF Portfolio'}
      },
      {
        path:'realisedCapitalGain',
        loadChildren:()=> import('./relcapitalgain/relcapitalgain.module').then(m => m.RelcapitalgainModule),
        data:{title:'Realised Capital Gain',pageTitle:'Realised Capital Gain',breadcrumb:'Realised Capital Gain'}
      },
      {
         path:'folio',
         loadChildren:()=> import('./Folio/folio.module').then(m => m.FolioModule),
         data:{title:'PortFolio - Folio Master',pageTitle:'Folio Master',breadcrumb:'Folio Master'}
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PortfolioModule { }
