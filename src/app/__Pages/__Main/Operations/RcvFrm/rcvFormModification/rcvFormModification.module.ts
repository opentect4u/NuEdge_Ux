import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RcvFormModificationComponent } from './rcvFormModification.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogDtlsComponent } from '../dialogDtls/dialogDtls.component';
import { OverlayModule } from '@angular/cdk/overlay';
import {MatMenuModule} from '@angular/material/menu';
import { createClientComponent } from '../createClient/createClient\'.component';
const routes:Routes= [{path:'',component:RcvFormModificationComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    OverlayModule,
    MatMenuModule
  ],
  declarations: [RcvFormModificationComponent,DialogDtlsComponent,createClientComponent]
})
export class RcvFormModificationModule { }
