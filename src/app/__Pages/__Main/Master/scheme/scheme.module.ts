import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ScmModificationComponent } from './scmModification/scmModification.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


const routes: Routes =[{path:'',component:SchemeComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [SchemeComponent,ScmModificationComponent]
})
export class SchemeModule { 

  constructor() {
    console.log('Scheme Module Loaded');
  }
}
