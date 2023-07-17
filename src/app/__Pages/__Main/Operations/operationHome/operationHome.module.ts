import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationHomeComponent } from './operationHome.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: OperationHomeComponent,
    data: { breadcrumb: null },
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)],
  declarations: [OperationHomeComponent],
})
export class OperationHomeModule {
  /**
   *
   */
  constructor() {
    console.log('Operation Home Module Loaded');
  }
}
