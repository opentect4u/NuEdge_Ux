import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'merque',
  templateUrl: './merque.component.html',
  styleUrls: ['./merque.component.css']
})
export class MerqueComponent implements OnInit {

  @Input() pause_trxn_type_count:number | undefined = 0;

  @Input() type:string | undefined = '';

  @Input() number:number | undefined = 0;

  @Input() value:number | undefined = 0;

  @Input() trxn_type:string  | undefined = '';

  @Input() trxn_sub_type:string | undefined = '';


  constructor() { }

  ngOnInit(): void {
  }

}
