import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadProductComponent } from './upload-product.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { uploadInsProductDragDirective } from 'src/app/__Directives/uploadInsPrd.directive';


const routes: Routes= [{path:'',component:UploadProductComponent}]

@NgModule({
  declarations: [
    UploadProductComponent,
    uploadInsProductDragDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(routes),
    MatTableExporterModule
  ]
})
export class UploadProductModule { }
