import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RcvFrmComponent } from './RcvFrm.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { RcvFormAdditionComponent } from './rcvFormAddition/rcvFormAddition.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DeletercvComponent } from './deletercv/deletercv.component';
const routes:Routes= [{path:'',component:RcvFrmComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    MatButtonToggleModule
  ],
  declarations: [RcvFrmComponent,RcvFormAdditionComponent,DeletercvComponent],
  providers:[DatePipe]
})
export class RcvFrmModule {
  constructor() {
     console.log('Recieve Form Module Loaded');
  }
 }
