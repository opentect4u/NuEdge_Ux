import { Component, OnInit } from '@angular/core';
import prd_type from '../../../../../../../../assets/json/product_type.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menu = prd_type.filter((x: any) => x.id.toString() == '1')[0].sub_menu;
  constructor(private utility: UtiliService) {}

  ngOnInit(): void {}
  getItems(event) {
    switch (event.flag) {
      case 'F':
        this.utility.navigate(
          'main/operations/dashboard/manualEntr/mfTrax/financial',
          btoa(event.id)
        );
        break;
      case 'N':
        this.utility.navigate(
          'main/operations/dashboard/manualEntr/mfTrax/nonfinancial',
          btoa(event.id)
        );
        break;
      case 'O':
        this.utility.navigate(
          'main/operations/dashboard/manualEntr/mfTrax/nfo',
          btoa(event.id)
        );
        break;
    }
  }
}
