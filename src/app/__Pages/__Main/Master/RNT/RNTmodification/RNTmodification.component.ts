import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-RNTmodification',
  templateUrl: './RNTmodification.component.html',
  styleUrls: ['./RNTmodification.component.css']
})
export class RNTmodificationComponent implements OnInit {
  __rntForm = new FormGroup({
    rnt_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<RNTmodificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__rntForm.setValue({
        rnt_name: this.data.rnt_name,
        id: this.data.id
      });
    }
  }

  ngOnInit() {
  }
  submit() {
    if (this.__rntForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const fb = new FormData();
    fb.append("rnt_name",this.__rntForm.value.rnt_name);
    fb.append("id",this.__rntForm.value.id);

    this.__dbIntr.api_call(1, '/rntAddEdit', fb).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'RNT updated successfully' : 'RNT added successfully') : 'Something went wrong! please try again later', res.suc);
    })

  }
}
