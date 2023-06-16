import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonFinComponent } from './non-fin.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NonfinrptComponent } from './Dialog/nonfinRPT/nonFinRPT.component';
import { NonfinmodificationComponent } from './Dialog/nonFinModification/nonFInModification.component';

const routes: Routes = [{ path: '', component: NonFinComponent }];

@NgModule({
  declarations: [
    NonFinComponent,
    NonfinrptComponent,
    NonfinmodificationComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class NonFinModule {}
