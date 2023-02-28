import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPlnComponent } from './uploadPln.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { RouterModule, Routes } from '@angular/router';

import { MatPaginatorModule } from '@angular/material/paginator';
import { DragPlanDirective } from 'src/app/__Directives/dragPlan.directive';


const routes: Routes= [{path:'',component:UploadPlnComponent}]
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(routes),
    MatTableExporterModule,
    MatPaginatorModule
  ],
  declarations: [UploadPlnComponent,DragPlanDirective]
})
export class UploadPlnModule { }
