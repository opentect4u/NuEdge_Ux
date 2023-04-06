import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './upload-csv.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/share/shared.module';

 const routes: Routes = [{path:'',component:UploadCsvComponent}]

@NgModule({
  declarations: [
    UploadCsvComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableExporterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SharedModule
  ]
})
export class UploadCsvModule { }
