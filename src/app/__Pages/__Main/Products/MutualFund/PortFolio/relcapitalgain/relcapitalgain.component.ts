import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import clientType from '../../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { Calendar } from 'primeng/calendar';
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

    max_date :Date = new Date()

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

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    this.released_capital_gain_form.get('client_name').disable();
    this.financial_year = global.getAllFinancialYears();
    this.released_capital_gain_form.get('fin_year').setValue(this.financial_year.length > 0 ? this.financial_year[0] : '')
  }

  getReleasedCapitalGainLoss = () =>{
      console.log(this.released_capital_gain_form.value);
      const dt = Object.assign({},this.released_capital_gain_form.value,
        {
          ...this.released_capital_gain_form.value,
          date_range:this.released_capital_gain_form.value.date_type === 'D' ? global.getActualVal(this.date_range.inputFieldValue) : '',
          fin_year:this.released_capital_gain_form.value.date_type === 'D' ? global.getActualVal(this.released_capital_gain_form.value.fin_year) : ''
        }
      )
      this.dbIntr.api_call(1,'/clients/realisedCapitalGain',this.utility.convertFormData(dt))
      .pipe(pluck('data')).subscribe(res =>{
        console.log(res);
      })
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


