import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadScmComponent } from './uploadScm.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';


import { RouterModule, Routes } from '@angular/router';
import { SchemDragDirective } from 'src/app/__Directives/schemDrag.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';

const routes: Routes = [{ path: '', component: UploadScmComponent }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  declarations: [UploadScmComponent,SchemDragDirective]
})
export class UploadScmModule { }
