import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScmTypeComponent } from './scmType.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ScmTypeComponent}]

/* This module defines the routing for the ScmTypeComponent.
   It imports CommonModule for common directives and RouterModule for routing functionalities.
   The ScmTypeComponent is declared in this module, and the route is set to load this component when the path is empty.
*/
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScmTypeComponent]
})
export class ScmTypeModule { }
