import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '../input/input.module';
import { SearchResVisibilityDirective } from 'src/app/__Directives/searchResVisibility.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule
  ],
  declarations: [SearchComponent,SearchResVisibilityDirective],
  exports:[SearchComponent,ReactiveFormsModule]
})
export class SearchModule {
  constructor(){
  console.log('Search Module Loaded');
  
  }
 }
