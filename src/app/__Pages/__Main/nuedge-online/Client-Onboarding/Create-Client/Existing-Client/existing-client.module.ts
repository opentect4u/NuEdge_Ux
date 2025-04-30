import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExistingClientComponent } from './existing-client.component';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes = [
  {
    path:'',
    component:ExistingClientComponent,
    data:{title: "Nuedge Online - Existing Client", pageTitle: "Nuedge Online - Existing Client",breadcrumb:'Create Existing Client'}
  }
]


@NgModule({
  declarations: [
    ExistingClientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ExistingClientModule { }
