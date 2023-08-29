import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Ibenchmark, benchmarkClmns } from '../../benchmark.component';
import { map, pluck } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Iexchange } from '../../../exchange/exchange.component';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { column } from 'src/app/__Model/tblClmns';
import { BenchmarkEntryComponent } from '../benchmark-entry/benchmark-entry.component';
import { global } from 'src/app/__Utility/globalFunc';
import { sort } from 'src/app/__Model/sort';

@Component({
  selector: 'app-benchmark-report',
  templateUrl: './benchmark-report.component.html',
  styleUrls: ['./benchmark-report.component.css']
})
export class BenchmarkReportComponent implements OnInit {
     /**
   * Setting of multiselect dropdown
   */
  pagination: any = [];
  paginate:string = '10';
  settingsforExDropdown= this.__utility.settingsfroMultiselectDropdown(
    'id',
    'ex_name',
    'Search Exchange',
    2
  );

  settingsforCatDropdown= this.__utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Search Category',
    2
  );

  settingsforSubCatDropdown= this.__utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Search Sub category',
    2
  );
  settingsforbenchmarkDropdown= this.__utility.settingsfroMultiselectDropdown(
    'id',
    'benchmark',
    'Search Benchmark',
    2
  );
  __isVisible:boolean = false;

   benchmark:Ibenchmark[] = [];

   exchange:Iexchange[] = [];

   category:category[] = [];

   subcategory:subcat[] = [];

   column:column[] = benchmarkClmns.column;

   sort = new sort();

   benchmarkMstDt:Ibenchmark[] = [];

   benchmarkfilterForm = new FormGroup({
     ex_id:new FormControl([]),
     category_id:new FormControl([],{updateOn:'blur'}),
     subcategory_id: new FormControl([],{updateOn:'blur'}),
     benchmark_id:new FormControl([])
   })

   constructor(
    public dialogRef: MatDialogRef<BenchmarkReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number,right:string},
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.getexchange();
    this.getcategory();
    this.getBenchmarkMstDt();
  }

  getBenchmarkMstDt = () =>{
    const benchmark = new FormData();
    benchmark.append('paginate',this.paginate);
    benchmark.append('ex_id',JSON.stringify(this.benchmarkfilterForm.value.ex_id.map(el => el.id)))
    benchmark.append('category_id',JSON.stringify(this.benchmarkfilterForm.value.category_id.map(el => el.id)))
    benchmark.append('subcategory_id',JSON.stringify(this.benchmarkfilterForm.value.subcategory_id.map(el => el.id)))
    benchmark.append('benchmark_id',JSON.stringify(this.benchmarkfilterForm.value.benchmark_id.map(el => el.id)))
    benchmark.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    benchmark.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
    this.__dbIntr.api_call(1,'/benchmarkDetailSearch',benchmark)
     .pipe(pluck('data'))
     .subscribe((res: any) =>{
      this.benchmarkMstDt = res.data;
      this.pagination = res.links;
     })
  }


  getbenchmarkaccordingcat_subcat = (cat:category[],subcat:subcat[]) =>{

    if(cat.length > 0 && subcat.length > 0){
    this.__dbIntr.api_call(0,'/benchmark','arr_cat_id='+
    this.__utility.mapIdfromArray(cat,'id')
    + '&arr_sub_cat_id='+this.__utility.mapIdfromArray(subcat,'id')
    ).pipe(pluck('data'))
    .subscribe((res:Ibenchmark[])=>{
      console.log(res);
      this.benchmark = res;
    })}
    else{
      this.benchmark = [];
      this.benchmarkfilterForm.get('benchmark_id').setValue([]);
    }
  }


  getexchange = () =>{
  this.__dbIntr.api_call(0,'/exchange',null).pipe(pluck('data'))
  .subscribe((res:Iexchange[]) =>{
    this.exchange = res;
  })
  }

  getcategory = () =>{
    this.__dbIntr.api_call(0,'/category',null).pipe(pluck('data'))
  .subscribe((res:category[]) =>{
    this.category = res;
  })
  }

  getsubcategory = (cat_id:category[]) =>{
    if(cat_id.length > 0){
    this.__dbIntr.api_call(0,'/subcategory', 'arr_cat_id=' + this.__utility.mapIdfromArray(cat_id,'id')).pipe(pluck('data'))
    .subscribe((res:subcat[]) =>{
      this.subcategory = res;
    })}
    else{
      this.subcategory = [];
      this.benchmarkfilterForm.controls['subcategory_id'].setValue([]);
    }
  }

  ngAfterViewInit(){
    this.benchmarkfilterForm.controls['category_id'].valueChanges.subscribe(res =>{
      this.getsubcategory(res);
      // this.getbenchmarkaccordingcat_subcat(res,this.benchmarkfilterForm.value.subcategory_id,);
    })
    this.benchmarkfilterForm.controls['subcategory_id'].valueChanges.subscribe(res =>{
      this.getbenchmarkaccordingcat_subcat(this.benchmarkfilterForm.value.category_id,res);
    })
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

  oncatDeSelect = (ev) =>{
    this.benchmarkfilterForm.get('category_id').setValue(this.benchmarkfilterForm.value.category_id.filter(item => item.id != ev.id));
   }
   onexDeSelect = (ev) =>{
    this.benchmarkfilterForm.get('ex_id').setValue(this.benchmarkfilterForm.value.ex_id.filter(item => item.id != ev.id));
   }

   onsubcatDeSelect = (ev) =>{
    this.benchmarkfilterForm.get('subcategory_id').setValue(this.benchmarkfilterForm.value.subcategory_id.filter(item => item.id != ev.id));
   }

   onbenchmarkDeSelect = (ev) =>{
    this.benchmarkfilterForm.get('benchmark_id').setValue(this.benchmarkfilterForm.value.benchmark_id.filter(item => item.id != ev.id));
   }

   getColumns = () =>{
    return this.__utility.getColumns(this.column);
  }

  populateDT = (benchmark:Ibenchmark) =>{
    // console.log(benchmark);
 this.openEntryDialog(benchmark,benchmark.id);
  }
  openEntryDialog = (benchmark:Ibenchmark,id:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'BENCH',
      id: id,
      benchmark: benchmark,
      title: id == 0 ? 'Add Benchmark' : 'Update Benchmark',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        BenchmarkEntryComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          this.updateRow(dt);
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'BENCH',
      });
    }
  }

  updateRow = (item:Ibenchmark) =>{
  this.benchmarkMstDt = this.benchmarkMstDt.map(el =>
    el.id == item.id ? item : el
  );
  }

  customSort = (ev) =>{
    this.sort = ev;
    this.getBenchmarkMstDt();
  }
  onSelectItem = (item) =>{
    this.paginate = item;
    this.getBenchmarkMstDt();
  }
  getPaginate = (paginate) =>{
  if (paginate.url) {
    this.__dbIntr
      .getpaginationData(
        paginate.url +
          ('&paginate=' +
            this.paginate +
            '&ex_id=' +
            JSON.stringify(this.benchmarkfilterForm.value.ex_id.map(el => el.id)))
            +'&category_id='+
            JSON.stringify(this.benchmarkfilterForm.value.category_id.map(el => el.id))
            +'&subcategory_id='+
            JSON.stringify(this.benchmarkfilterForm.value.subcategory_id.map(el => el.id))
            +'&benchmark_id='+
            JSON.stringify(this.benchmarkfilterForm.value.benchmark_id.map(el => el.id))
            +'&field='+
            (global.getActualVal(this.sort.field) ? this.sort.field : '')
            +'&order'+
            (global.getActualVal(this.sort.order) ? this.sort.order : '')
      )
      .pipe(
        pluck('data'),
        map((item: { data: Ibenchmark[]; links: any }) => {
                 console.log(item.data);
                 this.pagination = item.links;
                 this.benchmarkMstDt = item.data;
                 console.log(item.links);
        })
      )
      .subscribe((res) => {
        // Nothing to deal with in here
        // as i take the data and modify the data before subscribe
        // console.log(this.FileMstData);
      });
  }
  }
  exportPdf = () =>{

  }
}
