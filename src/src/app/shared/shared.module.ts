import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnkrplcPipe } from '../__Pipes/bnkrplc.pipe';
import { ClOutsideClickDirective } from '../__Directives/clOutsideClick.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BnkrplcPipe,ClOutsideClickDirective],
  exports:[BnkrplcPipe,ClOutsideClickDirective]
})
export class SharedModule { }
