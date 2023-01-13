import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DocsModificationComponent } from './docsModification/docsModification.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes =[{path:'',component:DocumentComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule
  ],
  declarations: [DocumentComponent,DocsModificationComponent]
})
export class DocumentModule {
  constructor() {
    console.log('Document Module Loaded');
  }
 }
