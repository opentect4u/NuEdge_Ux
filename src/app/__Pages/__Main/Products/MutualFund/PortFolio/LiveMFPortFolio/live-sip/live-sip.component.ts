import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'portfolio-live-sip',
  templateUrl: './live-sip.component.html',
  styleUrls: ['./live-sip.component.css']
})
export class LiveSIPComponent implements OnInit {

  // @Input() liveSIP:Partial<ILiveSIP>[] = [];

  private _liveSIP:Partial<ILiveSIP>[] = [];

  @Input()
  public get liveSIP():Partial<ILiveSIP>[]{
   return this._liveSIP;
  }

  public set liveSIP(liveSip:Partial<ILiveSIP>[]){
    this._liveSIP = liveSip;
    this.totalAmt = global.Total__Count(liveSip,(item:ILiveSIP) => Number(item.amount));
  }

  // column:column[] = LiveSIPColumn.column;
  column:column[] = []

  @Input() selected_sip_type:string;

  @ViewChild('dt') primaryTbl :Table;

  @Input() sip_type:string;

  totalAmt:number = 0.00;

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
      this.column =  LiveSIPColumn.column.filter((column:column) => column.isVisible.includes(this.sip_type));
    }
    // this.totalAmt = global.Total__Count(changes.liveSIP.currentValue,(item:ILiveSIP) => Number(item.amount));
  }
}


export interface ILiveSIP{
    first_client_name:string;
    scheme_name:string;
    activate_status:string;
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
    option_name:string;
    folio_data:any;
    curr_val:string;
    nav_date:string;
    duration:string;
}


export class LiveSIPColumn{
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
      field:'sip_date',
      header:'SIP Date',
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
      field:'duration',
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
