import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { DaySheetComponent } from './daySheet/daySheet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CmnDialogComponent } from './common/cmnDialog/cmnDialog.component';
import { MatTableModule } from '@angular/material/table';
import { CmnTbleComponent } from './common/cmnTble/cmnTble.component';
import { MatTableExporterModule } from 'mat-table-exporter';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'daySheet', 
      component: DaySheetComponent, 
      data: { id: 26, title: "NuEdge - Day Sheet Reports", pageTitle: " Day Sheet Reports", has_member: 'Y' } 
      }
    ]
  }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatTableExporterModule
  ],
  declarations: [ReportsComponent, DaySheetComponent,CmnDialogComponent,CmnTbleComponent],
  providers:[DatePipe]
})
export class ReportsModule {
  constructor() {
    console.log('Reports Module Loaded');
  }
}
