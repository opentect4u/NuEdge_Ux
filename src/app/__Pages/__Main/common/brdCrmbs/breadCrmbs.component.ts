import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'main-brdCrmbs',
  templateUrl: './breadCrmbs.component.html',
  styleUrls: ['./breadCrmbs.component.css'],
})
export class BreadcrmbsComponent implements OnInit {
  breadcrumbs: breadCrumb[];

  constructor(private __utility: UtiliService) {
    this.__utility.__latestBrdCrmbs$.pipe(skip(1)).subscribe((res) => {
      if (res.length > 0) {
        this.breadcrumbs = res;
      }
    });
  }
  ngOnInit() {}
}
