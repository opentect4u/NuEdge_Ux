import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateComponent } from './state.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:StateComponent,
  data:{breadcrumb:'State'},

  children:[
    {
      path:'home',
      loadChildren:() => import('./home/state-home.module').then(home => home.StateHomeModule)
    },
    {
      path:'uploadstate',
      loadChildren:() => import('./uploadCsv/upload-csv.module').then(upload => upload.UploadCsvModule),
      data:{breadcrumb:'Upload State'},
    },
    {
      path:'',
      redirectTo:'home',
      pathMatch:'full'
    }
  ]
}]

@NgModule({
  declarations: [
    StateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class StateModule { }
