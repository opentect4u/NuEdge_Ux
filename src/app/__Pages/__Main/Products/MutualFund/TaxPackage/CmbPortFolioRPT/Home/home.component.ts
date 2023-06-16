import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import Menus from '../../../../../../../../assets/json/Product/MF/MIS/TaxPkg/cmbprtfolioRPT.json';
import brdCrmbs from '../../../../../../../../assets/json/BreadCrumbs/Products/MF/cmbPortFolioRpt.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = Menus;
  constructor(private utility: UtiliService) { this.setBreadCrumb();}
  ngOnInit(): void {}
  setBreadCrumb(){this.utility.getBreadCrumb(brdCrmbs);}
}
