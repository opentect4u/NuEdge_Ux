import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ScmModificationComponent } from './scmModification/scmModification.component';
import { MatButtonModule } from '@angular/material/button';


const routes: Routes =[{path:'',component:SchemeComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [SchemeComponent,ScmModificationComponent]
})
export class SchemeModule { 

  constructor() {
    console.log('Scheme Module Loaded');
  }
}
