import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ILivePortFolio, ISubDataSource, LiveMFPortFolioColumn, TotalparentLiveMfPortFolio, TotalsubLiveMFPortFolio } from '../live-mf-port-folio.component';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Table } from 'primeng/table';
import { pluck } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'mf-reportwise-poretfolio',
  templateUrl: './mf-reportwise-poretfolio.component.html',
  styleUrls: ['./mf-reportwise-poretfolio.component.css']
})
export class MfReportwisePoretfolioComponent implements OnInit {

  constructor(private utility:UtiliService,private spinner:NgxSpinnerService,private dbIntr:DbIntrService,private datePipe:DatePipe) { }

  __selectedRow:Partial<ILivePortFolio>;

  subLiveMfPortFolio: Partial<TotalsubLiveMFPortFolio>;

  @Output() openModal:EventEmitter<ILivePortFolio> = new EventEmitter()

  truncated_val : number = 10;

  @ViewChild('primeTble') primeTble:Table;

  @Input() report:Partial<IMfReport>[] = []

  @Input() main_frm_dt;

  @Input() parent_column:column[] = [];

  @Input() child_column:column[] = [];

  @Input() column_chooser:Partial< {
        id: number;
        name: string;
        flag: string;
    }>[] = [];

  @Input() parentLiveMfPortFolio:Partial<TotalparentLiveMfPortFolio>;


  ngOnInit(): void {
  }
  /**
   * 
   * @param ev This function is triggered when a row in the table is expanded.
   * It retrieves the data associated with the expanded row and updates the selected row.
   * It also sets the truncated value to 0 and clears the data in the report for the expanded row.
   * @param j - The index of the report in the report array.
   * @description This function is used to handle the expansion of a row in the table.
   * It fetches additional data for the expanded row and updates the report with the new data.
   * It also sets the columns for the child table based on the provided column configuration.
   * @returns {void}
   */
  onRowExpand = (ev:{originalEvent:Partial<PointerEvent>,data:ILivePortFolio},j) =>{
    try{
      this.subLiveMfPortFolio = null;
    this.__selectedRow = ev?.data;
    this.truncated_val = 0;
    const index = this.report[j].report.map(item => item.id).indexOf(ev?.data.id);
    this.report[j].report[index].data.length = 0;
    this.child_column = this.setcolumns(LiveMFPortFolioColumn.sub_column);
      this.dbIntr.api_call(
        0,
        '/clients/liveMFShowDetails',
        `rnt_id=${ev.data.rnt_id}&product_code=${ev.data.product_code}&isin_no=${ev.data.isin_no}&folio_no=${ev.data.folio_no}&nav_date=${ev.data.nav_date}&valuation_as_on=${global.getActualVal(this.datePipe.transform(new Date(this.main_frm_dt?.valuation_as_on),'YYYY-MM-dd'))}&trans_type=${this.main_frm_dt?.trans_type}`)
      .pipe(
        pluck('data')
        )
      .subscribe((res: ISubDataSource[]) =>{
        this.report[j].report[index].data = res.filter((item:ISubDataSource,i:number) =>{
                    try{
                      if(item.cumml_units > 0 && !item.transaction_type.toLowerCase().includes('redemption')){
                            const amt = [(Number(item.tot_amount) * -1),Number(item.curr_val)]
                            const dates = [item.trans_date,this.report[j].report[index].nav_date]
                            const xirr = global.XIRR(amt,dates,0);
                            item.xirr = isFinite(xirr) ? xirr : 0;
                      }
                    }
                    catch(err){
                        item.xirr = 0;
                    }
                    return item;
              });
              this.calculat_Total_Value_For_Table_Footer(res,this.report[j].report[index])
              this.show_more('M',j,index);
            /**** End */
        })
      }
    catch(ex){
    }
  }

  /**
   * @description This function calculates the total values for the table footer.
   * It filters the input array to include only rows that do not have a transaction type containing
   */
  calculat_Total_Value_For_Table_Footer(arr:Partial<ISubDataSource>[],final_arr){
    var tot_arr = arr.filter(row => (!row.transaction_type.toLowerCase().includes('redemption') && row.cumml_units > 0));
    try{
            this.subLiveMfPortFolio = {
              // tot_amount: final_arr ? final_arr?.inv_cost : 0,
              tot_amount: global.Total__Count(tot_arr,item => Number(item.tot_amount)),
              tot_tds:global.Total__Count(tot_arr,item => Number(item.tot_tds)),
              tot_stamp_duty:global.Total__Count(tot_arr,item => item.tot_stamp_duty ? Number(item.tot_stamp_duty) : 0),
              pur_price:global.Total__Count(tot_arr,item => Number(item.pur_price)) / tot_arr.length,
              tot_units:final_arr ? final_arr?.tot_units : 0,
              curr_val:final_arr ? final_arr?.curr_val : 0,
              gain_loss:final_arr ? final_arr?.gain_loss : 0,
              ret_abs: final_arr ? final_arr?.ret_abs : 0,
              cumml_units:tot_arr.length > 0 ? tot_arr.slice(-1)[0].cumml_units : 0,
              xirr:final_arr ? final_arr?.xirr : 0,
              gross_amount: global.Total__Count(tot_arr,item => Number(item.tot_gross_amount)),
            }
    }
    catch(ex){
    }
}
  
  /**
   * @description This function is used to show more data in the table.
   * It takes a mode, outer_index, and index as parameters.
   */
  show_more = (mode:string,outer_index:number,index:number) =>{
    this.spinner.show()
      if(mode == 'A'){
            this.setTrancated_val(this.report[outer_index].report[index].data.length)
      }
      else{
          const dt = this.truncated_val + 10;
         if(dt >= this.report[outer_index].report[index].data.length){
            this.setTrancated_val(this.report[outer_index].report[index].data.length)
         }
         else{
            this.truncated_val+=10
         }
      }
    this.spinner.hide();
}
/*
  * @description This function is used to set the columns for the table.
  * It filters the input column array based on the visibility flag and the main form data.
  * @param column_to_be_set_on_tble - An array of columns to be set on the table.
  * @returns An array of columns that are visible based on the current column chooser and main form data.
  */
setcolumns = (column_to_be_set_on_tble:column[]) =>{
  const act_column =this.column_chooser.map(column => column.flag);
  const act_column_to_be_set = this.main_frm_dt?.clmn_chooser.map(column => column.flag);
  const dt  = column_to_be_set_on_tble.filter((clmn:column)=>{
          if(act_column.findIndex(item => item === clmn.field) == -1){
            clmn.isVisible = true;
          }
          else{
            clmn.isVisible = act_column_to_be_set.findIndex(item => item === clmn.field) !=  -1
          }
          return clmn.isVisible ? clmn : false;
  });
  return dt;
}
/**
 * * @description This function sets the truncated value for the table.
 * It takes the length of the actual array as a parameter and updates the truncated value.
 */
setTrancated_val = (length_of_actual_array:number) => {
  this.truncated_val = length_of_actual_array
}
  /**
   * * @description This function is triggered when a row in the table is clicked.
   * It emits the details of the clicked transaction to the parent component.
   * @param
   */
  OpenDialog(trans_dtls){
    // console.log(trans_dtls)
    this.openModal.emit(trans_dtls);
  }
  /**
   * @description This function is used to get the columns for the details table.
   * It returns an array of columns that includes the parent column and additional columns for details.
   * @returns {Array} An array of columns formatted for the details table.
   * @description This function is used to get the columns for the details table.
   * It uses the utility service to get the columns based on the input parent column array.
   */
  getColumnsForDetails = () =>{
    return [...this.utility.getColumns(this.parent_column),
      'group_by','report.folio_no','report.plan_name',
      'report.option_name','report.isin_no'
    ];
  }
  /**
   * * @description This function filters the global search input for the table.
   * It takes the event object as a parameter and retrieves the value from the input field.
   */
  filterGlobal($event){
    let value = $event.target.value;
    this.primeTble.filterGlobal(value,'contains')
}
}

export interface IMfReport{
   total:Partial<TotalparentLiveMfPortFolio>;
   group_by:string,
   report:Partial<ILivePortFolio>[]
}
