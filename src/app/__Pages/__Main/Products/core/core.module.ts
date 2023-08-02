import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportFilterComponent } from './report-filter/report-filter.component';

@NgModule({
  declarations: [MenuItemComponent, ReportFilterComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [MenuItemComponent,SharedModule,ReportFilterComponent],
})
export class CoreModule {}
