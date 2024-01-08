import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnkbarComponent } from './snkbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [SnkbarComponent],
  entryComponents:[SnkbarComponent]
})
export class SnkbarModule { }
