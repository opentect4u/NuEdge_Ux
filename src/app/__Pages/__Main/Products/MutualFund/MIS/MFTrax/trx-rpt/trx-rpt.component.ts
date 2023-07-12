import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { excelHeaders, transRPT} from './trx-rpt';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RPTService } from 'src/app/__Services/RPT.service';
@Component({
  selector: 'app-trx-rpt',
  templateUrl: './trx-rpt.component.html',
  styleUrls: ['./trx-rpt.component.css']
})
export class TrxRptComponent implements OnInit {
  folio_no:string;
  headerClms:string[][]= excelHeaders
  trnsMst:transRPT = {data:[]};
  trxFrm = new FormGroup({
    folio_no:new FormControl(''),
    date:new FormControl('')
  })
  excelHeaders:string[][];
  constructor(
    private dbIntr:DbIntrService,
    private utility:UtiliService,
    private __Rpt:RPTService
    ) { }

  ngOnInit(): void {

  }
  searchReport(){
    this.folio_no = this.trxFrm.value.folio_no;
    this.dbIntr.api_call(1,'/showTransDetails',this.utility.convertFormData(this.trxFrm.value))
    .subscribe((res:transRPT) =>{
        this.trnsMst = res;
    })
  }
  refresh(){
    this.folio_no  = ''
    this.trxFrm.patchValue({
      folio_no:'',
      date:''
    })
    this.searchReport();
  }
  printPdf(){
    this.__Rpt.printRPT('trxDt');
  }
  exportExl(){
    const trxnDtls = this.trnsMst.data.map(({updated_at,created_at,id, ...rest}) => {
      return rest;
    });
    this.__Rpt.exportExl(trxnDtls,this.headerClms);
  }

}
