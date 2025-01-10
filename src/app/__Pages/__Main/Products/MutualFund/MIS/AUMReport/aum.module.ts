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
