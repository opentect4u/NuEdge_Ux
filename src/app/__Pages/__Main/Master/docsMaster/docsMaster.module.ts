import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsMasterComponent } from './docsMaster.component';
import { RouterModule, Routes } from '@angular/router';
import { DocsModificationComponent } from './docsModification/docsModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DoctyperptComponent } from './docTypeRpt/docTypeRpt.component';
const routes: Routes =[{path:'',component:DocsMasterComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [DocsMasterComponent,DocsModificationComponent,DoctyperptComponent]
})
export class DocsMasterModule {
  constructor() {
    console.log("Document Master Module Loaded");
  }
}
