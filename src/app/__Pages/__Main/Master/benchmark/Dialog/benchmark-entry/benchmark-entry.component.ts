import { Component, OnInit, Inject } from '@angular/core';
// import { Ibenchmark } from '../../benchmark.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { subcat } from 'src/app/__Model/__subcategory';
import { category } from 'src/app/__Model/__category';
import { pluck, skip } from 'rxjs/operators';
import { Iexchange } from '../../../exchange/exchange.component';
import { Ibenchmark } from '../../home/home.component';
// import { Ibenchmark } from '../../home/home.component';
// import { Ibenchmark } from '../../home/home.component';

@Component({
  selector: 'app-benchmark-entry',
  templateUrl: './benchmark-entry.component.html',
  styleUrls: ['./benchmark-entry.component.css'],
})
export class BenchmarkEntryComponent implements OnInit, IDialogsize {


  // settings_category = this.__utility.settingsfroMultiselectDropdown(
  //   'id',
  //   'cat_name',
  //   'Search Category',
  //   2,
  //   140,
  //   true
  // );

  settings_subcate = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Search Sub Category',
    2,
    140,
  );
  // this.data.id > 0 ? true : false




  // sub_cat_mst_dt: <subcat>[] = [];
  sub_cat_mst_dt:(subcat & Partial<{isDisabled:boolean}>)[] = [];

  cat_mst: category[] = [];

  excg_dt: Iexchange[] = [];
  // ,[Validators.required]
  benchmarkForm = new FormGroup({
    id: new FormControl(this.data.benchmark ? this.data.benchmark.id.toString() : '0'),
    ex_id: new FormControl(this.data.benchmark ? this.data.benchmark.ex_id : '',[Validators.required]),
    benchmark: new FormControl(this.data.benchmark ? this.data.benchmark.benchmark : '',[Validators.required]),
    category_id: new FormControl('',[Validators.required]),
    // category_id: new FormControl([],{validators:[Validators.required],updateOn:'blur'}),
    // subcat_id: new FormControl(this.data.benchmark ? this.data.benchmark.subcat_id : [],[Validators.required]),

    subcat_id: new FormControl([],[Validators.required]),
    launch_date: new FormControl(this.data.benchmark ? this.data.benchmark.launch_date : '',[Validators.required]),
    base_value: new FormControl(this.data.benchmark ? this.data.benchmark.base_value : '',[Validators.required]),
    base_date:new FormControl(this.data.benchmark ? this.data.benchmark.base_date : '',[Validators.required])
  });

  __isVisible: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BenchmarkEntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }

  ngOnInit(): void {
    this.getCategoryMst();
    this.getExchange();
    /**
     * For Fire Event on change value of category
     */
     if(this.data.benchmark){
      setTimeout(() => {
        this.benchmarkForm.get('category_id').disable({
          onlySelf:true,
          emitEvent:false
        });
      this.benchmarkForm.get('category_id').setValue(this.data.benchmark.category_id,{emitEvent:true});

      this.benchmarkForm.get('subcat_id').setValue([{
          id:this.data.benchmark.subcat_id,
          subcategory_name:this.data.benchmark.subcategory_name
        }],
          {emitEvent:true});

      }, 200);
     }
     /** END */
  }

  ngAfterViewInit(): void {
    this.benchmarkForm.controls['category_id'].valueChanges.subscribe((res) => {
      this.benchmarkForm.controls['subcat_id'].setValue([]);
      if (res) {
        this.getsubCategoryMst(res);
      } else {
        this.sub_cat_mst_dt = [];
      }
    });
  }

  minimize = () => {
    this.dialogRef.updateSize('30%', '47px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  };
  maximize = () => {
    this.dialogRef.updateSize('40%');
    this.__isVisible = !this.__isVisible;
  };
  fullScreen = () => {
    this.dialogRef.updateSize('60%');
    this.__isVisible = !this.__isVisible;
  };

  save_Benchmark = () => {
    // console.log(this.benchmarkForm.value)

    let dt = Object.assign({}, this.benchmarkForm.getRawValue(),
      {
         subcat_id:this.__utility.mapIdfromArray(
          this.benchmarkForm.value.subcat_id.filter(item => Number(item.id) != Number(this.data?.benchmark?.subcat_id))
          ,
          'id')
      });
    this.__dbIntr.api_call(1,'/benchmarkAddEdit',
    this.__utility.convertFormData(dt))
    .subscribe((res:any) =>{
      this.__utility.showSnackbar(res.suc == 1 ?  'benchmark'+ (Number(this.benchmarkForm.value.id) > 0 ? ' updated ' : ' added ')+'successfully' : res.msg,res.suc);
      if(res.suc == 1){
        this.dialogRef.close(res.data);
      }
    })
  };

  getCategoryMst = () => {
    this.__dbIntr
      .api_call(0, '/category', null)
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        this.cat_mst = res;
      });
  };

  getsubCategoryMst = (cat_id: number) => {
    this.__dbIntr
      .api_call(0, '/subcatUsingPro', 'category_id=' + cat_id)
      .pipe(
        pluck('data'),
        )
      .subscribe((res:(subcat & Partial<{isDisabled:boolean}>)[]) => {
        /***
         * For Modifying array of Sub-Category
         */
          this.sub_cat_mst_dt = res.map(item =>{
            if(this.benchmarkForm.value.id != '0' && this.benchmarkForm.value.subcat_id.length > 0){
                    item.isDisabled  = this.benchmarkForm.value.subcat_id[0].id == Number(item.id);
            }
            return item;
          });
          /**
           * END
           */
      });
    // this.__dbIntr
    // .api_call(0, '/subcatUsingPro', 'arr_category_id=' + this.__utility.mapIdfromArray(cat_id,'id'))
    // .pipe(
    //   pluck('data'),
    //   )
    // .subscribe((res: subcat[]) => {
    //   this.sub_cat_mst_dt = res;
    // });
  };

  getExchange = () => {
    this.__dbIntr
      .api_call(0, '/exchange', null)
      .pipe(pluck('data'))
      .subscribe((res: Iexchange[]) => {
        this.excg_dt = res;
      });
  };

  // onDeSelect = (ev) =>{
  //   this.benchmarkForm.get('category_id').setValue(
  //    this.benchmarkForm.value.amc_id.filter(item => item.id != ev.id),
  //    {
  //     emitEvent:true
  //    }
  //   );

  // }
}

export declare interface IDialogsize {
  /**
   *  get exchnage master data
   */
  getExchange(): void;

  /**
   *  Holding sub category master data
   */
  sub_cat_mst_dt: subcat[];

  /**
   *  Holding category master data
   */
  cat_mst: category[];

  /**
   *  Holding Exchange master data
   */
  excg_dt: Iexchange[];

  /**
   *  Minimize Dialog box
   */
  minimize(): void;

  /**
   *  Maximize Dialog box
   */
  maximize(): void;

  /**
   *  FullScreen Dialog box
   */
  fullScreen(): void;

  /**
   *  for controlling the dialog box size
   */
  __isVisible: boolean;

  /**
   *  After Submit Exchange ,save into the database

   */
  save_Benchmark(): void;

  /**
   * call api for category
   * to get all category master data
   */
  getCategoryMst(): void;

  /**
   * call api for sub category
   * to get all subcategory master data according to selected category
   */
  getsubCategoryMst(cat_id: number): void;
  // getsubCategoryMst(cat_id:category[]): void;

}

export default interface IDialogData {
  flag: string;
  id: number;
  benchmark: Ibenchmark;
  title: string;
  right: number;
}
