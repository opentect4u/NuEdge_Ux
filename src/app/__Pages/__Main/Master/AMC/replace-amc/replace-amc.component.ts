import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-replace-amc',
  templateUrl: './replace-amc.component.html',
  styleUrls: ['./replace-amc.component.css']
})
export class ReplaceAMCComponent implements OnInit {
  __isVisible:boolean = false;
  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<ReplaceAMCComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
}
