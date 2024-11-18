import { Component, OnInit } from '@angular/core';
import { AU_TK } from 'src/app/strings/localStorage_key';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  hasStorage = localStorage.getItem(AU_TK)

  constructor() { }

  ngOnInit(): void {}

}
