import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScmDashboardComponent } from './scmDashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ScmDashboardComponent }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScmDashboardComponent]
})
export class ScmDashboardModule { }
