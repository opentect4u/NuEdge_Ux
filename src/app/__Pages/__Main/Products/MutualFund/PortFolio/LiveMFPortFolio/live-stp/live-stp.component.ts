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

  totalAmt:number = 0;

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
    this.totalAmt = this.Total__Count(changes.liveSTP.currentValue,(item:ILiveSTP) => Number(item.amount));
  }
  Total__Count<T>(arr: T[], predicate: (elem: T, idx: number) => number) {
    return arr.reduce((prev, curr, idx) => prev + (predicate(curr, idx)), 0)
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
    option_name:string;
    folio_data:any;
    curr_val:string;
    amount:number;
    nav_date:string;
    duration:string;
}

export class LiveSTPColumn{
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No',
      width:'3rem',
      isVisible:['A','L','I']
    },
    {
      field:'first_client_name',
      header:'Client',
      width:'9rem',
      isVisible:['A','L','I']
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'25rem',
      isVisible:['A','L','I']
    },
    {
      field:'activate_status',
      header:'Status',
      width:'4rem',
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
      header:'Freq',
      width:'4rem',
      isVisible:['A','L','I']
    },
    {
      field:'reg_no',
      header:'Reg No.',
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'from_date',
      header:'Start Date',
      width:'6rem',
      isVisible:['A','L','I']
    },
    {
      field:'to_date',
      header:'End Date',
      width:'6rem',
      isVisible:['A','L','I']
    },
    {
      field:'terminated_date',
      header:'Term. Date',
      width:'6rem',
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
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'rem_inst',
      header:'Rem. Inst',
      width:'3rem',
      isVisible:['A','L']
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
      width:'4rem',
      isVisible:['A','L']
    }
  ]
}
