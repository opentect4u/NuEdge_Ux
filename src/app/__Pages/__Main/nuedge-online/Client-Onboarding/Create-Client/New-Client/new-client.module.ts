import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewClientComponent } from './new-client.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../components/core.module';

const routes:Routes = [
  {
    path:'',
    component:NewClientComponent,
    data:{title: "Nuedge Online - New Client", pageTitle: "Nuedge Online - New Client",breadcrumb:'Create New Client'}
  }
]

@NgModule({
  declarations: [
    NewClientComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule
  ]
})
export class NewClientModule { }
