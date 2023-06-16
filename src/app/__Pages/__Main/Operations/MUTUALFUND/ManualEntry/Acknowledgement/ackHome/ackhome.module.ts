import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AckhomeComponent } from './ackhome.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AckhomeComponent,
    data: { breadcrumb: null },
  },
];
@NgModule({
  declarations: [AckhomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [],
})
export class AckhomeModule {}
