import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IAumFooterModel } from '../aum.model';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { global } from 'src/app/__Utility/globalFunc';
import { Table } from 'primeng/table';
import moment from 'moment';
@Component({
  selector: 'aum-table',
  templateUrl: './aum-table.component.html',
  styleUrls: ['./aum-table.component.css']
})
export class AumTableComponent implements OnInit {

  @ViewChild('dt') primeTbl:Table

  @Input() dataKey:string | undefined = 'amc_code';

  private _dataSource = [];

  @Input()
  get dataSource() {
    return this._dataSource
  }

  set dataSource(value) {
      this._dataSource = value;
      // let obj = {}
      // const dt = value.map(({total,schemes,cat_name,amc_weightage_in,amc_name,amc_code,...rest}) => {return {...rest,}})
      // for(let object of dt) {Object.assign(obj, object)}
      // Object.keys(obj).forEach(el =>{
      //   this.footerDT = {
      //     ...this.footerDT,
      //     [el]:global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)),
      //   }
      // })


      // this.footerDT = {
      //   "Investment":global.Total__Count(value,((item) => item.inv_cost ? Number(item.inv_cost) : 0)),
      //   "IDCW":global.Total__Count(value,((item) => item.idcwp ? Number(item.idcwp) : 0)),
      //   "IDCW Reinv":global.Total__Count(value,((item) => item.idcw_reinv ? Number(item.idcw_reinv) : 0)),
      //   "AUM":global.Total__Count(value,((item) => item.cur_aum ? Number(item.cur_aum) : 0)),
      //   "Abs.Return":global.Total__Count(value,((item) => item.ret_abs ? Number(item.ret_abs) : 0)),
      //   "Equity":global.Total__Count(value,((item) => item.equity ? Number(item.equity) : 0)),
      //   "Debt":global.Total__Count(value,((item) => item.debt ? Number(item.debt) : 0)),
      //   "Hybrid":global.Total__Count(value,((item) => item.hybrid ? Number(item.hybrid) : 0)),
      //   "Sol Oriented":global.Total__Count(value,((item) => item.sol_oriented ? Number(item.sol_oriented) : 0)),
      //   "Others":global.Total__Count(value,((item) => item.others ? Number(item.others) : 0))
      // }
  }

  /*** Holding Primeng DataTable data */
  // @Input() dataSource = [];
  /**** END */

  /*** Table Footer Details */
  @Input() footerDT:Partial<IAumFooterModel>;
  /*** End */

  @Input() isLoaderShown:boolean | undefined = false

  /*** Table Has SubColumn */
  has_sub_column:boolean;
  /*** End */

  @Input() __formDate:string;

  @Input() isShowTotalCalc:boolean = true;

  // @Input() aum_type: 'Fund House' | 'Families' | 'Clients' | 'Scheme' = 'Fund House';
  aum_type: 'Fund House' | 'Families' | 'Clients' | 'Scheme' | 'Assets Allocation' | 'Registrar';


  @Input() column:column[] = [];

  @Input() subColumn:column[] = [];



  constructor(private RouteData:ActivatedRoute,private utility:UtiliService) {
    RouteData.data.subscribe(res =>{
        // console.log(res)
        console.log(res);
        this.aum_type = res?.pageTitle;
        this.has_sub_column = res?.has_sub_column
    })
   }

  ngOnInit(): void {

    

  }

  getColumns(){
      return this.utility.getColumns(this.column)
  }

  onRowExpand(ev){
    console.log(ev)
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  getRouteData = (data) =>{

  }

}
