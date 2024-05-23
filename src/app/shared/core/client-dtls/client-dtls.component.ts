import { Component, Input, OnInit, Output } from '@angular/core';
import { client } from 'src/app/__Model/__clientMst';

@Component({
  selector: 'client-dtls',
  templateUrl: './client-dtls.component.html',
  styleUrls: ['./client-dtls.component.css']
})
export class ClientDtlsComponent implements OnInit {

  private _clientDtls:Partial<client>;

  @Input()
  get clientDtls(){
      return this._clientDtls;
  }

  set clientDtls(values:Partial<client>){
    this._clientDtls = values
  }

  @Input() date: any;

  constructor() { }

  ngOnInit(): void {
  }

}
