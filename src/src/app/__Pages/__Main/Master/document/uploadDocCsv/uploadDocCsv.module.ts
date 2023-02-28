import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocCsvComponent } from './uploadDocCsv.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DocDirective } from 'src/app/__Directives/doc.directive';

const routes: Routes = [{ path: '', component: UploadDocCsvComponent }]

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UploadDocCsvComponent,DocDirective]
})
export class UploadDocCsvModule { }
