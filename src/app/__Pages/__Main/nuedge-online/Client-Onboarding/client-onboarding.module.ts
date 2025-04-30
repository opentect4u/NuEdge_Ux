import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientOnboardingComponent } from './client-onboarding.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:ClientOnboardingComponent,
    data:{title: "Nuedge Online - Client Onboarding", pageTitle: "Nuedge Online - Client Onboarding",breadcrumb:'Client Onboarding'},
    children:[
      {
        path:'',
        loadChildren:()=>import('./Home/home.module').then(m => m.HomeModule),
        // data:{title: "Nuedge Online - Client Onboarding", pageTitle: "Nuedge Online - Client Onboarding",breadcrumb:'Client Onboarding',id:'Client Onboarding'},
      },
      {
        path:'create-client',
        loadChildren:()=> import('./Create-Client/create-client.module').then(m => m.CreateClientModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    ClientOnboardingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ClientOnboardingModule { }
