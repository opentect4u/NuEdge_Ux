import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'core-snkbar',
  templateUrl: './snkbar.component.html',
  styleUrls: ['./snkbar.component.css']
})
export class SnkbarComponent implements OnInit {

  constructor(
    public __snkRef: MatSnackBarRef<SnkbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngOnInit() {

  }

}
