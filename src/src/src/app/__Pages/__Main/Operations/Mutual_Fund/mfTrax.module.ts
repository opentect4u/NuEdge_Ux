import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MfTraxComponent } from './mfTrax.component';
import { RouterModule, Routes } from '@angular/router';
import { FinancialComponent } from './financial/financial.component';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { Cmn_dialogComponent } from './common/cmn_dialog/cmn_dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NonfinancialComponent } from './nonfinancial/nonfinancial.component';
import { NFOComponent } from './NFO/NFO.component';
import { MasterTblComponent } from './common/MasterTbl/MasterTbl.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
const routes: Routes = [
  {
    path: '',
    component: MfTraxComponent,
    children: [
      {
        path: 'fin',
        component:FinancialComponent,
        data: { id: 23, has_menu: 'Y', title: 'NuEdge - Financial', pageTitle: "Financial" ,trans_type_id:1}
      },
      {
        path: 'nonfin',
        component:NonfinancialComponent,
        data: { id: 24, has_menu: 'Y', title: 'NuEdge - Non Financial', pageTitle: "Non Financial",trans_type_id:3 }
      },
      {
        path:'nfo',
        component:NFOComponent,
        data:{ id: 25, has_menu: 'Y', title: 'NuEdge - NFO', pageTitle: "NFO" , trans_type_id:4}
      },
      {
        path:'prodTypeModification',
        loadChildren:()=> import('./transTypeModification/transTypeModification.module').then(m => m.TransTypeModificationModule),
        data:{id:0,has_menu:'Y',title:'NuEdge - Product Type Modification'}
      }
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonToggleModule,
    SharedModule
  ],
  declarations: [
    MfTraxComponent,
    FinancialComponent,
    Cmn_dialogComponent,
    NonfinancialComponent,
    MasterTblComponent,
    NFOComponent],
  entryComponents:[Cmn_dialogComponent],
  providers:[DatePipe]

})
export class MfTraxModule {
  constructor() {
    console.log('mfTrax Module Loaded');
  }
}
