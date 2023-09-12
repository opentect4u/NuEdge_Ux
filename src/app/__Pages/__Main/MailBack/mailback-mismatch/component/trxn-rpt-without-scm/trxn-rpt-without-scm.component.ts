import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
// import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'mailBack-trxn-rpt-without-scm',
  templateUrl: './trxn-rpt-without-scm.component.html',
  styleUrls: ['./trxn-rpt-without-scm.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class TrxnRptWithoutScmComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl :Table;

  @Input() mismatch_flag:string;

  /**
   * Holding Transaction Report which has empty scheme
   */
  @Input() trxnRptWithOutScm:TrxnRpt[];

  /**
   * Hold the Column for Transaction Report
   */
  // TrxnClm:column[] = trxnClm.column;
  @Input() TrxnClm:column[] = [];

  @Output() changeStatusOfTrxn = new EventEmitter();


  constructor(
    private utility:UtiliService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
  }
  getColumns = () =>{
    return this.utility.getColumns(this.TrxnClm);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  lockTrxn = (event,trxn,index) =>{
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to ${trxn.lock_status == 'Y' ? 'unlock' : 'lock'} this transaction?`,
      icon: trxn.lock_status == 'Y' ? 'pi pi-unlock' : 'pi pi-lock',
      accept: () => {
        this.confirmationService.close();
        let dt;
        dt = this.trxnRptWithOutScm.filter((el:TrxnRpt,i:number) =>{
                     if(index == i){
                      el.lock_status = el.lock_status != 'Y' ? 'Y': 'N';
                     }
                     return el;
        });
        console.log(dt);
        this.changeStatusOfTrxn.emit(dt);
      },
      reject: () => {
         console.log('Reject Clicked');
          this.confirmationService.close();
      }
  });
  }

  navigate = () =>{
    this.utility.navigatewithqueryparams(
      '/main/master/productwisemenu/scheme',
      {
        queryParams:{
          scheme_type:btoa('O')
        }
      }
    )
  }

  navigateISIN = () =>{
    this.utility.navigatewithqueryparams(
      '/main/master/productwisemenu/scheme/isin',
      {
        queryParams:{
          isin_status:btoa('O')
        }
      }
    )
  }
}
