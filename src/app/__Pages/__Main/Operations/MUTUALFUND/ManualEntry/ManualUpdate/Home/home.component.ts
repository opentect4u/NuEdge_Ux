import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../../assets/json/product_type.json';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menu = menu.filter((x: any) => x.id.toString() == '1')[0].sub_menu;
  constructor(private __utility: UtiliService) {}

  ngOnInit() {}
  getItems(event) {
    switch (event.flag) {
      case 'F':
        this.__utility.navigate(
          '/main/operations/dashboard/manualEntr/manualupdate/financial'
        );
        break;

      case 'N':
        this.__utility.navigate(
          '/main/operations/dashboard/manualEntr/manualupdate/nonfinancial'
        );
        break;
      case 'O':
        this.__utility.navigate(
          '/main/operations/dashboard/manualEntr/manualupdate/nfo'
        );
        break;
    }
  }
}
