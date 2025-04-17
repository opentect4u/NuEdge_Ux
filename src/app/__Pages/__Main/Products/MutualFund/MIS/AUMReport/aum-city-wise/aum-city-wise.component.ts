import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IAumFooterModel } from '../component/aum.model';

@Component({
  selector: 'app-aum-city-wise',
  templateUrl: './aum-city-wise.component.html',
  styleUrls: ['./aum-city-wise.component.css']
})
export class AumCityWiseComponent implements OnInit {
constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  md_aum_client = [];

  __formDate:string = new Date().toLocaleDateString();

  aum_client_Column:column[] = AumFamilyColumn.column;

  /*** Table Footer Details */
  footerDT:Partial<IAumFooterModel> = {
    "Abs. Return":0.00,
    "IDCW Reinv":0.00,
    "Sol Oriented":0.00,
    AUM:0.00,
    IDCW:0.00,
    Investment:0.00,
    xirr:0.00 
  };
  /*** End */

  ngOnInit(): void {}

  getFormData = (ev) => {}

}




export class AumFamilyColumn{
  public static column:column[] = [
    {
      field:'cit_type_name',
      header:'City Type',
      width:'24rem'
    },
    // {
    //   field:'broker_name',
    //   header:'Broker Name',
    //   width:'8rem'
    // },
    {
      field:'inv_cost',
      header:'Investment',
      width:'8rem'
    },
    {
      field:'idcw_paid',
      header:'IDCWP',
      width:'8rem'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'10rem'
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:'6rem'
    },
    {
      field:'ret_abs',
      header:'Abs. Return',
      width:'6rem'
    }
  ];
}