import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateFamilyComponent } from './create-family.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { DropdownModule } from 'primeng/dropdown';

const routes:Routes =[
   {
     path:'',
     component:CreateFamilyComponent,
     data:{id:1,breadcrumb:'Create Family',pageTitle:'NuEdge - Create Family',title:'NuEdge - Create Family'},
   }
]

@NgModule({
  declarations: [
    CreateFamilyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DropdownModule
  ]
})
export class CreateFamilyModule { }
