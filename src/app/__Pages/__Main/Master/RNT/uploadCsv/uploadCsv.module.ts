import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './uploadCsv.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { SharedModule } from 'src/app/share/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UploadCsvComponent,
    // data: { breadcrumb: 'RNT Upload' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule,
    SharedModule
  ],
  declarations: [UploadCsvComponent],
})
export class UploadCsvModule {}
