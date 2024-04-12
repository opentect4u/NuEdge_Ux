import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'portfolio-live-sip',
  templateUrl: './live-sip.component.html',
  styleUrls: ['./live-sip.component.css']
})
export class LiveSIPComponent implements OnInit {

  @Input() liveSIP:Partial<ILiveSIP>[] = []

  column:column[] = LiveSIPColumn.column

  @ViewChild('dt') primaryTbl :Table;


  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
}


export interface ILiveSIP{
    client_name:string;
    scheme_name:string;
    active_status:string;
    folio_no:string;
    sip_freq:string;
    sip_trxn_no:string;
    sip_start_date:Date;
    sip_end_date:Date;
    terminate_date:Date;
    sip_date:Date;
    sip_amount:number;
    remaining_inv:number;
    bank_name:string;
    xirr:number;
    plan_name:string;
    option_name:string
}


export class LiveSIPColumn{
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No',
      width:'5rem'
    },
    {
      field:'client_name',
      header:'Client',
      width:'15rem'
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'30rem'
    },
    {
      field:'activate_status',
      header:'Active Status',
      width:'8rem'
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'8rem'
    },
    {
      field:'sip_freq',
      header:'SIP Frq',
      width:'7rem'
    },
    {
      field:'sip_trxn_no',
      header:'SIP Txn No.',
      width:'8rem'
    },
    {
      field:'sip_start_date',
      header:'SIP Start Date',
      width:'10rem'
    },
    {
      field:'sip_end_date',
      header:'SIP End Date',
      width:'10rem'
    },
    {
      field:'terminate_date',
      header:'Termination Date',
      width:'10rem'
    },
    {
      field:'sip_date',
      header:'SIP Date',
      width:'10rem'
    },
    {
      field:'sip_amount',
      header:'SIP Amount',
      width:'10rem'
    },
    {
      field:'remaining_inv',
      header:'Rem. Inst',
      width:'7rem'
    },
    {
      field:'bank_name',
      header:'Bank',
      width:'10rem'
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'5rem'
    }
  ]
}
