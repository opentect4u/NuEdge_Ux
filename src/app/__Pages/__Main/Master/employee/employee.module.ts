import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { EmpModificationComponent } from './empModification/empModification.component';

const routes: Routes = [{path:'',component:EmployeeComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [EmployeeComponent,EmpModificationComponent]
})
export class EmployeeModule {
  /**
   *
   */
  constructor() {
      console.log('Employee Module Loaded');
  }
 }
