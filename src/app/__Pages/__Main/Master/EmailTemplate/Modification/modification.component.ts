import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'modification-component',
  templateUrl: './modification.component.html',
  styleUrls: ['./modification.component.css'],
})
export class ModificationComponent implements OnInit {
  __isVisible: boolean = false;

  __emailTemplate = new FormGroup({
    event: new FormControl(this.data.id > 0 ? this.data.items.event : '', [Validators.required]),
    subject: new FormControl(this.data.id > 0 ? this.data.items.subject : '', [Validators.required]),
    body: new FormControl(this.data.id > 0 ? this.data.items.body : '', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<ModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log(this.data.id);

  }
  minimize() {
    this.dialogRef.updateSize('30%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.updateSize('40%');
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.updateSize('60%');
    this.__isVisible = !this.__isVisible;
  }
  submitEmailTemplate() {
    console.log(this.__emailTemplate.value);
    const fb = new FormData();
    fb.append('event', this.__emailTemplate.value.event);
    fb.append('subject', this.__emailTemplate.value.subject);
    fb.append('body', this.__emailTemplate.value.body);
    fb.append('id', this.data.id);


    this.__dbIntr.api_call(1, '/emailAddEdit', fb).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(
        res.suc == 1
          ? 'Email template ' +
              (this.data.id > 0 ? 'update' : 'created') +
              ' successfully'
          : 'Submittion failed',
        res.suc
      );
    });
  }
}
