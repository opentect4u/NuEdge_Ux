import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Iexchange } from '../../exchange.component';


@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit,IDialogsize {

  __isVisible: boolean = false;

  exchangeFrm = new FormGroup({
  id:new FormControl(this.data.exchange ? this.data.exchange.id : '0'),
  ex_name:new FormControl(this.data.exchange ? this.data.exchange.ex_name : '',[Validators.required])
  })

  constructor(
    public dialogRef: MatDialogRef<EntryComponent>,
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
    console.log(this.data);
  }
  minimize = () => {
    this.__isVisible = !this.__isVisible;
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize = () => {
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen = () => {
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }

  save_Exchange = () =>{
    this.__dbIntr.api_call(1,'/exchangeAddEdit',this.__utility.convertFormData(this.exchangeFrm.value))
    .subscribe((res:any) =>{
        this.__utility.showSnackbar(
          (res.suc == 1 ? 'Exchange' + (Number(this.exchangeFrm.value.id) > 0 ? ' updated ' : ' added ') +  'successfully' : res.msg)
        ,res.suc);
        if(res.suc  == 1){
          this.dialogRef.close(res.data)
        }
    })
  }
}

export declare interface IDialogsize{

  /**
   *  Minimize Dialog box
   */
  minimize():void;

  /**
   *  Maximize Dialog box
   */
  maximize():void;

  /**
   *  FullScreen Dialog box
   */
  fullScreen():void;

  /**
   *  for controlling the dialog box size
   */
  __isVisible:boolean;

  /**
   *  After Submit Exchange ,save into the database
   */
    save_Exchange():void
}

export default interface IDialogData{
      flag: string,
      id: number,
      exchange: Iexchange,
      title: string,
      right: number,
}

