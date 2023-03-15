import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPrdTypeComponent } from './upload-prd-type.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
// import { SharedModule } from 'src/app/share/shared.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { PrdTypeDragDirective } from 'src/app/__Directives/prdTypeDragdrop.directives';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{path:'',component:UploadPrdTypeComponent}]


@NgModule({
  declarations: [
    UploadPrdTypeComponent,
    PrdTypeDragDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatButtonModule,
    MatTableModule,
      ReactiveFormsModule,
    MatTableExporterModule
  ]
})
export class UploadPrdTypeModule { }
