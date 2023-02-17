import { Component, OnInit } from '@angular/core';
import { map, skip } from 'rxjs/operators';
import { IBreadCrumb } from 'src/app/app.component';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
selector: 'main-brdCrmbs',
templateUrl: './breadCrmbs.component.html',
styleUrls: ['./breadCrmbs.component.css']
})
export class BreadcrmbsComponent implements OnInit {
  breadcrumbs: IBreadCrumb[];
constructor(
  private __utility: UtiliService
) {
    this.__utility.__brdCrumbs$.pipe(skip(1)).subscribe(res => {
      console.log(res);
      if(res.length > 0){
        this.breadcrumbs = res;
      }

    })
}

ngOnInit(){
}
}
