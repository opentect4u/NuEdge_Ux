import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolioComponent } from './folio.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
 const routes:Routes = [{path:'',component:FolioComponent}]

@NgModule({
  declarations: [
    FolioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule
  ]
})
export class FolioModule { }
