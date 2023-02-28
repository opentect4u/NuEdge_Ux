import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './uploadCsv.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DocTypeDirective } from 'src/app/__Directives/docType.directive';

const routes: Routes = [{path:'',component:UploadCsvComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule
  ],
  declarations: [UploadCsvComponent,DocTypeDirective]
})
export class UploadCsvModule { }
