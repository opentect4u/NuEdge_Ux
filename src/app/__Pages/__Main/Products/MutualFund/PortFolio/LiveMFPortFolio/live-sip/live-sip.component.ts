import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

  // column:column[] = LiveSIPColumn.column;
  column:column[] = []

  @ViewChild('dt') primaryTbl :Table;

  @Input() sip_type:string;


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
    if(changes.sip_type){
      this.column =  LiveSIPColumn.column.filter((column:column) => column.isVisible.includes(this.sip_type))
    }
  }
}


export interface ILiveSIP{
    first_client_name:string;
    scheme_name:string;
    active_status:string;
    folio_no:string;
    freq:string;
    reg_no:string;
    from_date:Date;
    to_date:Date;
    terminated_date:Date;
    sip_date:Date;
    amount:number;
    remaining_inv:number;
    bank_name:string;
    xirr:number;
    plan_name:string;
    option_name:string
}


export class LiveSIPColumn{
  public static column:column[] = [
    // {
    //   field:'sl_no',
    //   header:'Sl No',
    //   width:'4rem',
    //   isVisible:['A','L','I']
    // },
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
      header:'Status',
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'freq',
      header:'Frq',
      width:'4rem',
      isVisible:['A','L','I']
    },
    {
      field:'reg_no',
      header:'Txn No.',
      width:'6rem',
      isVisible:['A','L','I']
    },
    {
      field:'from_date',
      header:'Start Date',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'to_date',
      header:'End Date',
      width:'7rem',
      isVisible:['A','L','I']
    },
    {
      field:'terminated_date',
      header:'Term. Date',
      width:'7rem',
      isVisible:['A','I']
    },
    {
      field:'sip_date',
      header:'SIP Date',
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
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'bank_name',
      header:'Bank',
      width:'8rem',
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
