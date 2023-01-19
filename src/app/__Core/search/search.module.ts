import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchComponent } from './search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '../input/input.module';
import { SearchResVisibilityDirective } from 'src/app/__Directives/searchResVisibility.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [SearchComponent,SearchResVisibilityDirective],
  exports:[SearchComponent,ReactiveFormsModule,MatIconModule,MatButtonModule],
  providers:[DatePipe]
})
export class SearchModule {
  constructor(){
  console.log('Search Module Loaded');
  }
 }
