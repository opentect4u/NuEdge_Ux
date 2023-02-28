import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScmTypeComponent } from './scmType.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ScmTypeComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScmTypeComponent]
})
export class ScmTypeModule { }
