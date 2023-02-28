import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankUploadComponent } from './bankUpload.component';
import { DragBnkDirective } from 'src/app/__Directives/dragBnk.directive';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';

const routes: Routes = [{path:'',component:BankUploadComponent}]

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
  declarations: [BankUploadComponent,DragBnkDirective]
})
export class BankUploadModule { }
