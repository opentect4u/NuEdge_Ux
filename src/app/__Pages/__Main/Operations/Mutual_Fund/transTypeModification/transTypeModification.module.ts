import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransTypeModificationComponent } from './transTypeModification.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CmnDialogForDtlsViewComponent } from '../common/cmnDialogForDtlsView/cmnDialogForDtlsView.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
const routes: Routes = [{path:'',component:TransTypeModificationComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    OverlayModule
  ],
  declarations: [TransTypeModificationComponent,CmnDialogForDtlsViewComponent]
})
export class TransTypeModificationModule { }
