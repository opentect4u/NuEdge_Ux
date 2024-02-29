import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyRelationshipComponent } from './family-relationship.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';

 const routes:Routes = [{path:'',
 component:FamilyRelationshipComponent,
 data:{id:1,breadcrumb:'Family Relationship',pageTitle:'NuEdge - Family Relationship',title:'NuEdge - Family Relationship'}
}]

@NgModule({
  declarations: [
    FamilyRelationshipComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DropdownModule
  ]
})
export class FamilyRelationshipModule { }
