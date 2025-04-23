import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumComponent } from './aum.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:AumComponent,
  data:{breadcrumb:'AUM Report'},
  children:[
    {
      path:'home',
      loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule),
      data:{title:"NuEdge - AUM Report",pageTitle:"AUM Report"}
    },
    {
      path:'fund-house',
      loadChildren:() => import('./fund-house/fund-house.module').then(m => m.FundHouseModule),
      data:{title:"NuEdge - AUM Report By Fund House", pageTitle:'AUM Report By Fund House'}
    },
    {
      path:'aum-scheme',
      loadChildren:()=>import('./aum-scheme/aum-scheme.module').then(m=> m.AumSchemeModule),
      data:{title:"NuEdge - AUM Report By Scheme", pageTitle:'AUM Report By Scheme'}
    },
    {
      path:'aum-client',
      loadChildren:() => import('./aum-client/aum-client.module').then(m => m.AumClientModule),
      data:{title:"NuEdge - AUM Report By Clients", pageTitle:'AUM Report By Clients'}
    },
    {   
      path:'aum-assets-allocation',
      loadChildren:() => import('./aum-assets/aum-assets-allocation.module').then(m => m.AumAssetsAllocationModule),
      data:{title:"NuEdge - AUM Report By Assets Allocation", pageTitle:'AUM Report By Assets Allocation'}
    },
    {
      path:'aum-registrar',
      loadChildren:() => import('./aum-registrar/aum-registrar.module').then(m => m.AumRegistrarModule),
      data:{title:"NuEdge - AUM Report By Registrar", pageTitle:'AUM Report By Registrar'}
    },
    {
      path:'aum-by-scheme-code/:pCode_date_arnNo',
      loadChildren:() => import('./aum-by-scheme-code/aum-by-scheme-code.module').then(m => m.AumBySchemeCodeModule),
      data:{title:"NuEdge - AUM Report By Client For Scheme", pageTitle:'AUM Report By Client For Scheme'}
    },
    {
       path:'aum-family',
       loadChildren:() => import('./aum-family/aum-family.module').then(m => m.AumFamilyModule),
       data:{title:"NuEdge - AUM Report By Family", pageTitle:'AUM Report By Family'}
    },
    {
        path:'aum-branch',
        loadChildren:() => import('./aum-branch/aum-branch.module').then(m => m.AumBranchModule),
        data:{title:"NuEdge - AUM Report By Branch", pageTitle:'AUM Report By Branch'}
    },
    {
        path:'aum-segment',
        loadChildren:() => import('./aum-segment/aum-segment.module').then(m => m.AumSegmentModule),
        data:{title:'Nuedge - AUM Report By Segment',pageTitle:'AUM Report By Segment'}
    },
    {
      path:'city-type-aum',
      loadChildren:() => import('./aum-city-wise/aum-city-wise.module').then(m => m.AumCityWiseModule),
      data:{title:'Nuedge - AUM Report By City Type',pageTitle:'AUM Report By City Type'}
    },
    {
      path:'growth-aum',
      loadChildren:() => import('./aum-growth/aum-growth.module').then(m => m.AumGrowthModule),
      data:{title:'Nuedge - AUM Growth Report',pageTitle:'AUM Growth Report'}
    },
    {
      path:'aum-top-client',
      loadChildren:() => import('./aum-top-client/aum-top-client.module').then(m => m.AumTopClientModule),
      data:{title:'Nuedge - AUM Top Client Report',pageTitle:'AUM Top CLient Report'}
    },
    {
      path:'',
      redirectTo:'home',
      pathMatch:'full'
    }
  ]
}]

@NgModule({
  declarations: [
    AumComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AumModule { }
