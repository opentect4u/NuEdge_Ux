import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCmpComponent } from './upload-cmp.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CompanyDragDirective } from 'src/app/__Directives/drgCmp.directives';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [{path:'',component:UploadCmpComponent}]

@NgModule({
  declarations: [
    UploadCmpComponent,
    CompanyDragDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatButtonModule
  ]
})
export class UploadCmpModule { }
