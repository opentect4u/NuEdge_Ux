import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AMCComponent } from './AMC.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { AMCModificationComponent } from './AMCModification/AMCModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes =[{path:'',component:AMCComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [AMCComponent,AMCModificationComponent]
})
export class AMCModule {
  constructor() {
    console.log("AMCModule Loaded");
  }
 }
