import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'home-menuTiles',
  templateUrl: './menuTiles.component.html',
  styleUrls: ['./menuTiles.component.css']
})
export class MenuTilesComponent implements OnInit {
  @Input() __items: any = [];
  @Input() __flag:string;
  constructor() { }

  ngOnInit() {
  }

}
