import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'portfolio-live-swp',
  templateUrl: './live-swp.component.html',
  styleUrls: ['./live-swp.component.css']
})
export class LiveSWPComponent implements OnInit {

  @Input() liveSWP:Partial<ILiveSWP>[] = []

  column:column[] = LiveSWPColumn.column

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


export interface ILiveSWP{
    client_name:string;
    scheme_name:string;
    active_status:string;
    folio_no:string;
    swp_freq:string;
    swp_trxn_no:string;
    swp_start_date:Date;
    swp_end_date:Date;
    terminate_date:Date;
    swp_date:Date;
    swp_amount:number;
    remaining_inv:number;
    bank_name:string;
    xirr:number;
    plan_name:string;
    option_name:string;
}


export class LiveSWPColumn{
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
      field:'swp_freq',
      header:'SWP Frq',
      width:'7rem'
    },
    {
      field:'swp_trxn_no',
      header:'SWP Txn No.',
      width:'8rem'
    },
    {
      field:'swp_start_date',
      header:'SWP Start Date',
      width:'10rem'
    },
    {
      field:'swp_end_date',
      header:'SWP End Date',
      width:'10rem'
    },
    {
      field:'terminate_date',
      header:'Termination Date',
      width:'10rem'
    },
    {
      field:'swp_date',
      header:'SWP Date',
      width:'10rem'
    },
    {
      field:'swp_amount',
      header:'SWP Amount',
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
