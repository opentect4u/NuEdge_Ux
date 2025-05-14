import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewClientComponent } from './new-client.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../components/core.module';
import { FieldsetModule } from 'primeng/fieldset';
import { UppercaseDirective } from 'src/app/__Directives/uppercase.directive';

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
    UppercaseDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    FieldsetModule
  ]
})
export class NewClientModule { }
