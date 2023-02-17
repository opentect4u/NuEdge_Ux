import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcatMainLandingComponent } from './subcatMainLanding.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SubcatMainLandingComponent,
    data: { breadcrumb: 'Sub Category' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../subcategory/subcategory.module').then(
            (m) => m.SubcategoryModule
          ),
        data: {
          parentId: 4,
          breadcrumb: null,
          id: 6,
          title: 'NuEdge - Sub-Category Master',
          pageTitle: 'Sub-Category Master',
          has_menubar: 'Y',
        },
      },
      {
        path: 'uploadSubcat',
        loadChildren: () =>
          import('../../subcategory/uploadSubcat/uploadSubcat.module').then(
            (m) => m.UploadSubcatModule
          ),
        data: {
          parentId: 4,
          breadcrumb: null,
          id: 24,
          title: 'NuEdge - Sub-Category Modification',
          pageTitle: 'Sub-Category Addtion / Updation',
          has_menubar: 'Y',
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [SubcatMainLandingComponent],
})
export class SubcatMainLandingModule {}
