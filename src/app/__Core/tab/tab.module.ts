import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    TabComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule
  ],
  exports:[TabComponent]
})
export class TabModule { }
