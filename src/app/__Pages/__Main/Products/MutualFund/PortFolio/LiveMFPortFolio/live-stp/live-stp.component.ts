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
    first_client_name:string;
    scheme_name:string;
    activate_status:string;
    folio_no:string;
    freq:string;
    reg_no:string;
    from_date:Date;
    to_date:Date;
    terminated_date:Date;
    stp_date:Date;
    stp_amount:number;
    remaining_inv:number;
    bank_name:string;
    xirr:number;
    plan_name:string;
    option_name:string
}


export class LiveSTPColumn{
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No',
      width:'5rem'
    },
    {
      field:'first_client_name',
      header:'Client',
      width:'15rem'
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'23rem'
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
      field:'freq',
      header:'STP Frq',
      width:'7rem'
    },
    {
      field:'reg_no',
      header:'STP Txn No.',
      width:'7rem'
    },
    {
      field:'from_date',
      header:'STP Start Date',
      width:'7rem'
    },
    {
      field:'to_date',
      header:'STP End Date',
      width:'7rem'
    },
    {
      field:'terminate_date',
      header:'Term. Date',
      width:'7rem'
    },
    {
      field:'stp_date',
      header:'STP Date',
      width:'5rem'
    },
    {
      field:'amount',
      header:'Amount',
      width:'6rem'
    },
    {
      field:'remaining_inv',
      header:'Rem. Inst',
      width:'7rem'
    },
    {
      field:'bank_name',
      header:'Bank',
      width:'13rem'
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'5rem'
    }
  ]
}
