import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormModificationComponent } from './formModification/formModification.component';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
const routes: Routes = [{path:'',component:FormComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [FormComponent,FormModificationComponent]
})
export class FormModule {
  constructor(){
    console.log('Forms Module Loaded');
  }
  
 }
