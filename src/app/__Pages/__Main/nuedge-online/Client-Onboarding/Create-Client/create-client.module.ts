import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateClientComponent } from './create-client.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:CreateClientComponent,
    data:{title: "Nuedge Online - Create Client", pageTitle: "Nuedge Online - Create Client",breadcrumb:'Create Client'},
    children:[
      {
        path:'',
        loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
      },
      {
        path:'new-client',
        loadChildren:() => import('./New-Client/new-client.module').then(m => m.NewClientModule)
      },
      {
        path:'existing-client',
        loadChildren:() => import('./Existing-Client/existing-client.module').then(m => m.ExistingClientModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    CreateClientComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CreateClientModule { }
