import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import clientType from '../../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { debounceTime, distinctUntilChanged, filter, groupBy, map, mergeMap, pluck, switchMap, tap, toArray } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { Calendar } from 'primeng/calendar';
import { from, of, zip } from 'rxjs';
import { DatePipe, KeyValue } from '@angular/common';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import Tabs from '../../../../../../../assets/json/Product/Portfolio/realisedCapitalGain/tab.json';
import moment from 'moment';

@Component({
  selector: 'portfolio-relcapitalgain',
  templateUrl: './relcapitalgain.component.html',
  styleUrls: ['./relcapitalgain.component.css']
})
export class RelcapitalgainComponent implements OnInit {

  @ViewChild('relise_capital_gain_summary') primaryTbl: Table;
  keepOrder = 
  (x: KeyValue<string, any>, y: KeyValue<string, any>): number => { 
  return 0 
  }

  total_financial_wise_report;

  objectKeys = Object.keys;

  financial_year_wise_detail_report = [];

  realisedcapital_gain_tab:Required<{id:number,tab_name:string,sub_menu:any,img_src:string,flag:string}>[] = []

  realised_capital_gain_sub_tab:Required<{id:number,tab_name:string,sub_menu:any,img_src:string,flag:string}>[] = []
  
  parent_tab_id:string = 'R';

  selected_index:number = 0;

  selected_parent_index:number = 0;

  sub_tab_id:string;
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

  family_members: client[] = [];

  financial_year: string[] = [];

  max_date: Date = new Date();

  client_dtls: client;

  /**
*  getAccess of Prime Ng Calendar
*/
  @ViewChild('dateRng') date_range: Calendar;

  /***
   *  Release Capital Gain Form For Filter
  */
  released_capital_gain_form = new FormGroup({
    view_type: new FormControl(''),
    client_name: new FormControl(''),
    // client_id: new FormControl(''),
    asset_type: new FormControl('Equity Fund / Debt Fund / Debt Oriented Hybrid Fund'),
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

  main_frm_dt;

  relisedCapitalGain = [];

  idcw_summary = [];

  total_idcw_summary;

  financial_year_wise_trans_report = [];

  relised_capital_gain_column = realisedCapitalGainColumn.column

  relised_capital_gain_summary_column = realisedCapitalGainColumn.column_summary;

  idcw_column:column[] = DividendColumn.column;

  relised_capital_gain_summary: Partial<ISummaryTbleData>[] = []

  relised_capital_gain_summary_footer: Partial<IsummaryReport>;

  relised_capital_gain_as_per_ITD_OverAll_Summary = [];

  relised_capital_gain_as_per_ITD_column: column[] = realisedCapitalGainColumn.column_As_Per_ITD;


  constructor(private dbIntr: DbIntrService, private utility: UtiliService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.released_capital_gain_form.get('client_name').disable();
    this.financial_year = global.getAllFinancialYears();
    this.released_capital_gain_form.get('fin_year').setValue(this.financial_year.length > 0 ? this.financial_year[0] : '');
  }

  getReleasedCapitalGainLoss = () => {
    this.selected_index = 0;
    this.selected_parent_index = 0;
    this.parent_tab_id = 'R';
    this.sub_tab_id ='';
    this.idcw_summary = [];
    this.total_idcw_summary = null;
    // this.realisedcapital_gain_tab = [];
    // this.realised_capital_gain_sub_tab = [];
    this.financial_year_wise_trans_report = [];
    this.relisedCapitalGain = [];
    this.relised_capital_gain_summary = [];
    this.client_dtls = null
    this.relised_capital_gain_summary_footer = null;
    this.realisedcapital_gain_tab = Tabs.filter(el =>{
        if(el.flag == 'F'){
          return this.released_capital_gain_form.value.opt1
        }
        else if(el.flag == 'D'){
          return this.released_capital_gain_form.value.opt2
        }
        return true;
    })
    const { asset_type, ...rest } = this.released_capital_gain_form.value
    this.main_frm_dt = null;
    const dt = Object.assign({}, rest,
      {
        ...rest,
        date_range: this.released_capital_gain_form.value.date_type === 'D' ? global.getActualVal(this.date_range.inputFieldValue) : '',
        fin_year: this.released_capital_gain_form.value.date_type === 'F' ? global.getActualVal(this.released_capital_gain_form.value.fin_year) : ''
      }
    )
    this.main_frm_dt = dt;
    this.realisedCapitalGain(dt)
    
  }


  /** For Getting Realised capital Gain */
  realisedCapitalGain = (rest) =>{
    if( this.relised_capital_gain_summary.length == 0 && this.relisedCapitalGain.length == 0){
      this.dbIntr.api_call(1, '/clients/realisedCapitalGain', this.utility.convertFormData(rest))
      .pipe(pluck('data')).subscribe((res: Required<{ data, client_details: client }>) => {
          this.client_dtls = Object.assign(res.client_details,
            {
              ...res.client_details,
              add_line_1: [res.client_details.add_line_1, res.client_details.add_line_2, res.client_details.add_line_3, res.client_details.city_name, res.client_details.state_name, res.client_details.district_name, res.client_details.pincode].filter(item => { return item }).toString()
            }
          );
          this.dateRange = this.setDateInClientDetailsCard(this.released_capital_gain_form.value.date_type);
          if(this.main_frm_dt?.report_type != 'A'){
          let filter_data_by_asset_type = res.data.filter(item => this.released_capital_gain_form.value.asset_type.includes(item.tax_type));
          this.relised_capital_gain_summary = [];
          from(filter_data_by_asset_type.filter(item => this.released_capital_gain_form.value.asset_type.includes(item.tax_type)))
            .pipe(
              groupBy((data: any) => data.tax_type),
              mergeMap(group => zip(of(group.key), group.pipe(toArray())))
            ).subscribe(dt => {
              console.log(dt);
              let summary_data: Partial<IsummaryReport>[] = [];
              let final_realised_capital_gain = dt[1].filter(element => {
                if (this.released_capital_gain_form.value.trans_periods != '') {
                  if (this.released_capital_gain_form.value.trans_periods == 'S') {
                    element.calculation_arr = element.calculation_arr.filter(item => item.stcg != '')
                  }
                  else {
                    element.calculation_arr = element.calculation_arr.filter(item => item.ltcg != '')
                  }
                }
                if (element.calculation_arr.length > 0) {

                  element.total = this.getGrandTotal(element.calculation_arr);
                  /*** Calaculation For Summary Table */
                  const long_term_gain = element.total?.index_ltcg > 0 ? element.total?.index_ltcg : 0;
                  const long_term_loss = element.total?.index_ltcg < 0 ? element.total?.index_ltcg : 0;
                  const net_long_term_gain_loss = (long_term_gain + long_term_loss);
                  const short_term_gain = element.total?.stcg > 0 ? element.total?.stcg : 0;
                  const short_term_loss = element.total?.stcg < 0 ? element.total?.stcg : 0;
                  const net_short_term_gain_loss = (short_term_gain + short_term_loss)
                  summary_data.push({
                    id: new Date().getTime(),
                    folio: element.folio_no,
                    isin_no:element.isin_no,
                    scheme_name: `${element.scheme_name}-${element.plan_name}-${element.option_name}`,
                    short_term_gain: short_term_gain,
                    short_term_loss: short_term_loss,
                    long_term_gain: long_term_gain,
                    long_term_loss: long_term_loss,
                    net_long_term_gain_loss: net_long_term_gain_loss,
                    net_short_term_gain_loss: net_short_term_gain_loss,
                    stt: element?.total.stt,
                    tds: element?.total.tot_tds,
                    total_gain_loss: (net_long_term_gain_loss + net_short_term_gain_loss)
                  })
                  /**** End */
                  return element
                }
                return false
              })
              /*** For Summary Table Data */
              this.relised_capital_gain_summary.push({
                tax_type: dt[0],
                summary: summary_data,
                total: this.getGrandSummaryTotal(summary_data)
              })
              /*** End */

              /**** For Details Report */
              if (rest.report_type === 'D') {
                // if(!final_realised_capital_gain.every(el => el.calculation_arr.length == 0)){
                this.relisedCapitalGain.push(
                  {
                    tax_type: dt[0],
                    data: final_realised_capital_gain,
                    total: this.getGrandTotal(final_realised_capital_gain.map(el => el.total))
                  }
                );
                // }
              }
              /**** End */
            })
            if (this.relisedCapitalGain.length == 0 && this.relised_capital_gain_summary.length == 0) {
                // this.utility.showSnackbar('No Records Found!!', 0)
            }
            else {
                this.relised_capital_gain_summary_footer = {
                  short_term_gain:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.short_term_gain),
                  short_term_loss:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.short_term_loss),
                  long_term_gain:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.long_term_gain),
                  long_term_loss:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.long_term_loss),
                  net_long_term_gain_loss:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.net_long_term_gain_loss),
                  net_short_term_gain_loss:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.net_short_term_gain_loss),
                  total_gain_loss:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.total_gain_loss),
                  tds:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.tds),
                  stt:global.Total__Count(this.relised_capital_gain_summary,(item:Partial<ISummaryTbleData>) => item.total.stt)
                }
            }
          } 
          else{
            // console.log(res.data)
            this.populateAsPerITD(res.data);
          }

      })
    }
  }
  /** End */

  populateAsPerITD = (res) =>{
    console.log(res)
    let as_per_itd = [
      {
        fund_type:'Equity Fund',
        fund_dtls:[
            {
            title:"Short Term Capital Gain",
            data:[
              {
                title: "Full Value Of Consideration",
                "01/04_15/06":0.00,
                "16/06_15/09":0.00,
                "16/09_15/12":0.00,
                "16/12_15/03":0.00,
                "16/03_31/03":0.00
              },{
                title: "Cost of acquisition",
                "01/04_15/06":0.00,
                "16/06_15/09":0.00,
                "16/09_15/12":0.00,
                "16/12_15/03":0.00,
                "16/03_31/03":0.00
              },{
                title: "Capital Gain / Loss",
                "01/04_15/06":0.00,
                "16/06_15/09":0.00,
                "16/09_15/12":0.00,
                "16/12_15/03":0.00,
                "16/03_31/03":0.00
              }
            ]
            },
            {
              title:"Long Term Capital Gain with indexation",
              data:[
                {
                  title: "Fair Market Value of capital asset",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },
                {
                  title: "Full Value Of Consideration",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Cost of acquisition",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Capital Gain / Loss",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                }
              ]
            },
            {
              title:"Long Term Capital Gain without indexation",
              data:[
                {
                  title: "Fair Market Value of capital",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },
                {
                  title: "Full Value Of Consideration",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Cost of acquisition",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Capital Gain / Loss",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },
              ]
            }
        ]
      },
      {
        fund_type:'Non Equity Fund',
        fund_dtls:[
            {
            title:"Short Term Capital Gain",
            data:[
              {
                title: "Full Value Of Consideration",
                "01/04_15/06":0.00,
                "16/06_15/09":0.00,
                "16/09_15/12":0.00,
                "16/12_15/03":0.00,
                "16/03_31/03":0.00
              },{
                title: "Cost of acquisition",
                "01/04_15/06":0.00,
                "16/06_15/09":0.00,
                "16/09_15/12":0.00,
                "16/12_15/03":0.00,
                "16/03_31/03":0.00
              },{
                title: "Capital Gain / Loss",
                "01/04_15/06":0.00,
                "16/06_15/09":0.00,
                "16/09_15/12":0.00,
                "16/12_15/03":0.00,
                "16/03_31/03":0.00
              }
            ]
            },
            {
              title:"Long Term Capital Gain with indexation",
              data:[
                {
                  title: "Fair Market Value of capital asset",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },
                {
                  title: "Full Value Of Consideration",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Cost of acquisition",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Capital Gain / Loss",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                }
              ]
            },
            {
              title:"Long Term Capital Gain without indexation",
              data:[
                {
                  title: "Fair Market Value of capital",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },
                {
                  title: "Full Value Of Consideration",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Cost of acquisition",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },{
                  title: "Capital Gain / Loss",
                  "01/04_15/06":0.00,
                  "16/06_15/09":0.00,
                  "16/09_15/12":0.00,
                  "16/12_15/03":0.00,
                  "16/03_31/03":0.00
                },
              ]
            }
        ]
      },
      
    ];
    let filter_data_by_asset_type = res.filter(item => this.released_capital_gain_form.value.asset_type.includes(item.tax_type));
    from(filter_data_by_asset_type.filter(item => this.released_capital_gain_form.value.asset_type.includes(item.tax_type)))
      .pipe(
        groupBy((data: any) => data.tax_type),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
      ).subscribe(dt => {
        console.log(dt);
        const filtered_array = dt[1].map(el => el.calculation_arr).flat(1);
        const short_term_capital_gain = filtered_array.filter(el => el.stcg);
        const long_term_capital_gain_without_index = filtered_array.filter(el => el.index_ltcg);
        const long_term_capital_gain_with_index = filtered_array.filter(el => el.ltcg);
        as_per_itd = as_per_itd.filter((el,index) =>{
            if(index == 0){
             if(dt[0] == 'Equity Fund'){
                el.fund_dtls = el.fund_dtls.filter(element =>{
                    if(element.title == 'Short Term Capital Gain'){
                        element.data = element.data.filter(item => {
                          const dt = this.getSTCGAccordingToMonth_for_full_Equity(short_term_capital_gain,item.title,element.title);
                          item.title = dt.title;
                          item['01/04_15/06']=dt['01/04_15/06'];
                          item['16/03_31/03']=dt['16/03_31/03'];
                          item['16/06_15/09']=dt['16/06_15/09'];
                          item['16/09_15/12']=dt['16/09_15/12'];
                          item['16/12_15/03']=dt['16/12_15/03'];
                          return item;  
                        })
                    }
                    else if(element.title == 'Long Term Capital Gain with indexation'){
                        element.data = element.data.filter(item => {
                          const dt = this.getSTCGAccordingToMonth_for_full_Equity(long_term_capital_gain_with_index,item.title,element.title);
                          item.title = dt.title;
                          item['01/04_15/06']=dt['01/04_15/06'];
                          item['16/03_31/03']=dt['16/03_31/03'];
                          item['16/06_15/09']=dt['16/06_15/09'];
                          item['16/09_15/12']=dt['16/09_15/12'];
                          item['16/12_15/03']=dt['16/12_15/03'];
                          return item;  
                        })
                    }
                    else{
                      element.data = element.data.filter(item => {
                        const dt = this.getSTCGAccordingToMonth_for_full_Equity(long_term_capital_gain_without_index,item.title,element.title);
                        item.title = dt.title;
                        item['01/04_15/06']=dt['01/04_15/06'];
                        item['16/03_31/03']=dt['16/03_31/03'];
                        item['16/06_15/09']=dt['16/06_15/09'];
                        item['16/09_15/12']=dt['16/09_15/12'];
                        item['16/12_15/03']=dt['16/12_15/03'];
                        return item;  
                      })
                    }
                    return element;
                })
             }
             else{
              el.fund_dtls = el.fund_dtls.filter(element =>{
                  if(element.title == 'Short Term Capital Gain'){
                      element.data = element.data.filter(item => {
                        const dt = this.getSTCGAccordingToMonth_for_full__Non_Equity(short_term_capital_gain,item.title,element.title,item);
                        item.title = dt.title;
                        item['01/04_15/06']=dt['01/04_15/06'];
                        item['16/03_31/03']=dt['16/03_31/03'];
                        item['16/06_15/09']=dt['16/06_15/09'];
                        item['16/09_15/12']=dt['16/09_15/12'];
                        item['16/12_15/03']=dt['16/12_15/03'];
                        return item;  
                      })
                  }
                  else if(element.title == 'Long Term Capital Gain with indexation'){
                    console.log(long_term_capital_gain_with_index);

                      element.data = element.data.filter(item => {
                        const dt = this.getSTCGAccordingToMonth_for_full__Non_Equity(long_term_capital_gain_with_index,item.title,element.title,item);
                        item.title = dt.title;
                        item['01/04_15/06']=dt['01/04_15/06'];
                        item['16/03_31/03']=dt['16/03_31/03'];
                        item['16/06_15/09']=dt['16/06_15/09'];
                        item['16/09_15/12']=dt['16/09_15/12'];
                        item['16/12_15/03']=dt['16/12_15/03'];
                        return item;  
                      })
                  }
                  else{
                    console.log(long_term_capital_gain_without_index);

                    element.data = element.data.filter(item => {
                      const dt = this.getSTCGAccordingToMonth_for_full__Non_Equity(long_term_capital_gain_without_index,item.title,element.title,item);
                      item.title = dt.title;
                      item['01/04_15/06']=dt['01/04_15/06'];
                      item['16/03_31/03']=dt['16/03_31/03'];
                      item['16/06_15/09']=dt['16/06_15/09'];
                      item['16/09_15/12']=dt['16/09_15/12'];
                      item['16/12_15/03']=dt['16/12_15/03'];
                      return item;  
                    })
                  }
                  return element;
              })
             } 
            }
             return el
        });
        console.log(as_per_itd);
      }
    )
  }

  getSTCGAccordingToMonth_for_full__Non_Equity(data,title,parent_title,as_per_itd_data){
        let firstQuarter = as_per_itd_data['01/04_15/06']; 
        let secondQurter = as_per_itd_data['16/06_15/09'];
        let thirdQurter = as_per_itd_data['16/09_15/12'];
        let fourthQuarter = as_per_itd_data['16/12_15/03'];
        let fifthQuarter = as_per_itd_data['16/03_31/03'];
        console.log(data);
        data.forEach(el => {
            const day = new Date(el.trans_date);
            const cal_year = day.getFullYear();
            const first_quarter_is_between =moment(el.trans_date).isBetween(
              `${cal_year}-04-01`,`${cal_year}-06-15`,undefined,"[]"
            );
            const second_quarter_is_between =moment(el.trans_date).isBetween(
              `${cal_year}-06-16`,`${cal_year}-09-15`,undefined,"[]"
            );
            const third_quarter_is_between = moment(el.trans_date).isBetween(
              `${cal_year}-09-16`,`${cal_year}-12-15`,undefined,"[]"
            );
            const fourth_quarter_is_between =moment(el.trans_date).isBetween(
              `${cal_year}-12-16`,`${cal_year+1}-03-15`,undefined,"[]"
            );
            const fifth_quarter_is_between =moment(el.trans_date).isBetween(
              `${cal_year}-03-16`,`${cal_year}-03-31`,undefined,"[]"
            );
            console.log(el.trans_date);

            if(first_quarter_is_between){
              console.log(el.trans_date);
              firstQuarter += Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount);
              console.log(title + ':' + firstQuarter);
            }
            else if(second_quarter_is_between){
              console.log(el.trans_date);
              secondQurter+=  Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount)
              console.log(title + ':' + secondQurter);
            }
            else if(third_quarter_is_between){
              console.log(el.trans_date);
              // console.log(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount);
              thirdQurter+= Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount)
              console.log(title + ':' + thirdQurter);
            }
            else if(fourth_quarter_is_between){
              console.log(el.trans_date);
              fourthQuarter+= Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount);
              console.log(title + ':' + fourthQuarter);
            }
            else if(fifth_quarter_is_between){
              console.log(el.trans_date);
              fifthQuarter += Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount);
              console.log(title + ':' + fifthQuarter);
            }
        });
        return {
          "title":title,
          "01/04_15/06":firstQuarter,
          "16/06_15/09":secondQurter,
          "16/09_15/12":thirdQurter,
          "16/12_15/03":fourthQuarter,
          "16/03_31/03":fifthQuarter
        }

  }

  getSTCGAccordingToMonth_for_full_Equity(short_term_capital_gain,title,parent_title){
      let firstQuarter = 0; 
      let secondQurter = 0;
      let thirdQurter = 0;
      let fourthQuarter = 0;
      let fifthQuarter = 0;
      short_term_capital_gain.forEach(el => {
              const day = new Date(el.trans_date);
              const cal_year = day.getFullYear();
              const first_quarter_is_between =moment(el.trans_date).isBetween(
                `${cal_year}-04-01`,`${cal_year}-06-15`,undefined,"[]"
              );
              const second_quarter_is_between =moment(el.trans_date).isBetween(
                `${cal_year}-06-16`,`${cal_year}-09-15`,undefined,"[]"
              );
              const third_quarter_is_between =moment(el.trans_date).isBetween(
                `${cal_year}-09-16`,`${cal_year}-12-15`,undefined,"[]"
              );
              const fourth_quarter_is_between =moment(el.trans_date).isBetween(
                `${cal_year}-12-16`,`${cal_year+1}-03-15`,undefined,"[]"
              );
              const fifth_quarter_is_between =moment(el.trans_date).isBetween(
                `${cal_year}-03-16`,`${cal_year}-03-31`,undefined,"[]"
              );
              if(first_quarter_is_between){
                firstQuarter += Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount)
              }
              else if(second_quarter_is_between){
                secondQurter+=  Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount)
              }
              else if(third_quarter_is_between){
                // console.log(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount);
                thirdQurter+= Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount)
              }
              else if(fourth_quarter_is_between){
                fourthQuarter+= Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount)
              }
              else if(fifth_quarter_is_between){
                console.log(el.trans_date);
                fifthQuarter += Number(title == 'Full Value Of Consideration' ? el.sell_nav : el.tot_amount);
              }
      });
      return {
        "title":title,
        "01/04_15/06":firstQuarter,
        "16/06_15/09":secondQurter,
        "16/09_15/12":thirdQurter,
        "16/12_15/03":fourthQuarter,
        "16/03_31/03":fifthQuarter
      }
  }

  /*** For Getting Dividend History */
  getIDCWHistory(rest){
    if(this.idcw_summary.length == 0){
    this.dbIntr.api_call(1,'/clients/realisedDivHistory',rest)
    .pipe(pluck('data'))
    .subscribe((res:any) => {
        this.idcw_summary = res.data;
       let idcwp = res.data.filter(item => item.transaction_subtype.toLowerCase().includes('dividend payout'))
       let idcw_reinv = res.data.filter(item => item.transaction_subtype.toLowerCase().includes('dividend reinvestment'))
       this.total_idcw_summary = {
           "IDCWP":global.Total__Count(idcwp,(item:any) => Number(item.amount)),
           "IDCW Reinv.":global.Total__Count(idcw_reinv,(item:any) => Number(item.amount)),
          //  "IDCW Sweep In":0.00,
          //  "IDCW Sweep Out":0.00,
           "TDS":global.Total__Count(res.data,(item:any) => Number(item.tot_tds))
        }
        console.log(this.total_idcw_summary.length);
    })
  }
  }

  /*** For Getting FinancialWise Report */
  getfinancialWiseReport(rest){
    if(this.financial_year_wise_trans_report.length == 0){
    this.dbIntr.api_call(1,'/clients/finYearWiseTrans',rest)
    .pipe(pluck('data'))
    .subscribe((res:any) => {
      // console.log(res);
      // this.financial_year_wise_trans_report = res;
      this.financial_year_wise_trans_report = [];
      this.segregrateFinancialYearWiseReport(res);
      this.segregrateFinancialYearWiseDetailsReport(res);
    })
    }
  }
  /*** End */

  segregrateFinancialYearWiseDetailsReport = (arr) =>{
    console.log(arr)
    from(arr.filter(item => this.released_capital_gain_form.value.asset_type.includes(item.tax_type)))
    .pipe(
      groupBy((data:any) => data.tax_type),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    ).subscribe((dt) =>{
        console.log(dt);
         from(dt[1]).pipe(  groupBy((data:any) => data.scheme_name),
         mergeMap(group => zip(of(group.key), group.pipe(toArray())))).subscribe((res) =>{
            // this.financial_year_wise_detail_report.push({
            //     fund_name:dt[0],
            //     isin_no:res[1].length > 0 ? res[1][0].isin_no : "N/A",
            //     folio_no:res[1].length > 0 ? res[1][0].folio_no : 'N/A',
            //     details:res[1].filter(el => {

            //     })
            // })
         })
    })
  }

  calculate_total_financial_year_wise_summary_report = () =>{
      this.total_financial_wise_report = {
              scheme_name:'GRAND TOTAL',
              folio_no:'',
              isin_no:'',
              inflow:global.Total__Count(this.financial_year_wise_trans_report,(x) => x.inflow ? Number(x.inflow) : 0),
              outflow:global.Total__Count(this.financial_year_wise_trans_report,(x) => x.outflow ? Number(x.outflow) : 0),
              idcw_reinv:global.Total__Count(this.financial_year_wise_trans_report,(x) => x.idcw_reinv ? Number(x.idcw_reinv) : 0),
              idcwp:global.Total__Count(this.financial_year_wise_trans_report,(x) => x.idcwp ? Number(x.idcwp) : 0),
              net_flow:global.Total__Count(this.financial_year_wise_trans_report,(x) => x.net_flow ? Number(x.net_flow) : 0),
      }

  }

  segregrateFinancialYearWiseReport(arr){
    let count = 0;
    from(arr)
    .pipe(
      groupBy((data:any) => data['scheme_name']),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    ).subscribe((dt) =>{
          this.financial_year_wise_trans_report.push(
            {
              scheme_name: `${dt[0]}-${dt[1][0].plan_name}-${dt[1][0].option_name}`,
              folio_no:dt[1][0].folio_no,
              isin_no:dt[1][0].isin_no ? dt[1][0].isin_no : "N/A",
              inflow:'0.00',
              outflow:'0.00',
              idcw_reinv:'0.00',
              idcwp:'0.00',
              net_flow:'0.00'
            }
          )
    })
  }
  getGrandSummaryTotal = (summary_data: Partial<IsummaryReport>[]): Partial<IsummaryReport> => {
    return {
      tds: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.tds)),
      short_term_gain: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.short_term_gain)),
      long_term_gain: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.long_term_gain)),
      short_term_loss: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.short_term_loss)),
      long_term_loss: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.long_term_loss)),
      net_short_term_gain_loss: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.net_short_term_gain_loss)),
      net_long_term_gain_loss: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.net_long_term_gain_loss)),
      stt: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.stt)),
      total_gain_loss: global.Total__Count(summary_data, (item: Partial<IsummaryReport>) => Number(item.total_gain_loss)),
    }
  }

  getGrandTotal = (arr) => {
    return {
      tot_amount: global.Total__Count(arr, (item: any) => Number(item.tot_amount)),
      pur_price: global.Total__Count(arr, (item: any) => Number(item.pur_price)),
      tot_units: global.Total__Count(arr, (item: any) => Number(item.tot_units)),
      nav_as_on_31_01_2018: global.Total__Count(arr, (item: any) => Number(item.nav_as_on_31_01_2018)),
      amount_as_on_31_01_2018: global.Total__Count(arr, (item: any) => Number(item.amount_as_on_31_01_2018)),
      sell_nav: global.Total__Count(arr, (item: any) => Number(item.sell_nav)),
      redemp_amount: global.Total__Count(arr, (item: any) => Number(item.redemp_amount)),
      tot_tds: global.Total__Count(arr, (item: any) => Number(item.tot_tds)),
      stt: global.Total__Count(arr, (item: any) => Number(item.stt)),
      net_sell_proceed: global.Total__Count(arr, (item: any) => Number(item.net_sell_proceed)),
      div_amount: global.Total__Count(arr, (item: any) => Number(item.div_amount)),
      // days: global.Total__Count(arr,(item:any) => Number(item.days)),
      index_ltcg: global.Total__Count(arr, (item: any) => Number(item.index_ltcg ? item.index_ltcg : 0)),
      stcg: global.Total__Count(arr, (item: any) => Number(item.stcg ? item.stcg : 0)),
      ltcg: global.Total__Count(arr, (item: any) => Number(item.ltcg ? item.ltcg : 0))
    }
  }


  setDateInClientDetailsCard(date_type: string) {
    let date_rng;
    let start_date, end_date;
    if (date_type == 'F') {
      start_date = new Date(Number(this.released_capital_gain_form.value.fin_year.split('-')[0]), 3, 1);
      if (this.financial_year[0] == this.released_capital_gain_form.value.fin_year) {
        // start_date =new Date(Number(this.financial_year[0].split('-')[0]),3,1);
        end_date = new Date();
      }
      else {
        // start_date =new Date(Number(this.released_capital_gain_form.value.fin_year.split('-')[0]),0,1);
        end_date = new Date(Number(this.released_capital_gain_form.value.fin_year.split('-')[1]), 2, 31);
      }
      date_rng = `${this.datePipe.transform(start_date, 'longDate')} TO ${this.datePipe.transform(end_date, 'longDate')}`
    }
    else {
      start_date = this.datePipe.transform(this.released_capital_gain_form.get('date_range').value[0], 'longDate');
      // console.log(start_date)
      end_date = this.datePipe.transform(this.released_capital_gain_form.get('date_range').value[1], 'longDate');
      date_rng = `${start_date} TO ${end_date}`;
    }
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
    if (this.released_capital_gain_form.value.view_type == 'F') {
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
  getFamilymemberAccordingToFamilyHead_Id = (id: number | undefined = undefined) => {
    if (id) {
      this.dbIntr.api_call(0, '/clientFamilyDetail', `family_head_id=${id}&view_type=${this.released_capital_gain_form.value.view_type}`)
        .pipe(pluck('data'))
        .subscribe((res: client[]) => {
          this.family_members = res;
          this.released_capital_gain_form.get('family_members').setValue(res.map((item: client) => ({ pan: item.pan, client_name: item.client_name })))
        })
    }
    else {
      this.family_members = [];
      this.released_capital_gain_form.get('family_members').setValue([]);

    }
  }

  ngAfterViewInit() {
    /**view_type Change*/
    this.released_capital_gain_form.controls['view_type'].valueChanges.subscribe(res => {
      if (this.family_members.length > 0) {
        this.getFamilymemberAccordingToFamilyHead_Id();
      }
      this.released_capital_gain_form.get('client_name').reset('', { emitEvent: false });
      this.released_capital_gain_form.get('pan_no').reset('');
      if (res) {
        this.__clientMst = [];
        this.released_capital_gain_form.get('client_name').enable();
      }
      else {
        this.released_capital_gain_form.get('client_name').disable();
      }
    })
    /**End */

    /** Investor Change */
    this.released_capital_gain_form.controls['client_name'].valueChanges
      .pipe(
        tap(() => this.released_capital_gain_form.get('pan_no').setValue('')),
        tap(() => {
          this.__isClientPending = true
          if (this.family_members.length > 0) {
            this.getFamilymemberAccordingToFamilyHead_Id();
          }
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
            dt + '&view_type=' + this.released_capital_gain_form.value.view_type
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
        complete: () => { },
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

  getColumns = () => {
    return this.utility.getColumns(this.relised_capital_gain_summary_column);
  }

  filterGlobal_secondary = ($event) => {
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value, 'contains')
  }

  TabDetails =(ev) =>{
      this.parent_tab_id = ev?.tabDtls?.flag; 
      this.realised_capital_gain_sub_tab = ev?.tabDtls?.sub_menu;
      this.selected_parent_index = ev.index;
      switch(this.parent_tab_id){
        case 'D': this.getIDCWHistory(this.main_frm_dt);this.setSubTabIdOnSelectParentId(ev?.tabDtls?.sub_menu);break;
        case 'F':this.getfinancialWiseReport(this.main_frm_dt);this.setSubTabIdOnSelectParentId( ev?.tabDtls?.sub_menu);break;
        default: break;
      }
  }

  setSubTabIdOnSelectParentId = (sub_menu) =>{
    if(sub_menu.filter(el => el.flag == this.sub_tab_id).length > 0){}
    else{this.sub_tab_id = sub_menu.length > 0 ? sub_menu[0].flag : '';this.selected_index = 0;}
  }

  subTabDetails = (ev) =>{
      this.sub_tab_id = ev.tabDtls.flag;
      this.selected_index = ev.index;
  }

  letter(i){
    try{
      return String.fromCharCode(65+i);
    }
    catch(err){
      console.log(err);
      return '';
    }
  }
  
  exportAs(event){
    console.log(event)
  }

}


export class realisedCapitalGainColumn {
  public static column = [
    {
      field: 'trans_date',
      header: 'Trxn. Date',
      width: '7rem',
      sub_row: [],
      row_span: 2
    },
    {
      field: 'transaction_type',
      header: 'Trxn. Type',
      width: '8rem',
      sub_row: [],
      row_span: 2
    },
    {
      field: 'pur_dtls',
      header: 'Purchase Details',
      col_span: 7,
      row_span: 1,
      // width:'47rem',
      sub_row: [
        {
          field: 'tot_amount',
          header: 'Purchase / Dividend Reinvestment',
          width: '6rem'
        },
        {
          field: 'pur_price',
          header: 'Pur. NAV',
          width: '3rem'
        },
        {
          field: 'tot_units',
          header: 'Units',
          width: '2rem'
        },
        {
          field: 'pur_before',
          header: 'Equity Purchase Before 31-01-18',
          width: '5rem'
        },
        {
          field: 'nav_as_on_31_01_2018',
          header: 'NAV as on 31-01-18',
          width: '5rem'
        },
        {
          field: 'amount_as_on_31_01_2018',
          header: 'Value as on 31-01-18',
          width: '4rem'
        },
        {
          field: 'debt_31_03_2023',
          header: 'Debt Purchase Before 31-03-23',
          width: '5rem'
        },
      ]
    },
    {
      field: 'sell_dtls',
      header: 'Sell Details',
      col_span: 7,
      // width:'45rem',
      row_span: 1,
      sub_row: [
        {
          field: 'sell_type',
          header: 'Sell Type',
          width: '6rem'
        },
        {
          field: 'sell_date',
          header: 'Sell Date',
          width: '3rem'
        },
        {
          field: 'sell_nav',
          header: 'Sell NAV',
          width: '3rem'
        },
        {
          field: 'redemp_amount',
          header: 'Redemption Amount',
          width: '5rem'
        },
        {
          field: 'tot_tds',
          header: 'TDS',
          width: '2rem'
        },
        {
          field: 'stt',
          header: 'STT',
          width: '2rem'
        },
        {
          field: 'net_sell_proceed',
          header: 'Net Sell Proced',
          width: '4rem'
        }
      ]
    },
    {
      field: 'gain_loss_related',
      header: 'Gain Loss Related',
      // width:'27rem',
      col_span: 5,
      row_span: 1,
      sub_row: [
        {
          field: 'div_amount',
          header: 'Devidend Amount',
          width: '3rem'
        },
        {
          field: 'days',
          header: 'Days',
          width: '3rem'
        },
        {
          field: 'stcg',
          header: 'STCG',
          width: '3rem'
        },
        {
          field: 'ltcg',
          header: 'LTCG',
          width: '3rem'
        },
        {
          field: 'index_ltcg',
          header: 'INDEX LTCG',
          width: '3rem'
        },
      ]
    }
  ]

  public static column_summary = [
    {
      field: 'scheme_name',
      header: 'Scheme',
      width: '39rem'
    },
    {
      field: 'isin_no',
      header: 'ISIN',
      width: '8rem'
    },
    {
      field: 'folio',
      header: 'Folio',
      width: '8rem'
    },
    {
      field: 'short_term_gain',
      header: 'Short Term Gain',
      width: '6rem'
    },
    {
      field: 'short_term_loss',
      header: 'Short Term Loss',
      width: '6rem'
    },
    {
      field: 'net_short_term_gain_loss',
      header: 'Net Short Term Gain Loss',
      width: '8rem'

    },
    {
      field: 'long_term_gain',
      header: 'Long Term Gain',
      width: '8rem'
    },
    {
      field: 'long_term_loss',
      header: 'Long Term Loss',
      width: '6rem'
    },
    {
      field: 'net_long_term_gain_loss',
      header: 'Net Long Term Gain Loss',
      width: '9rem'

    },
    {
      field: 'stt',
      header: 'STT',
      width: '5rem'
    },
    {
      field: 'tds',
      header: 'TDS',
      width: '5rem'
    },
    {
      field: 'total_gain_loss',
      header: 'Total Gain Loss',
      width: '8rem'
    }
  ]

  public static column_As_Per_ITD: column[] = [
    {
      field: 'summary_of_capital_gain',
      header: 'Summary of Capital Gains',
      width: '40rem'
    },
    {
      field: '01/04_15/06',
      header: '01/04 to 15/06',
      width: ''
    },
    {
      field: '16/06_15/09',
      header: '16/06 to 15/09',
      width: ''
    },
    {
      field: '16/09_15/12',
      header: '16/09 to 15/12',
      width: ''
    },
    {
      field: '16/12_15/03',
      header: '16/12 to 15/03',
      width: ''
    },
    {
      field: '16/03_31/03',
      header: '16/03 to 31/03',
      width: ''
    },
    {
      field: 'total',
      header: 'Total',
      width: ''
    },
  ]
}

export interface IsummaryReport {

  id: number;
  scheme_name: string | undefined;
  folio: string | undefined;
  isin_no:string | undefined;
  short_term_gain: number;
  short_term_loss: number;
  long_term_gain: number;
  long_term_loss: number;
  net_short_term_gain_loss: number;
  net_long_term_gain_loss: number;
  tds: number;
  stt: number;
  total_gain_loss: number;
}


export interface ISummaryTbleData {
  tax_type: string;
  summary: Partial<IsummaryReport>[];
  total: Partial<IsummaryReport>
}


export class DividendColumn{
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No.',
      width:'5rem',
      isVisible:['DD','DS']
    },
    {
      field:'trans_date',
      header:'Date',
      width:'7rem',
      isVisible:['DD']
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'10rem',
      isVisible:['DD','DS']
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'40rem',
      isVisible:['DD','DS']
    },
    {
      field:'isin_no',
      header:'ISIN',
      width:'8rem',
      isVisible:['DD','DS']
    },
    {
      field:'idcwp',
      header:'IDCWP',
      width:'',
      isVisible:['DD','DS']
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'',
      isVisible:['DD','DS']
    },
    // {
    //   field:'idcw_sweep_in',
    //   header:'IDCW Sweep In',
    //   width:'',
    //   isVisible:['DD','DS']
    // },
    // {
    //   field:'idcw_sweep_out',
    //   header:'IDCW Sweep Out',
    //   width:'',
    //   isVisible:['DD','DS']
    // },
    {
      field:'tot_tds',
      header:'TDS',
      width:'',
      isVisible:['DD','DS']
    }
  ]
}

