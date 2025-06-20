import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements OnInit {
  __isVisible:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DocViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data.attachments);
  }

  /**
   * @description This function is used to close the dialog
   * It updates the size of the dialog to 30% width and 47px height,
   */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * @description This function is used to maximize the dialog
   * It updates the size of the dialog to 40% width and toggles the visibility state of the dialog.
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * @description This function is used to toggle the full screen mode of the dialog
   * It updates the size of the dialog to 60% width and toggles the visibility state of the dialog.
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }

}
