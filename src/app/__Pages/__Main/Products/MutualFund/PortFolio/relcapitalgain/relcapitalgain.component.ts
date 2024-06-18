import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import clientType from '../../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { debounceTime, distinctUntilChanged, groupBy, map, mergeMap, pluck, switchMap, tap, toArray } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { Calendar } from 'primeng/calendar';
import { from, of, zip } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'portfolio-relcapitalgain',
  templateUrl: './relcapitalgain.component.html',
  styleUrls: ['./relcapitalgain.component.css']
})
export class RelcapitalgainComponent implements OnInit {

  /**
   * Setting of multiselect dropdown
   */
  settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
    'pan',
    'client_name',
    'Search Family members',
    1
  );

  /*** Holding Either Financial Year Or Between Dates  */
  dateRange;
  /**** End */

  /***
   * Get Client Type from json file
   */
    client_type = clientType

  /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
    __isClientPending: boolean = false;

  /**
   * Holding Client Master Data after search
  */
    __clientMst: client[] = [];

  /**
   * Show / hide search list dropdown after serach input match
  */
    displayMode_forClient: string;

    family_members:client[] = [];

    financial_year:string[] = [];

    max_date :Date = new Date();

    client_dtls:client;

     /**
   *  getAccess of Prime Ng Calendar
   */
  @ViewChild('dateRng') date_range:Calendar;

  /***
   *  Release Capital Gain Form For Filter
  */
  released_capital_gain_form = new FormGroup({
    view_type:new FormControl(''),
    client_name: new FormControl(''),
    // client_id: new FormControl(''),
    asset_type: new FormControl('A'),
    trans_periods: new FormControl(''),
    date_type: new FormControl('F'),
    fin_year: new FormControl(''),
    date_range: new FormControl(''),
    report_type: new FormControl('S'),
    opt1: new FormControl(false),
    opt2: new FormControl(false),
    family_members: new FormControl([]),
    pan_no: new FormControl('')
  })

  relisedCapitalGain = [];

  relised_capital_gain_column = realisedCapitalGainColumn.column

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.released_capital_gain_form.get('client_name').disable();
    this.financial_year = global.getAllFinancialYears();
    this.released_capital_gain_form.get('fin_year').setValue(this.financial_year.length > 0 ? this.financial_year[0] : '');

    console.log(this.relised_capital_gain_column);
  }

  getReleasedCapitalGainLoss = () =>{
    this.dateRange = this.setDateInClientDetailsCard(this.released_capital_gain_form.value.date_type);
      this.relisedCapitalGain = [];
      const dt = Object.assign({},this.released_capital_gain_form.value,
        {
          ...this.released_capital_gain_form.value,
          date_range:this.released_capital_gain_form.value.date_type === 'D' ? global.getActualVal(this.date_range.inputFieldValue) : '',
          fin_year:this.released_capital_gain_form.value.date_type === 'F' ? global.getActualVal(this.released_capital_gain_form.value.fin_year) : ''
        }
      )
      this.dbIntr.api_call(1,'/clients/realisedCapitalGain',this.utility.convertFormData(dt))
      .pipe(pluck('data')).subscribe((res:Required<{data,client_details:client}>) =>{
        // console.log(res.data);
        // this.relisedCapitalGain = res.data;
        this.client_dtls = res.client_details;
        this.dateRange = this.setDateInClientDetailsCard(this.released_capital_gain_form.value.date_type);
        from(res.data)
        .pipe(
          groupBy((data:any) => data.cat_name),
          mergeMap(group => zip(of(group.key), group.pipe(toArray())))
        ).subscribe(dt =>{
          console.log(dt);
          this.relisedCapitalGain.push(
            {
              cat_name:dt[0],
              data:dt[1]
            }
          )
        })
        console.log(this.relisedCapitalGain)

      })
  }


  setDateInClientDetailsCard(date_type:string){
      let date_rng;
      let start_date,end_date;
      if(date_type == 'F'){
          if(this.financial_year[0] == this.released_capital_gain_form.value.fin_year){
            start_date =new Date(Number(this.financial_year[0].split('-')[0]),3,1);
            end_date =new Date();
          }
          else{
            start_date =new Date(Number(this.released_capital_gain_form.value.fin_year.split('-')[0]),0,1);
            end_date =new Date(Number(this.released_capital_gain_form.value.fin_year.split('-')[1]),3,31);
          }
          date_rng = `${this.datePipe.transform(start_date,'longDate')} TO ${this.datePipe.transform(end_date,'longDate')}`
      }
      else{
        start_date = this.datePipe.transform(this.date_range.inputFieldValue.split('-')[0],'longDate');
        end_date = this.datePipe.transform(this.date_range.inputFieldValue.split('-')[1],'longDate');
        date_rng = `${start_date} TO ${end_date}`;
      }
      console.log(date_rng);
      return date_rng;
  }

  /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
    this.released_capital_gain_form.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.released_capital_gain_form.get('pan_no').reset(searchRlt.item.pan);
    this.searchResultVisibilityForClient('none');
    if(this.released_capital_gain_form.value.view_type == 'F'){
      this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
    }
  };

  /**
   *  evnt trigger on search particular client & after select client
   * @param display_mode
   */
  searchResultVisibilityForClient = (display_mode: string) => {
    // console.log(display_mode);
    this.displayMode_forClient = display_mode;
  };

  /**
   *
   */
  getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
    if(id){
      this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.released_capital_gain_form.value.view_type}`)
      .pipe(pluck('data'))
      .subscribe((res:client[]) =>{
       console.log(res);
       this.family_members = res;
       this.released_capital_gain_form.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
      })
   }
   else{
       this.family_members = [];
       this.released_capital_gain_form.get('family_members').setValue([]);

   }
 }

 ngAfterViewInit(){
   /**view_type Change*/
   this.released_capital_gain_form.controls['view_type'].valueChanges.subscribe(res =>{
    if(this.family_members.length > 0){
      this.getFamilymemberAccordingToFamilyHead_Id();
    }
    this.released_capital_gain_form.get('client_name').reset('',{emitEvent:false});
    this.released_capital_gain_form.get('pan_no').reset('');
      if(res){
        this.__clientMst = [];
        this.released_capital_gain_form.get('client_name').enable();
      }
      else{
        this.released_capital_gain_form.get('client_name').disable();
      }
   })
  /**End */

  /** Investor Change */
    this.released_capital_gain_form.controls['client_name'].valueChanges
    .pipe(
      tap(()=> this.released_capital_gain_form.get('pan_no').setValue('')),
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
        dt+'&view_type='+this.released_capital_gain_form.value.view_type
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

  /** Between Date Change Event */
  // this.released_capital_gain_form.controls['date_type'].valueChanges.subscribe(res =>{
  //   console.log(res);
  // })
  /*** End */
 }

}


export class realisedCapitalGainColumn{
      public static column = [
        {
          field:'trans_date',
          header:'Trxn. Date',
          width:'7rem',
          sub_row:[],
          row_span:2
        },
        {
          field:'transaction_type',
          header:'Trxn. Type',
          width:'8rem',
          sub_row:[],
          row_span:2
        },
        {
          field:'pur_dtls',
          header:'Purchase Details',
          col_span:7,
          row_span:1,
          sub_row:[
            {
              field:'tot_amount',
              header:'Purchase / Dividend Reinvestment',
              width:'6rem'
            },
            {
              field:'pur_price',
              header:'Pur. NAV',
              width:'3rem'
            },
            {
              field:'tot_units',
              header:'Units',
              width:'2rem'
            },
            {
              field:'pur_before',
              header:'Equity Purchase Before 31-01-18',
              width:'5rem'
            },
            {
              field:'nav_as_on_31_01_2018',
              header:'NAV as on 31-01-18',
              width:'5rem'
            },
            {
              field:'amount_as_on_31_01_2018',
              header:'Value as on 31-01-18',
              width:'4rem'
            },
            {
              field:'debt_31_03_2023',
              header:'Debt Purchase Before 31-03-23',
              width:'5rem'
            },
          ]
        },
        {
          field:'sell_dtls',
          header:'Sell Details',
          col_span:7,
          // width:'40rem',
          row_span:1,
          sub_row:[
            {
              field:'sell_type',
              header:'Sell Type',
              width:'6rem'
            },
            {
              field:'sell_date',
              header:'Sell Date',
              width:'3rem'
            },
            {
              field:'sell_nav',
              header:'Sell NAV',
              width:'3rem'
            },
            {
              field:'redemp_amount',
              header:'Redemption Amount',
              width:'5rem'
            },
            {
              field:'tot_tds',
              header:'TDS',
              width:'2rem'
            },
            {
              field:'stt',
              header:'STT',
              width:'2rem'
            },
            {
              field:'net_sell_proceed',
              header:'Net Sell Proced',
              width:'4rem'
            }
          ]
        },
        {
          field:'gain_loss_related',
          header:'Gain Loss Related',
          // width:'27rem',
          col_span:5,
          row_span:1,
          sub_row:[
            {
              field:'div_amount',
              header:'Devidend Amount',
              width:'3rem'
            },
            {
              field:'days',
              header:'Days',
              width:'3rem'
            },
            {
              field:'stcg',
              header:'STCG',
              width:'3rem'
            },
            {
              field:'ltcg',
              header:'LTCG',
              width:'3rem'
            },
            {
              field:'index_ltcg',
              header:'INDEX LTCG',
              width:'3rem'
            },
          ]
        }
      ]
}



