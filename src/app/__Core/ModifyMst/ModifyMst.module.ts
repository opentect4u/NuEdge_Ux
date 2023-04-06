import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModifyMstComponent } from './ModifyMst.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MstDataGetterPipe } from 'src/app/__Pipes/MstDataGetter.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableExporterModule,

  ],
  declarations: [ModifyMstComponent,MstDataGetterPipe],
  exports: [ModifyMstComponent],
})
export class ModifyMstModule {}
