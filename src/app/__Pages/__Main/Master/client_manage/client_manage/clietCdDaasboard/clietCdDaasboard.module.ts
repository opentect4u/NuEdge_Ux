import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClietCdDaasboardComponent } from './clietCdDaasboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path:'',component:ClietCdDaasboardComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClietCdDaasboardComponent]
})
export class ClietCdDaasboardModule { }
