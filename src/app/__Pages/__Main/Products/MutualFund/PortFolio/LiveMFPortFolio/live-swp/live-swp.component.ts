import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

  // column:column[] = LiveSWPColumn.column
  column:column[] = []


  @ViewChild('dt') primaryTbl :Table;

  @Input() swp_type:string;


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
    if(changes.swp_type){
      this.column =  LiveSWPColumn.column.filter((column:column) => column.isVisible.includes(this.swp_type))
    }
  }
}


export interface ILiveSWP{
    first_client_name:string;
    scheme_name:string;
    active_status:string;
    folio_no:string;
    freq:string;
    reg_no:string;
    from_date:Date;
    to_date:Date;
    terminated_date:Date;
    swp_date:Date;
    amount:number;
    remaining_inv:number;
    bank_name:string;
    xirr:number;
    plan_name:string;
    option_name:string;
}


export class LiveSWPColumn{
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
      width:'5rem',
      isVisible:['A','L','I']
    },
    {
      field:'from_date',
      header:'Start Date',
      width:'4rem',
      isVisible:['A','L','I']
    },
    {
      field:'to_date',
      header:'End Date',
      width:'4rem',
      isVisible:['A','L','I']
    },
    {
      field:'terminated_date',
      header:'Term. Date',
      width:'4rem',
      isVisible:['A','I']
    },
    {
      field:'swp_date',
      header:'SWP Date',
      width:'4rem',
      isVisible:['A','L','I']
    },
    {
      field:'amount',
      header:'Amount',
      width:'4rem',
      isVisible:['A','L','I']
    },
    {
      field:'remaining_inv',
      header:'Rem. Inst',
      width:'4rem',
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
