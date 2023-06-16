import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewComponent } from './add-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
  path:'',
  component:AddNewComponent,
  children:[
    {
      path:'home',
     loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule),
    },
    {
      path: 'clientmaster',
      loadChildren: () =>
        import('./client_manage/client-manage.module').then(
          (m) => m.ClientManageModule
        ),
      data: {
        parentId: 4,
        id: 2,
        title: 'NuEdge - Client Master',
        pageTitle: 'Client Master',
        has_menubar: 'Y',
      },
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
    AddNewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AddNewModule { }
