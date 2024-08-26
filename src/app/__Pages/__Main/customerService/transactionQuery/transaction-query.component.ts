import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import clientType from '../../../../../assets/json/view_type.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { client } from 'src/app/__Model/__clientMst';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
import { IDisclaimer, ILivePortFolio, ISubDataSource, LiveMFPortFolioColumn, TotalparentLiveMfPortFolio, TotalsubLiveMFPortFolio } from '../../Products/MutualFund/PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
@Component({
  selector: 'app-transaction-query',
  templateUrl: './transaction-query.component.html',
  styleUrls: ['./transaction-query.component.css']
})
export class TransactionQueryComponent implements OnInit {

  trans_query_form = new FormGroup({
      view_type:new FormControl(''),
      client_name:new FormControl(''),
      pan_no:new FormControl(''),
      folio_no:new FormControl(''),
      family_members: new FormControl([])

  });

  disclaimer:Partial<IDisclaimer>;

  @ViewChild('primeTbl') primeTbl :Table;

  subLiveMfPortFolio: Partial<TotalsubLiveMFPortFolio>;

  parentLiveMfPortFolio: Partial<TotalparentLiveMfPortFolio>;

  truncated_val : number = 10;


  transaction_query_dataSource = [];

   /**
   * Column For Parent Table
   */
   parent_column:column[] = [...LiveMFPortFolioColumn.column,{
    field:'action',
    header:'Action',
    width:'5rem'
   }];

  /**
   * Column For Sub Table
  */
  child_column:column[] = LiveMFPortFolioColumn.sub_column;

  /**
   * Hold column for transaction table
   */

  /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
  __isClientPending: boolean = false;

  /**
  * Show / hide search list dropdown after serach input match
  */
  displayMode_forClient: string;

  /**
   * Holding Client Master Data after search
   */
  __clientMst: client[] = [];

  /**
   * Setting of multiselect dropdown
   */
  settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
    'pan',
    'client_name',
    'Search Family members',
    1
  );

  family_members:client[] = [];

  client_type= clientType;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.trans_query_form.get('client_name').disable();
  }

  ngAfterViewInit(){
    /** Investor Change */
    this.trans_query_form.controls['client_name'].valueChanges
    .pipe(
      tap(()=> this.trans_query_form.get('pan_no').setValue('')),
      tap(() => {
        this.__isClientPending = true
        if(this.family_members.length > 0){
          this.getFamilymemberAccordingToFamilyHead_Id();
        }
      }),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
        dt+'&view_type='+this.trans_query_form.value.view_type
        ) : []

      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        // console.log(value);
        this.__clientMst = value;
        this.searchResultVisibilityForClient('block');
        this.__isClientPending = false;
      },
      complete: () => {},
      error: (err) => {
        this.__isClientPending = false;
      },
    });
    /** End */

    /**view_type Change*/
    this.trans_query_form.controls['view_type'].valueChanges.subscribe(res =>{
      this.trans_query_form.get('client_name').reset('',{emitEvent:false});
      this.trans_query_form.get('pan_no').reset('');
      // this.trans_query_form.get('select_all_client').setValue(false,{emitEvent:false});
        if(res){
          // this.paginate = 1;
          this.__clientMst = [];
          this.trans_query_form.get('client_name').enable();
          // this.trans_query_form.get('select_all_client').enable();
          // this.getClientMst(res,this.paginate);
        }
        else{
          this.trans_query_form.get('client_name').disable();
          // this.trans_query_form.get('select_all_client').disable();
        }
  })
  /**End */
  }

  searchTrxnReport = () =>{
      this.transaction_query_dataSource = [];

      this.dbIntr.api_call(1,'/clients/doNotShowFolio',
        this.utility.convertFormData({folio_no:this.trans_query_form.value.folio_no}))
      .pipe(
        pluck('data')
      )
      .subscribe((res:Required<{data,client_details,disclaimer:Partial<IDisclaimer>}>) => {
        console.log(res);
            try{
              this.disclaimer = res.disclaimer;
              let modify_dt = [];
              modify_dt = res.data.filter((item: ILivePortFolio,index:number) => {
                if(Number(item.curr_val) > 0 ){
                  item.id = `${Math.random()}_${item.product_code}`;
                  item.data=[];
                  if(item.mydata){
                    const amt = item?.mydata.all_amt_arr.map(item => Number(item));
                    const dt = item?.mydata.all_date_arr;
                    const xirr = global.XIRR([...amt,item.curr_val],[...dt,item.nav_date],0)
                    console.log(xirr)
                    item.xirr = (item.curr_val == 0 && isFinite(xirr)) ? 0 : xirr
                  }
                  else{
                    item.xirr =0
                  }
                  item.custom_trans_type = item.transaction_type.toLowerCase().includes('sip') ? '(SIP)' : '';
                  item.gain_loss =  item.gain_loss;
                  item.idcw_reinv =  item.idcw_reinv ;
                  item.idcwp =  item.idcwp ;
                  item.curr_val =  item.curr_val;
                  item.inv_cost =  item.inv_cost;
                  item.ret_abs =  item.ret_abs;
                  item.tot_units =  item.tot_units;
                  return true
                }
                return false
              });

              this.transaction_query_dataSource = modify_dt.filter((el,index) =>{
                let dt = [];
                dt = el.mydata.cal_purchase_data 
                el.data = dt.filter((item:ISubDataSource,i:number) =>{
                  try{
                    if(item.cumml_units > 0 && !item.transaction_type.toLowerCase().includes('redemption')){
                          const amt = [(Number(item.tot_amount) * -1),Number(item.curr_val)]
                          const dates = [item.trans_date,el.nav_date]
                          const xirr = global.XIRR(amt,dates,0);
                          item.xirr = isFinite(xirr) ? xirr : 0;
                    }
                  }
                  catch(err){
                      item.xirr = 0;
                  }
                  return item;
                });
                return el
              })
              // this.setParentTableFooter_ClientDtls(modify_dt)
            }
            catch(err){
              console.log(err)
            }
      })
  } 


  /**
   *  evnt trigger on search particular client & after select client
   * @param display_mode
   */
  searchResultVisibilityForClient = (display_mode: string) => {
    // console.log(display_mode);
    this.displayMode_forClient = display_mode;
  };

   /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
   getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
    this.trans_query_form.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.trans_query_form.get('pan_no').reset(searchRlt.item.pan);
    this.searchResultVisibilityForClient('none');
    if(this.trans_query_form.value.view_type == 'F'){
      this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
    }
  };

  /**
   *
   */
  getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
    if(id){
      this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.trans_query_form.value.view_type}`)
      .pipe(pluck('data'))
      .subscribe((res:client[]) =>{
       console.log(res);
       this.family_members = res;
       this.trans_query_form.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
      })
   }
   else{
       this.family_members = [];
       this.trans_query_form.get('family_members').setValue([]);

   }
 }

 getRowDtls =(row) =>{

    console.log(row);
    const pay_load = {
      rnt_id:row.rnt_id,
      folio_no:row.folio_no,
      product_code:row.product_code,
      isin_no:row.isin_no,
      portfolio_show_flag:row.portfolio_show_flag,
    }
    this.dbIntr.api_call(1,'/clients/doNotShowFolioLock',
      this.utility.convertFormData(pay_load)
    ).subscribe(res =>{
      this.transaction_query_dataSource = this.transaction_query_dataSource.filter(el =>{
        if(el.id == row.id){
           el.portfolio_show_flag = row.portfolio_show_flag == 'Y' ? 'N' : 'Y'
        }
        return el
    });
    this.utility.showSnackbar(`Tranaction ${row.portfolio_show_flag == 'N' ? 'lock' : 'unlock'} successfully`,1)
    })
 }

 setParentTableFooter_ClientDtls(arr:ILivePortFolio[]){
  if(arr.length > 0){
    let total_amt = [];
    let total_date = [];
    const current_value:number = global.Total__Count(arr,x => Number(x.curr_val))
      arr.forEach((element,index) =>{
        if(element?.mydata.all_amt_arr.length > 0 && element?.mydata.all_date_arr.length > 0){
          total_amt = [...total_amt,...element?.mydata.all_amt_arr.map(item => Number(item))];
          total_date = [...total_date,...element?.mydata.all_date_arr];
        }
      })
      total_amt.push(current_value);
      total_date.push(this.datePipe.transform(new Date(),'YYYY-MM-dd'));
    
   
    this.parentLiveMfPortFolio = {
     inv_cost: global.Total__Count(arr,x => Number(x.inv_cost)),
     pur_nav:(global.Total__Count(arr,x => Number(x.pur_nav)) / arr.length),
     tot_units: global.Total__Count(arr,x => Number(x.tot_units)),
     curr_val:current_value,
     idcw_reinv:global.Total__Count(arr,x => Number(x.idcw_reinv)),
     idcwp:global.Total__Count(arr,x => Number(x.idcwp)),
     total:current_value,
     ret_abs: (global.Total__Count(arr,x => Number(x.ret_abs)) / arr.length),
     gain_loss:global.Total__Count(arr,x =>  Number(x.gain_loss)),
     xirr:global.XIRR(total_amt,total_date,0) 
    }

  }
}

onRowExpand = (ev:{originalEvent:Partial<PointerEvent>,data:ILivePortFolio}) =>{
  try{
      this.subLiveMfPortFolio = null;
      this.truncated_val = 0;
      const index = this.transaction_query_dataSource.map(item => item.id).indexOf(ev?.data.id);
      this.calculat_Total_Value_For_Table_Footer(this.transaction_query_dataSource[index].data,this.transaction_query_dataSource[index])
    }
  catch(ex){
  }
}


 calculat_Total_Value_For_Table_Footer(arr:Partial<ISubDataSource>[],final_arr){
  var tot_arr = arr.filter(row => (!row.transaction_type.toLowerCase().includes('redemption') && row.cumml_units > 0));
  try{
          this.subLiveMfPortFolio = {
            // tot_amount: final_arr ? final_arr?.inv_cost : 0,
            tot_amount: global.Total__Count(tot_arr,item => Number(item.tot_amount)),
            tot_tds:global.Total__Count(tot_arr,item => Number(item.tot_tds)),
            tot_stamp_duty:global.Total__Count(tot_arr,item => item.tot_stamp_duty ? Number(item.tot_stamp_duty) : 0),
            pur_price:global.Total__Count(tot_arr,item => Number(item.pur_price)) / tot_arr.length,
            // pur_price:final_arr ? final_arr?.pur_nav : 0,
            tot_units:final_arr ? final_arr?.tot_units : 0,
            curr_val:final_arr ? final_arr?.curr_val : 0,
            gain_loss:final_arr ? final_arr?.gain_loss : 0,
            ret_abs: final_arr ? final_arr?.ret_abs : 0,
            cumml_units:tot_arr.length > 0 ? tot_arr.slice(-1)[0].cumml_units : 0,
            xirr:final_arr ? final_arr?.xirr : 0,
            gross_amount: global.Total__Count(tot_arr,item => Number(item.gross_amount)),
          }

          // console.log(this.subLiveMfPortFolio)
  }
  catch(ex){
  }
}

 loadInvestorOnScrollToEnd = (ev) =>{
  // if(this.misTrxnRpt.value.client_name == ''){
  //   this.paginate+=1;
  // this.getClientMst(this.misTrxnRpt.value.view_type,this.paginate);
  // }
 }

 getColumnsForDetails = () =>{
  return [...this.utility.getColumns(this.parent_column),'isin_no','folio_no','custom_trans_type'];
}


filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}

}

