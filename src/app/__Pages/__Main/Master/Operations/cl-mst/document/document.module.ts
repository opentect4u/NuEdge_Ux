import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document.component';
import { RouterModule, Routes } from '@angular/router';
import { DocsModificationComponent } from './docsModification/docsModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocrptComponent } from './docRPT/docRPT.component';

const routes: Routes =[{path:'',component:DocumentComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    DocumentComponent,
    DocrptComponent,
    DocsModificationComponent]
})
export class DocumentModule {
  constructor() {
    console.log('Document Module Loaded');
  }
 }
