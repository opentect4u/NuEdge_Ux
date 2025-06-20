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
  /**
   * @description This function is used to close the dialog
   */
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * @description This function is used to maximize the dialog
   * It updates the size of the dialog to 40% of the screen width
   * and toggles the visibility state of the dialog.
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * @description This function is used to toggle the full screen mode of the dialog
   * It updates the size of the dialog to 60% of the screen width
   * and toggles the visibility state of the dialog.
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
}
