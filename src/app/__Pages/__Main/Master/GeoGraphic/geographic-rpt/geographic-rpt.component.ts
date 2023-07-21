import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { sort } from 'src/app/__Model/sort';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { geographicClms } from 'src/app/__Utility/Master/geogrphicClms';
import { global } from 'src/app/__Utility/globalFunc';
import { LazyLoadEvent } from 'primeng/api';
import { MatTableDataSource } from '@angular/material/table';
import { RPTService } from 'src/app/__Services/RPT.service';
import itemsPerPage from '../../../../../../assets/json/itemsPerPage.json';

@Component({
  selector: 'app-geographic-rpt',
  templateUrl: './geographic-rpt.component.html',
  styleUrls: ['./geographic-rpt.component.css']
})
export class GeographicRPTComponent implements OnInit {
  itemsPerPage=itemsPerPage
 sort = new sort();
  isOpenMegaMenu: boolean =false;
  __isPincodePending:boolean =false;
  __isVisible:boolean= true;
  __countryMst: any=[];
  __stateMst: any=[];
  __districtMst: any=[];
  __cityMst: any=[];
  __city_typeMst: any=[];
  __pincodeMst: any=[];
  displayMode_forClient:string;
  geographicMst:any=[];
  __paginate: any=[];
  __pageNumber = new FormControl('10');

   clmList = geographicClms.COLUMNS
  __columns = geographicClms.COLUMNS;
  selectedClms =  geographicClms.COLUMNS.map((x) => x.field);
  export = new MatTableDataSource([]);
  exportClms:string[] = geographicClms.COLUMNS.map((x) => x.field);
  settings_country = this.__utility.settingsfroMultiselectDropdown("id",'name','Search Country',2);
  settings_state = this.__utility.settingsfroMultiselectDropdown("id",'name','Search State',2);
  settings_dist = this.__utility.settingsfroMultiselectDropdown("id",'name','Search District',2);
  settings_city = this.__utility.settingsfroMultiselectDropdown("id",'name','Search City',2);


  constructor(
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<GeographicRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private __dbIntr: DbIntrService,
     private __Rpt: RPTService
  ) { }

  geographicForm = new FormGroup({
    country_id: new FormControl([],{updateOn:'change'}),
    state_id: new FormControl([],{updateOn:'change'}),
    city_id: new FormControl([],{updateOn:'change'}),
    district_id: new FormControl([],{updateOn:'change'}),
    pincode:new FormControl(''),
    is_all: new FormControl(false),
    city_type_id: new FormArray([]),
  })

  get city_type_id(): FormArray {
    return this.geographicForm.controls['city_type_id'] as FormArray;
  }

  checkCityType(res){
    this.city_type_id.controls.forEach(element => {
      element.get('isChecked').setValue(res,{emitEvent:false});
    });
  }

  ngAfterViewInit(){

   this.geographicForm.controls['is_all'].valueChanges.subscribe(res =>{
         this.checkCityType(res);
   })

   this.city_type_id.valueChanges.subscribe(res =>{
    const checkisCheckAll = res.every(v => v.isChecked);
    this.geographicForm.controls['is_all'].setValue(checkisCheckAll,{emitEvent:false});
   })

    this.geographicForm.controls['country_id'].valueChanges.subscribe(res =>{
          if(res.length > 0){
             this.getCountryWiseState(res);
          }
          else{
           this.__stateMst.length =0;
           this.geographicForm.controls['state_id'].setValue([],{emitEvent:true});
          }

    })

    this.geographicForm.controls['state_id'].valueChanges.subscribe(res =>{
      if(res.length > 0){
         this.getStateWiseDitrict(res);
      }
      else{
       this.__districtMst.length =0;
       this.geographicForm.controls['district_id'].setValue([],{emitEvent:true});
      }
     })


    this.geographicForm.controls['district_id'].valueChanges.subscribe(res =>{
      if(res.length > 0){
         this.getDistrictWiseCity(res);
      }
      else{
       this.__cityMst.length =0;
       this.geographicForm.controls['city_id'].setValue([],{emitEvent:true});
      }
     })

      /** Pincode Search */
      this.geographicForm.controls['pincode'].valueChanges.
      pipe(
        tap(() => this.__isPincodePending = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/pincode', dt+('&arr_city_id='+JSON.stringify(this.geographicForm.value.city_id.map(item => {return item['id']}))))
          : []),
      ).subscribe({
        next: (value: any) => {
          this.__pincodeMst = value.data;
          this.searchResultVisibility('block');
          this.__isPincodePending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isPincodePending = false;
        }

      })
      /*** End */

  }
  /** For Show/Hide Pincode searchable dropdown */
  searchResultVisibility(display_mode){
     this.displayMode_forClient = display_mode;
  }
  /*****End */
  getCountryWiseState(country_id){
    const country = country_id.map(item =>{ return item['id']});
    this.__dbIntr.callApiOnChange('/states','arr_country_id='+JSON.stringify(country)).pipe(pluck("data")).subscribe(res =>{
       this.__stateMst = res;
    })
  }
  getStateWiseDitrict(state_id){
    const state = state_id.map(item =>{ return item['id']});
    this.__dbIntr.callApiOnChange('/districts','arr_state_id='+JSON.stringify(state)).pipe(pluck("data")).subscribe(res =>{
       this.__districtMst = res;
    })
  }
  getDistrictWiseCity(dist_id){
    const district = dist_id.map(item =>{ return item['id']});
    this.__dbIntr.callApiOnChange('/city','arr_district_id='+JSON.stringify(district)).pipe(pluck("data")).subscribe(res =>{
       this.__cityMst = res;
    })
  }
  ngOnInit(): void {
    this.getCountry();
    this.getCityType();
  }
  getCityType(){
    this.__dbIntr.api_call(0,'/cityType',null).pipe(pluck('data')).subscribe((res: any) =>{
      res.forEach(element => {
         this.city_type_id.push(this.setFormControl(element))
      });
    })
  }

  setFormControl(res){
    return new FormGroup({
         id:new FormControl(res.id),
         city_type_name: new FormControl(res.name),
         isChecked: new FormControl(false)
    })
  }
  getCountry(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck("data")).subscribe(res =>{
         this.__countryMst = res;
  })
  }
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  getSelectedItemsFromParent(ev){
  this.searchResultVisibility('none');
  this.geographicForm.controls['pincode'].setValue(ev.item.pincode,{emitEvent:false});
  }
  submitgeographical(){
    const geographic = new FormData();
    geographic.append('arr_city_type_id',JSON.stringify(this.city_type_id.value.filter(x => x.isChecked).map(item => {return item['id']})))
    geographic.append('paginate',this.__pageNumber.value);
    geographic.append('field',global.getActualVal(this.sort.field));
    geographic.append('order',global.getActualVal(this.sort.order) ? this.sort.order : 1);
    geographic.append('arr_country_id',JSON.stringify(this.geographicForm.value.country_id.map(item => {return item["id"]})));
    geographic.append('arr_state_id',JSON.stringify(this.geographicForm.value.state_id.map(item => {return item["id"]})));
    geographic.append('arr_district_id',JSON.stringify(this.geographicForm.value.district_id.map(item => {return item["id"]})));
    geographic.append('arr_city_id',JSON.stringify(this.geographicForm.value.city_id.map(item => {return item["id"]})));
    geographic.append('pincode',global.getActualVal(this.geographicForm.value.pincode) ? this.geographicForm.value.pincode : '');
    this.__dbIntr.api_call(1,'/geographyDetailSearch',geographic).pipe(pluck("data")).subscribe((res: any) =>{
        this.geographicMst = res.data;
        this.__paginate = res.links;
    });
    this.exportGeographical(geographic);

  }

  exportGeographical(frmDt: FormData){
    frmDt.delete('paginate');
    this.__dbIntr.api_call(1,'/geographyExport',frmDt).pipe(pluck("data")).subscribe((res: any) =>{
           this.export =new MatTableDataSource(res);
    })

  }

  onselectItem(ev){
    this.submitgeographical();
  }
  getPaginate(paginate){
    if (paginate.url) {
      this.__dbIntr
        .getpaginationData(
          paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&order=' + global.getActualVal(this.sort.order) ? 1 : this.sort.order) +
            ('&field=' + global.getActualVal(this.sort.field)) +
            ('&arr_country_id=' + JSON.stringify(this.geographicForm.value.country_id.map(item => {return item["id"]}))) +
            ('&arr_state_id=' + JSON.stringify(this.geographicForm.value.state_id.map(item => {return item["id"]}))) +
            ('&arr_district_id=' + JSON.stringify(this.geographicForm.value.district_id.map(item => {return item["id"]}))) +
            ('&arr_city_id=' + JSON.stringify(this.geographicForm.value.city_id.map(item => {return item["id"]}))) +
            ('&pincode=' + global.getActualVal(this.geographicForm.value.pincode) ? this.geographicForm.value.pincode : '')
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.geographicMst = res.data;
          this.__paginate = res.links;
        });
    }
  }
  getSelectedColumns(columns){
     this.__columns = columns.map(({ field, header }) => ({field, header}));
     this.exportClms = columns.map((x) => x.field);
  }
  reset(){
      this.geographicForm.controls['country_id'].setValue([],{emitEvent:false});
      this.geographicForm.controls['state_id'].setValue([],{emitEvent:false});
      this.geographicForm.controls['city_id'].setValue([],{emitEvent:false});
      this.geographicForm.controls['district_id'].setValue([],{emitEvent:false});
      this.geographicForm.controls['pincode'].setValue('');
      this.checkCityType(false);
      this.__pageNumber.setValue(10);
      this.sort = new sort();
      this.submitgeographical();
  }
  customSort(ev:LazyLoadEvent){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.submitgeographical();
  }
  exportPdf(){
    this.__Rpt.downloadReport(
      '#GeoGraphicRPT',
      {
        title: 'Geographical Report - ' + new Date().toLocaleDateString(),
      },
      'Geographical Report',
      'p'
    );
  }
}
