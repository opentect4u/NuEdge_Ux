import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadOptionComponent } from './uploadOption.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OptionDragDirective } from 'src/app/__Directives/optionDrag.directive';

const routes: Routes= [{path:'',component:UploadOptionComponent}]
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(routes),
    MatTableExporterModule,
    MatPaginatorModule
  ],
  declarations: [UploadOptionComponent,OptionDragDirective]
})
export class UploadOptionModule { }
