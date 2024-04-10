import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'portfolio-live-stp',
  templateUrl: './live-stp.component.html',
  styleUrls: ['./live-stp.component.css']
})
export class LiveSTPComponent implements OnInit {

  @Input() liveSTP:Partial<ILiveSTP>[] = []

  column:column[] = LiveSTPColumn.column

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


export interface ILiveSTP{
    client_name:string;
    scheme:string;
    active_status:string;
    folio_no:string;
    stp_freq:string;
    stp_trxn_no:string;
    stp_start_date:Date;
    stp_end_date:Date;
    terminate_date:Date;
    stp_date:Date;
    stp_amount:number;
    remaining_inv:number;
    bank_name:string;
    xirr:number;
}


export class LiveSTPColumn{
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
      field:'scheme',
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
      field:'stp_freq',
      header:'STP Frq',
      width:'7rem'
    },
    {
      field:'stp_trxn_no',
      header:'STP Txn No.',
      width:'8rem'
    },
    {
      field:'stp_start_date',
      header:'STP Start Date',
      width:'10rem'
    },
    {
      field:'stp_end_date',
      header:'STP End Date',
      width:'10rem'
    },
    {
      field:'terminate_date',
      header:'Termination Date',
      width:'10rem'
    },
    {
      field:'stp_date',
      header:'STP Date',
      width:'10rem'
    },
    {
      field:'stp_amount',
      header:'StP Amount',
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
