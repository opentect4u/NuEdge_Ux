import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './uploadCsv.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ClientCsvDirective } from 'src/app/__Directives/clientCsv.directive';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{path:'',component:UploadCsvComponent}]

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
  declarations: [UploadCsvComponent,ClientCsvDirective]
})
export class UploadCsvModule { }
