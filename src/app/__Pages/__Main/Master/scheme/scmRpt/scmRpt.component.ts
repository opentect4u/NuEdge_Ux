import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmModificationComponent } from '../scmModification/scmModification.component';
import { schemeClmns } from '../../../../../__Utility/Master/schemeClmns';
import itemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { column } from 'src/app/__Model/tblClmns';
import { amc } from 'src/app/__Model/amc';
import { sort } from 'src/app/__Model/sort';
import frequency from '../../../../../../assets/json/SipFrequency.json';
import trxnType from '../../../../../../assets/json/Master/scmtrxnType.json';
type selectBtn = {
  label: string;
  value: string;
  icon: string;
};

@Component({
  selector: 'app-scmRpt',
  templateUrl: './scmRpt.component.html',
  styleUrls: ['./scmRpt.component.css'],
})
export class ScmRptComponent implements OnInit {
  __freq = frequency;
  __trxnType = trxnType;
  sort = new sort();

  settings_for_trxn_type = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'trxn_type',
    'Search Trxn Type',
    3
  );

  settings_for_freq = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'freq_name',
    'Search Frequency',
    2
  );

  settings = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'amc_short_name',
    'Search AMC',
    1
  );
  settingsForcat = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Search Category',
    2
  );
  settingsForsubcat = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Search Subcategory',
    1
  );
  settingsForScm = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Search Scheme',
    1
  );
  __amcMst: amc[] = [];
  isOpenMegaMenu: boolean = false;
  __isSchemeSpinner: boolean = false;
  isLoading: boolean = false;
  selectBtn: selectBtn[] = [
    { label: 'Advance Filter', value: 'A', icon: 'pi pi-filter' },
    { label: 'Reset', value: 'R', icon: 'pi pi-refresh' },
  ];
  itemsPerPage: selectBtn[] = itemsPerPage;
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  @ViewChild('searchcat') __searchCat: ElementRef;
  @ViewChild('searchsubcat') searchsubcat: ElementRef;
  // toppings = new FormControl();
  // toppingList: any = [];
  __scmForm = new FormGroup({
    scheme_status: new FormControl('O'),
    amc_name: new FormControl([], { updateOn: 'blur' }),
    cat_id: new FormControl([], { updateOn: 'blur' }),
    subcat_id: new FormControl([], { updateOn: 'blur' }),
    scheme_id: new FormControl([], { updateOn: 'blur' }),
    options: new FormControl('2'),
    alt_scheme_name: new FormControl(''),
    alt_scheme_id: new FormControl(''),
    advanceFlt: new FormControl('R'),
    freq: new FormControl([]),
    amt_rng: new FormControl(''),
    trxn_type: new FormControl([]),
  });
  __isVisible: boolean = true;
  displayMode_forScheme: string;
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __selectScm = new MatTableDataSource<scheme>([]);
  __exportedClmns: string[] = [];
  __columns: column[] = [];
  ClmnList: column[] = [];
  SelectedClms: string[] = [];
  __catMst: category[] = [];
  __subcatMst: subcat[] = [];
  schemeMst: scheme[] = [];
  searchedSchemeMst: scheme[] = [];
  // __columnsForsummary: string[] = [];
  // __columnsForDetails: string[] = [];
  __export = new MatTableDataSource<scheme>([]);
  __iscatspinner: boolean = false;
  __issubcatspinner: boolean = false;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ScmRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.getSchemeMst();
    this.setColumns(
      this.__scmForm.value.scheme_status,
      this.__scmForm.value.options
    );
    this.getAmcMst();
  }

  getAmcMst = () => {
    this.__dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.__amcMst = res;
      });
  };

  getcategoryAgainstAmc = (arr_amc_ids) => {
    if (arr_amc_ids.length > 0) {
      this.__dbIntr
        .api_call(
          0,
          '/category',
          'arr_amc_id=' + JSON.stringify(arr_amc_ids.map((item) => item.id))
        )
        .pipe(pluck('data'))
        .subscribe((res: category[]) => {
          this.__catMst = res;
        });
    } else {
      console.log('asdasddasdads')
      this.__scmForm.controls['cat_id'].reset([], { emitEvent: true });
      this.__catMst = [];
    }
  };
  getSubcategoryAgainstCategory = (arr_cat_ids, arr_amc_ids) => {
    if (arr_cat_ids.length > 0 && arr_amc_ids.length > 0) {
      this.__dbIntr
        .api_call(
          0,
          '/subcategory',
          'arr_cat_id=' +
            JSON.stringify(arr_cat_ids.map((item) => item.id)) +
            '&arr_amc_id=' +
            JSON.stringify(arr_amc_ids.map((item) => item.id))
        )
        .pipe(pluck('data'))
        .subscribe((res: subcat[]) => {
          this.__subcatMst = res;
        });
    } else {
      this.__scmForm.controls['subcat_id'].reset([], { emitEvent: true });
      this.__subcatMst = [];
    }
  };
  getSchemeAgainstSubCategory = (arr_subcat_ids, arr_cat_ids, arr_amc_ids) => {
    if (
      arr_subcat_ids.length > 0 &&
      arr_cat_ids.length > 0 &&
      arr_amc_ids.length > 0
    ) {
      this.__dbIntr
        .api_call(
          0,
          '/scheme',
          'arr_subcat_id=' +
            JSON.stringify(arr_subcat_ids.map((item) => item.id)) +
            '&arr_cat_id=' +
            JSON.stringify(arr_cat_ids.map((item) => item.id)) +
            '&arr_amc_id=' +
            JSON.stringify(arr_amc_ids.map((item) => item.id))
        )
        .pipe(pluck('data'))
        .subscribe((res: scheme[]) => {
          this.schemeMst = res;
        });
    } else {
      this.__scmForm.controls['scheme_id'].reset([]);
      this.schemeMst = [];
    }
  };

  setColumns(scm_status, option) {
    const clmnsTobeRemoved = ['edit', 'delete'];
    const Clms = ['nfo_start_dt', 'nfo_end_dt', 'nfo_reopen_dt'];
    this.ClmnList =
      scm_status == 'N'
        ? schemeClmns.column_selector
        : schemeClmns.column_selector.filter(
            (item) => !Clms.includes(item.field)
          );
    if (option == 2) {
      this.__columns = schemeClmns.Summary;
      console.log(this.__columns);
    } else {
      this.__columns = this.ClmnList;
    }
    this.SelectedClms = this.__columns.map((x) => x.field);
    this.__exportedClmns = this.__columns
      .filter((x: any) => !clmnsTobeRemoved.includes(x.field))
      .map((item) => {
        return item['field'];
      });
  }

  getSchemeMst(
    column_name: string | null = '',
    sort_by: string | null = 'asc'
  ) {
    const __scmExport = new FormData();
    __scmExport.append('paginate', this.__pageNumber.value);
    __scmExport.append('scheme_type', this.__scmForm.value.scheme_status);
    __scmExport.append(
      'field',
      global.getActualVal(this.sort.field) ? this.sort.field : ''
    );
    __scmExport.append(
      'order',
      global.getActualVal(this.sort.order) ? this.sort.order : '1'
    );
    __scmExport.append(
      'cat_id',
      JSON.stringify(this.__scmForm.value.cat_id.map((item) => item.id))
    );
    __scmExport.append(
      'amc_id',
      JSON.stringify(this.__scmForm.value.amc_name.map((item) => item.id))
    );
    __scmExport.append(
      'subcat_id',
      JSON.stringify(this.__scmForm.value.subcat_id.map((item) => item.id))
    );
    __scmExport.append(
      'scheme_id',
      JSON.stringify(this.__scmForm.value.scheme_id.map((item) => item.id))
    );
    __scmExport.append('search_scheme_id',global.getActualVal(this.__scmForm.value.alt_scheme_id));
    if(this.__scmForm.value.advanceFlt == 'A'){
      __scmExport.append(
        'trans_type_id',
        JSON.stringify(this.__scmForm.value.trxn_type.map((item) => item.id))
      );
      __scmExport.append(
        'amount_range',
        global.getActualVal(this.__scmForm.value.amt_rng)
      );
      __scmExport.append(
        'frequency',
        JSON.stringify(this.__scmForm.value.freq.map((item) => item.id))
      );
    }

    this.__dbIntr
      .api_call(1, '/schemeDetailSearch', __scmExport)
      .pipe(
        map((x: any) => x.data),
        map((x) => {
          this.__paginate = x.links;
          return x.data.map((item) => {
            const object = { ...item };
            object.daily_sip_fresh_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'F',
              'D'
            );
            (object.daily_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'D'
            )),
              (object.weekly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'W'
              ));
            (object.weekly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'W'
            )),
              (object.fortnightly_sip_fresh_min_amt =
                global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'F'));
            (object.fortnightly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'F'
            )),
              (object.monthly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'M'
              ));
            (object.monthly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'M'
            )),
              (object.quarterly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'Q'
              ));
            object.quarterly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'Q'
            );
            object.semi_anually_sip_fresh_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'F',
              'S'
            );
            object.semi_anually_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'S'
            );
            object.anually_sip_fresh_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'F',
              'A'
            );
            object.anually_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'A'
            );
            object.daily_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'D'
            );
            object.weekly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'W'
            );
            object.fortnightly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'F'
            );
            object.monthly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'M'
            );
            object.quarterly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'Q'
            );
            object.semi_anually_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'S'
            );
            object.anually_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'A'
            );
            object.daily_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'D'
            );
            object.weekly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'W'
            );
            object.fortnightly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'F'
            );
            object.monthly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'M'
            );
            object.quarterly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'Q'
            );
            object.semi_anually_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'S'
            );
            object.anually_swp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'A'
            );
            return object;
          });
        })
      )
      .subscribe((res) => {
        this.setPaginator(res);
        // this.tableExport();
      });
  }

  populateDT(__scm: scheme) {
    this.openDialog(__scm, __scm.id, __scm.scheme_type);
  }
  openDialog(
    __scheme: scheme | null = null,
    __scmId: number,
    __scmType: string
  ) {
    console.log(__scheme);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SC',
      id: __scmId,
      items: __scheme,
      title: __scmId == 0 ? 'Add Scheme' : 'Update Scheme',
      right: global.randomIntFromInterval(1, 60),
      product_id: this.data.product_id ? this.data.product_id : '',
      scheme_type: __scmType,
    };
    dialogConfig.id = __scmId > 0 ? __scmId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ScmModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectScm.data.unshift(dt.data);
            this.__selectScm._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SC',
      });
    }
  }
  updateRow(row_obj: scheme) {
    this.__selectScm.data = this.__selectScm.data.filter(
      (value: scheme, key) => {
        if (value.id == row_obj.id) {
          (value.product_id = row_obj.product_id),
            (value.amc_id = row_obj.amc_id),
            (value.category_id = row_obj.category_id),
            (value.subcategory_id = row_obj.subcategory_id),
            (value.scheme_name = row_obj.scheme_name),
            (value.id = row_obj.id),
            (value.scheme_type = row_obj.scheme_type),
            (value.nfo_start_dt = row_obj.nfo_start_dt),
            (value.nfo_end_dt = row_obj.nfo_end_dt),
            (value.nfo_reopen_dt = row_obj.nfo_reopen_dt),
            (value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt),
            (value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt),
            (value.pip_add_min_amt = row_obj.pip_add_min_amt),
            (value.sip_add_min_amt = row_obj.sip_add_min_amt),
            (value.sip_date = row_obj.sip_date),
            (value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt),
            (value.gstin_no = row_obj.gstin_no);
          value.stp_date = row_obj.stp_date;
          value.swp_date = row_obj.swp_date;
          value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt;
          value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt;
          value.ava_special_sip = row_obj.ava_special_sip;
          value.special_sip_name = row_obj.special_sip_name;
          value.ava_special_swp = row_obj.ava_special_swp;
          value.special_swp_name = row_obj.special_swp_name;
          value.ava_special_stp = row_obj.ava_special_stp;
          value.special_stp_name = row_obj.special_stp_name;
          value.nfo_entry_date = row_obj.nfo_entry_date;
          value.step_up_min_amt = row_obj.step_up_min_amt;
          value.step_up_min_per = row_obj.step_up_min_per;
          value.benchmark = row_obj.benchmark;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: scheme, key) => {
      if (value.id == row_obj.id) {
        (value.product_id = row_obj.product_id),
          (value.amc_id = row_obj.amc_id),
          (value.category_id = row_obj.category_id),
          (value.subcategory_id = row_obj.subcategory_id),
          (value.scheme_name = row_obj.scheme_name),
          (value.id = row_obj.id),
          (value.scheme_type = row_obj.scheme_type),
          (value.nfo_start_dt = row_obj.nfo_start_dt),
          (value.nfo_end_dt = row_obj.nfo_end_dt),
          (value.nfo_reopen_dt = row_obj.nfo_reopen_dt),
          (value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt),
          (value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt),
          (value.pip_add_min_amt = row_obj.pip_add_min_amt),
          (value.sip_add_min_amt = row_obj.sip_add_min_amt),
          (value.sip_date = row_obj.sip_date),
          (value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt),
          (value.gstin_no = row_obj.gstin_no);
        value.stp_date = row_obj.stp_date;
        value.swp_date = row_obj.swp_date;
        value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt;
        value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt;
        value.ava_special_sip = row_obj.ava_special_sip;
        value.special_sip_name = row_obj.special_sip_name;
        value.ava_special_swp = row_obj.ava_special_swp;
        value.special_swp_name = row_obj.special_swp_name;
        value.ava_special_stp = row_obj.ava_special_stp;
        value.special_stp_name = row_obj.special_stp_name;
        value.nfo_entry_date = row_obj.nfo_entry_date;
        value.step_up_min_amt = row_obj.step_up_min_amt;
        value.step_up_min_per = row_obj.step_up_min_per;
        value.benchmark = row_obj.benchmark;
      }
      return true;
    });
  }
  ngAfterViewInit() {
    this.__scmForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(this.__scmForm.get('scheme_status').value, res);
    });

    this.__scmForm.controls['scheme_status'].valueChanges.subscribe((res) => {
      this.setColumns(res, this.__scmForm.get('options').value);
    });

    this.__scmForm.controls['amc_name'].valueChanges.subscribe((res) => {
      this.getcategoryAgainstAmc(res);
      this.getSubcategoryAgainstCategory(
        this.__scmForm.controls['cat_id'].value,
        res
      );
      this.getSchemeAgainstSubCategory(
        this.__scmForm.controls['subcat_id'].value,
        this.__scmForm.controls['cat_id'].value,
        res
      );
    });
    this.__scmForm.controls['cat_id'].valueChanges.subscribe((res) => {
      this.getSubcategoryAgainstCategory(
        res,
        this.__scmForm.controls['amc_name'].value
      );
      this.getSchemeAgainstSubCategory(
        this.__scmForm.controls['subcat_id'].value,
        res,
        this.__scmForm.controls['amc_name'].value
      );
    });
    this.__scmForm.controls['subcat_id'].valueChanges.subscribe((res) => {
      this.getSchemeAgainstSubCategory(
        res,
        this.__scmForm.controls['cat_id'].value,
        this.__scmForm.controls['amc_name'].value
      );
    });

    this.__scmForm.controls['alt_scheme_name'].valueChanges
      .pipe(

        tap(() => (
          this.__isSchemeSpinner = true,
          this.__scmForm.controls['alt_scheme_id'].setValue('')
          )),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.searchedSchemeMst = value;
          this.searchSchemeVisibility('block');
          this.__isSchemeSpinner = false;
          this.__scmForm.controls['alt_scheme_id'].setValue('');
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSchemeSpinner = false;
        },
      });
  }
  searchSchemeVisibility(display_mode) {
    this.displayMode_forScheme = display_mode;
  }
  refreshOrAdvanceFlt() {
    if (this.__scmForm.controls['advanceFlt'].value == 'R') {
      this.__scmForm.patchValue({
        options: '2',
        freq:[],
        amt_rng:'',
        trxn_type:[]
      });
      this.__scmForm.get('amc_name').setValue([],{emitEvent:true});
      this.__scmForm.controls['alt_scheme_id'].setValue('');
      this.__scmForm.controls['alt_scheme_name'].setValue('',{emitEvent:false});
      this.__pageNumber.setValue('10');
      this.sort = new sort();
      this.getSchemeMst(
        this.__sortAscOrDsc.active,
        this.__sortAscOrDsc.direction
      );
    }
  }
  submit() {
    this.getSchemeMst(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
  }
  tableExport(column_name: string | null = '', sort_by: string | null = 'asc') {
    const __scmExport = new FormData();
    __scmExport.append('column_name', column_name);
    __scmExport.append('scheme_type', this.__scmForm.value.scheme_status);
    __scmExport.append('sort_by', sort_by);
    __scmExport.append(
      'scheme_name',
      this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : ''
    );
    __scmExport.append(
      'cat_id',
      this.__scmForm.value.cat_id ? this.__scmForm.value.cat_id : ''
    );
    __scmExport.append(
      'amc_id',
      this.__scmForm.value.amc_name ? this.__scmForm.value.amc_name : ''
    );
    __scmExport.append(
      'subcat_id',
      this.__scmForm.value.subcat_id ? this.__scmForm.value.subcat_id : ''
    );
    this.__dbIntr
      .api_call(1, '/schemeExport', __scmExport)
      .pipe(
        map((x: any) => x.data),
        map((x) => {
          return x.map((item) => {
            const object = { ...item };
            object.daily_sip_fresh_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'F',
              'D'
            );
            (object.daily_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'D'
            )),
              (object.weekly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'W'
              ));
            (object.weekly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'W'
            )),
              (object.fortnightly_sip_fresh_min_amt =
                global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'F'));
            (object.fortnightly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'F'
            )),
              (object.monthly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'M'
              ));
            (object.monthly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'M'
            )),
              (object.quarterly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'Q'
              ));
            object.quarterly_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'Q'
            );
            object.semi_anually_sip_fresh_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'F',
              'S'
            );
            object.semi_anually_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'S'
            );
            object.anually_sip_fresh_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'F',
              'A'
            );
            object.anually_sip_add_min_amt = global.getFrequencywiseAmt(
              item.sip_freq_wise_amt,
              'A',
              'A'
            );
            object.daily_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'D'
            );
            object.weekly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'W'
            );
            object.fortnightly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'F'
            );
            object.monthly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'M'
            );
            object.quarterly_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'Q'
            );
            object.semi_anually_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'S'
            );
            object.anually_swp_amt = global.getFrequencywiseAmt(
              item.swp_freq_wise_amt,
              'F',
              'A'
            );
            object.daily_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'D'
            );
            object.weekly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'W'
            );
            object.fortnightly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'F'
            );
            object.monthly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'M'
            );
            object.quarterly_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'Q'
            );
            object.semi_anually_stp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'S'
            );
            object.anually_swp_amt = global.getFrequencywiseAmt(
              item.stp_freq_wise_amt,
              'F',
              'A'
            );
            return object;
          });
        })
      )
      .subscribe((res: scheme[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  getSchememaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/scheme', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        console.log(res);

        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.isLoading = !this.isLoading;
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&scheme_id=' +
              JSON.stringify(
                this.__scmForm.value.scheme_id.map((item) => item.id)
              )) +
            ('&field=' + global.getActualVal(this.sort.field)) +
            ('&order=' + global.getActualVal(this.sort.order)) +
            ('&cat_id=' +
              JSON.stringify(
                this.__scmForm.value.cat_id.map((item) => item.id)
              )) +
            ('&amc_id=' +
              JSON.stringify(
                this.__scmForm.value.amc_name.map((item) => item.id)
              )) +
            ('&subcat_id=' +
              JSON.stringify(
                this.__scmForm.value.subcat_id.map((item) => item.id)
              )) +
            ('&scheme_type=' + this.__scmForm.value.scheme_status) +
            (
              this.__scmForm.value.advanceFlt == 'A'?
              (('&freq=' + JSON.stringify(this.__scmForm.value.freq.map(item => item.id)))
              + ('&trans_type_id=' + JSON.stringify(this.__scmForm.value.trxn_type.map(item => item.id)))
              + ('&amount_range=' + global.getActualVal(this.__scmForm.value.amt_rng))
              )
              : ''
            )

        )
        .pipe(
          map((x: any) => x.data),
          map((x) => {
            this.__paginate = x.links;
            return x.data.map((item) => {
              const object = { ...item };
              object.daily_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'D'
              );
              (object.daily_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'D'
              )),
                (object.weekly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                  item.sip_freq_wise_amt,
                  'F',
                  'W'
                ));
              (object.weekly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'W'
              )),
                (object.fortnightly_sip_fresh_min_amt =
                  global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'F'));
              (object.fortnightly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'F'
              )),
                (object.monthly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                  item.sip_freq_wise_amt,
                  'F',
                  'M'
                ));
              (object.monthly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'M'
              )),
                (object.quarterly_sip_fresh_min_amt =
                  global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'Q'));
              object.quarterly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'Q'
              );
              object.semi_anually_sip_fresh_min_amt =
                global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'S');
              object.semi_anually_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'S'
              );
              object.anually_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'A'
              );
              object.anually_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'A'
              );
              object.daily_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'D'
              );
              object.weekly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'W'
              );
              object.fortnightly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'F'
              );
              object.monthly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'M'
              );
              object.quarterly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'Q'
              );
              object.semi_anually_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'S'
              );
              object.anually_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'A'
              );
              object.daily_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'D'
              );
              object.weekly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'W'
              );
              object.fortnightly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'F'
              );
              object.monthly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'M'
              );
              object.quarterly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'Q'
              );
              object.semi_anually_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'S'
              );
              object.anually_swp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'A'
              );
              return object;
            });
          })
        )
        .subscribe(
          (res: any) => {
            this.setPaginator(res);
            // this.__paginate = res.links;
            this.isLoading = !this.isLoading;
          },
          (error) => {
            this.isLoading = !this.isLoading;
          }
        );
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.submit();
  }
  setPaginator(__res) {
    this.__selectScm = new MatTableDataSource(__res);
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  exportPdf() {
    this.__Rpt.downloadReport(
      '#scheme',
      {
        title: 'Scheme ',
      },
      'Scheme'
    );
  }

  outsideClick(__ev, mode) {
    if (__ev) {
      this.searchResultVisibility('none', mode);
    }
  }
  getItems(__items, __type) {
    console.log(__type);

    switch (__type) {
      case 'S':
        this.__scmForm.controls['subcat_id'].setValue(__items.id);
        this.__scmForm.controls['subcat_name'].reset(__items.subcategory_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'S');
        break;
      case 'C':
        this.__scmForm.controls['cat_id'].setValue(__items.id);
        this.__scmForm.controls['cat_name'].reset(__items.cat_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'C');
        break;
      default:
        break;
    }
  }
  searchResultVisibility(display_mode, __type) {
    console.log(__type);
    console.log(display_mode);

    switch (__type) {
      case 'S':
        this.searchsubcat.nativeElement.style.display = display_mode;
        break;
      case 'C':
        this.__searchCat.nativeElement.style.display = display_mode;
        break;
    }
  }
  sortData(sort) {
    this.__sortAscOrDsc = sort;
    this.getSchemeMst(sort.active, sort.direction);
  }
  delete(__el, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'alertdialog';
    dialogConfig.data = {
      flag: 'S',
      id: __el.id,
      title: 'Delete ' + __el.scheme_name,
      api_name: '/schemeDelete',
    };
    const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt.suc == 1) {
          this.__selectScm.data.splice(index, 1);
          this.__selectScm._updateChangeSubscription();
          this.__export.data.splice(
            this.__export.data.findIndex((x: any) => x.id == __el.id),
            1
          );
          this.__export._updateChangeSubscription();
        }
      }
    });
  }

  convertSIPDates(__sipDt) {
    //  return JSON.parse(__sipDt);
  }
  onItemClick(ev) {
    this.refreshOrAdvanceFlt();
  }
  customSort(ev) {}
  onselectItem(ev) {
    this.getSchemeMst();
  }
  getSelectedColumns(columns) {
    const clm = ['edit', 'delete'];
    this.__columns = columns.map(({ field, header }) => ({ field, header }));
    this.__exportedClmns = this.__columns
      .filter((x: any) => !clm.includes(x.field))
      .map((item) => {
        return item['field'];
      });
  }
  getSelectedItemsFromParent = (ev) => {
    this.__scmForm.controls['alt_scheme_id'].setValue(ev.item.id);
    this.__scmForm.controls['alt_scheme_name'].reset(ev.item.scheme_name, {
      emitEvent: false,
    });
    this.searchSchemeVisibility('none');
  };
}
