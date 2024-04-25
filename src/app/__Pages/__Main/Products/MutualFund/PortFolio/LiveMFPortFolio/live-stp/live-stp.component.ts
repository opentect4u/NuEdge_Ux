import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

  // column:column[] = LiveSTPColumn.column
  column:column[] = [];


  @ViewChild('dt') primaryTbl :Table;

  @Input() stp_type:string;


  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes.stp_type){
      this.column =  LiveSTPColumn.column.filter((column:column) => column.isVisible.includes(this.stp_type))
    }
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
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'first_client_name',
      header:'Client',
      width:'15rem',
      isVisible:['A','L','I']
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'23rem',
      isVisible:['A','L','I']
    },
    {
      field:'activate_status',
      header:'Active Status',
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'8rem',
      isVisible:['A','L','I']
    },
    {
      field:'freq',
      header:'STP Frq',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'reg_no',
      header:'STP Txn No.',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'from_date',
      header:'STP Start Date',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'to_date',
      header:'STP End Date',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'terminate_date',
      header:'Term. Date',
      width:'7rem',
      isVisible:['A','I']
    },
    {
      field:'stp_date',
      header:'STP Date',
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'amount',
      header:'Amount',
      width:'6rem',
      isVisible:['A','L','I']
    },
    {
      field:'remaining_inv',
      header:'Rem. Inst',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'bank_name',
      header:'Bank',
      width:'13rem',
      isVisible:['A','L','I']
    },
    {
      field:'xirr',
      header:'XIRR',
      width:'5rem',
      isVisible:['A','L','I']
    }
  ]
}
