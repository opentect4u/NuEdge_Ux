import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './branch.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { BranchModificationComponent } from './branchModification/branchModification.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

const routes:Routes =[{path:'',component:BranchComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [BranchComponent,BranchModificationComponent]
})
export class BranchModule {
  constructor() {
       console.log('Branch Module Loaded')
  }
 }
