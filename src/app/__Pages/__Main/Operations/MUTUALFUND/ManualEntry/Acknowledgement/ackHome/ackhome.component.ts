import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import prd_type from '../../../../../../../../assets/json/product_type.json';
@Component({
  selector: 'ackhome-component',
  templateUrl: './ackhome.component.html',
  styleUrls: ['./ackhome.component.css'],
})
export class AckhomeComponent implements OnInit {
  menu = prd_type.filter((x: any) => x.id.toString() == '1')[0].sub_menu;
  constructor(private __utility: UtiliService) {}
  ngOnInit() {}
  getItems(event) {
    switch (event.flag) {
      case 'O':
      case 'F':
        this.__utility.navigate(
          '/main/operations/dashboard/manualEntr/acknowldgement/ackEntry',
          btoa(event.id)
        );
        break;
      case 'N':
        this.__utility.navigate(
          '/main/operations/dashboard/manualEntr/acknowldgement/ackNonFin',
          btoa(event.id)
        );
        break;
    }
  }
}
