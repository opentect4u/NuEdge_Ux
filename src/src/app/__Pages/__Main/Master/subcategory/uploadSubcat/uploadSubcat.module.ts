import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadSubcatComponent } from './uploadSubcat.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';

import { RouterModule, Routes } from '@angular/router';
import { DragSubcatDirective } from 'src/app/__Directives/dragSubcat.directive';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{path:'',component:UploadSubcatComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule,
    MatPaginatorModule
  ],
  declarations: [UploadSubcatComponent,DragSubcatDirective]
})
export class UploadSubcatModule { }
