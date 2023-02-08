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
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
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
    MatPaginatorModule,
    SharedModule
  ],
  declarations: [RcvFrmComponent,RcvFormAdditionComponent],
  providers:[DatePipe]
})
export class RcvFrmModule {
  constructor() {
     console.log('Recieve Form Module Loaded');
  }
 }
