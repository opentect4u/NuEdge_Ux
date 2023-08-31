import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCtrlComponent } from './alert-ctrl.component';


@NgModule({
  declarations: [
    AlertCtrlComponent
  ],
  imports: [
    CommonModule,
    // MessagesModule
  ],
  exports:[AlertCtrlComponent]
})
export class AlertCtrlModule { }
