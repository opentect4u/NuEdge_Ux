import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransTypeComponent } from './transType.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TrnstypeModificationComponent } from './trnstypeModification/trnstypeModification.component';

const routes: Routes = [{path:'',component:TransTypeComponent}] 

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [TransTypeComponent,TrnstypeModificationComponent]
})
export class TransTypeModule { 
  constructor() {
    console.log('Trans Type Module Loaded');
    
  }
}
