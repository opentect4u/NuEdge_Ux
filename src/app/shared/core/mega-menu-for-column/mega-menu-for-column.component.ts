import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'core-mega-menu-for-column',
  templateUrl: './mega-menu-for-column.component.html',
  styleUrls: ['./mega-menu-for-column.component.css'],
})
export class MegaMenuForColumnComponent implements OnInit,AfterContentChecked {
  @Output() hideMegamenu = new EventEmitter<any>();
  @Output() getSelectedColumns = new EventEmitter<any>();
  @Input() isOpenMegaMenu: boolean = false; /** For Hide or Show Mega menu for checkbox  */
  @Input() ColumnList: any =[]; /** For Hodling all columns */
  @Input() set selectedClmns(res){
    this.clmItems.clear({emitEvent:false});
    this.addcheckColumn(res);
}
  clmFrm = new FormGroup({
    is_all: new FormControl(false),
    clmItems: new FormArray([])
  })
  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.clmItems.valueChanges.subscribe(res =>{
      this.getSelectedColumns.emit(res.filter((x: any) => x.isChecked));
    })
    this.clmFrm.controls['is_all'].valueChanges.subscribe(res =>{
            this.clmItems.controls.forEach(el =>{el.get('isChecked').setValue(res,{emitEvent:false});})
    })
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  get clmItems() {
    return this.clmFrm.controls.clmItems as FormArray;
  }
  addcheckColumn(selectedColumns){
    this.ColumnList.forEach((el) =>{
      this.clmItems.push(this.setClmCtrl(
        selectedColumns.includes(el.field),
        el.header,
        el.field
      ));
    });
    this.clmFrm.get('is_all').setValue((this.ColumnList.length == this.clmItems.value.filter(x => x.isChecked).length),{emitEvent:false});
  }
  setClmCtrl(isChecked,clmName,id){
   return new FormGroup({
    isChecked:new FormControl(isChecked),
    name:new FormControl(clmName),
    field:new FormControl(id),
    header:new FormControl(clmName),
    id:new FormControl(id)
   })
  }
  hideMenu(){
    this.hideMegamenu.emit(false);
  }
}
