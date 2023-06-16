import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScmMainLandingComponent } from './scmMainLanding.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ScmMainLandingComponent,
    data: { breadcrumb: 'Scheme' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../scheme/scheme.module').then((m) => m.SchemeModule),
        data: {
          parentId: 4,
          id: 8,
          title: 'NuEdge - Scheme  Master',
          pageTitle: 'Scheme Master',
          has_menubar: 'Y',
        },
      },
      {
        path: 'uploadScm',
        loadChildren: () =>
          import('../../scheme/uploadScm/uploadScm.module').then(
            (m) => m.UploadScmModule
          ),
        data: {
          breadcrumb: 'Upload Scheme',
          parentId: 4,
          id: 31,
          title: 'NuEdge - Scheme Uploadation',
          pageTitle: 'Scheme Upload',
          has_menubar: 'Y',
        },
      },
      {
        path:'isin',
        loadChildren: ()=> import('../../ISIN/isin.module').then(m => m.IsinModule),
        data:{
          breadcrumb: 'ISIN',
          parentId: 4,
          id: 32,
          title: 'NuEdge - ISIN',
          pageTitle: 'ISIN Master',
          has_menubar: 'Y',
        }
      }
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ScmMainLandingComponent],
})
export class ScmMainLandingModule {}
