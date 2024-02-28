import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateFamilyComponent } from './update-family.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [{path:'',
component:UpdateFamilyComponent,
data:{id:1,breadcrumb:'Update Family',pageTitle:'NuEdge - Update Family',title:'NuEdge - Update Family'},

}]

@NgModule({
  declarations: [
    UpdateFamilyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    DropdownModule,
  ]
})
export class UpdateFamilyModule { }
