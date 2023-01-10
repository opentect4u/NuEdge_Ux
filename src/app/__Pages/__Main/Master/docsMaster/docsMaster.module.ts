import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsMasterComponent } from './docsMaster.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DocsModificationComponent } from './docsModification/docsModification.component';
const routes: Routes =[{path:'',component:DocsMasterComponent}]
@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatIconModule
  ],
  declarations: [DocsMasterComponent,DocsModificationComponent]
})
export class DocsMasterModule { 
  constructor() {
    console.log("Document Master Module Loaded");
  }
}
