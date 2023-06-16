import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatMainLandingComponent } from './catMainLanding.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CatMainLandingComponent,
    data: { breadcrumb: 'Category' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../category/category.module').then(
            (m) => m.CategoryModule
          ),
        data: {
          breadcrumb: null,
          parentId: 4,
          id: 5,
          title: 'NuEdge - Category Master',
          pageTitle: 'Category Master',
          has_menubar: 'Y',
        },
      },
      {
        path: 'uploadcategory',
        loadChildren: () =>
          import('../../category/catUpload/catUpload.module').then(
            (m) => m.CatUploadModule
          ),
        data: {
          breadcrumb: 'Upload Category',
          parentId: 4,
          id: 21,
          title: 'NuEdge - Category Uploadation',
          pageTitle: 'Category Upload',
          has_menubar: 'Y',
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [CatMainLandingComponent],
})
export class CatMainLandingModule {}
