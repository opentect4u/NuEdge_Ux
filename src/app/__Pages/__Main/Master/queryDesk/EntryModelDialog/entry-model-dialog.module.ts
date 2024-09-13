import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductEntrySecreenComponent } from './product-entry-secreen/product-entry-secreen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QueryTypeSubTypeComponent } from './query-type-sub-type/query-type-sub-type.component';
import { QueryNatureEntryScreenComponent } from './query-nature-entry-screen/query-nature-entry-screen.component';
import { QueryStatusComponent } from './query-status/query-status.component';
import { QueryGivenComponent } from './query-given/query-given.component';
import { QueryRecieveGivenThroughComponent } from './query-recieve-given-through/query-recieve-given-through.component';



@NgModule({
  declarations: [
    ProductEntrySecreenComponent,
    QueryTypeSubTypeComponent,
    QueryNatureEntryScreenComponent,
    QueryStatusComponent,
    QueryGivenComponent,
    QueryRecieveGivenThroughComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    SharedModule
  ]
})
export class EntryModelDialogModule { }
