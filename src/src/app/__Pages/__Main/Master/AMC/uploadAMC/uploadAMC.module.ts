import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAMCComponent } from './uploadAMC.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { RouterModule, Routes } from '@angular/router';
import { DragAmcDirective } from 'src/app/__Directives/dragAmc.directive';
import { MatPaginatorModule } from '@angular/material/paginator';


const routes: Routes= [{path:'',component:UploadAMCComponent}]
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
  declarations: [UploadAMCComponent,DragAmcDirective]
})
export class UploadAMCModule { }
