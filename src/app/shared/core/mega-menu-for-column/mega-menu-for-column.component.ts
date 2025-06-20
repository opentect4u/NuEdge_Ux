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
    console.log(res);
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
      console.log('***********ASDASDASDASDA***********')
      console.log(res)
      console.log('***********END***********')
      this.getSelectedColumns.emit(res.filter((x: any) => x.isChecked));
    })
    this.clmFrm.controls['is_all'].valueChanges.subscribe(res =>{
            this.clmItems.controls.forEach(el =>{el.get('isChecked').setValue(res,{emitEvent:false})});
           this.getSelectedColumns.emit(this.clmItems.value.filter((x: any) => x.isChecked));

    })
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  /**
   * @description This function is used to get the form array of column items
   * It returns the 'clmItems' form array from the 'clmFrm' form group.
   * This form array contains the individual column items with their properties.
   * 
   * @returns {FormArray} - The form array of column items.
   */
  get clmItems() {
    return this.clmFrm.controls.clmItems as FormArray;
  }
  /**
   * @description This function is used to add checkboxes for each column in the column list
   * It iterates through the 'ColumnList' and creates a form control for each column  
   */
  addcheckColumn(selectedColumns){
    this.ColumnList.forEach((el) =>{
      this.clmItems.push(this.setClmCtrl(
        selectedColumns.includes(el.field),
        el.header,
        el.field,
        el.width
      ));
    });
    this.clmFrm.get('is_all').setValue((this.ColumnList.length == this.clmItems.value.filter(x => x.isChecked).length),{emitEvent:false});
      
  }
  /**
   * @description This function is used to create a form group for each column control
   * It takes the parameters 'isChecked', 'clmName', 'id', and 'width' to create a form group
   * @param {boolean} isChecked - Indicates whether the column is checked or not
   * @param {string} clmName - The name of the column
   * @param {string} id - The unique identifier for the column
   * @param {number} width - The width of the column
   * @returns {FormGroup} - A form group containing the column control properties
   */
  setClmCtrl(isChecked,clmName,id,width){
   return new FormGroup({
    isChecked:new FormControl(isChecked),
    name:new FormControl(clmName),
    field:new FormControl(id),
    header:new FormControl(clmName),
    id:new FormControl(id),
    width:new FormControl(width)
   })
  }
  /**
   * @description This function is used to toggle the 'is_all' checkbox
   * It sets the value of the 'is_all' checkbox to false when called.
   * This is typically used to hide the mega menu when the user clicks outside of it.
   * 
   * @returns void
   */
  hideMenu(){
    this.hideMegamenu.emit(false);
  }
}
