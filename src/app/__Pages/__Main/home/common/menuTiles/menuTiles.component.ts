import { Component, Input, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'home-menuTiles',
  templateUrl: './menuTiles.component.html',
  styleUrls: ['./menuTiles.component.css']
})
export class MenuTilesComponent implements OnInit {
  @Input() __items: any = [];
  @Input() __flag:string;
  constructor(private  __utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(__items){
   console.log(__items);
    if(this.__flag == 'BM'){
      if(__items.url){
        this.__utility.navigate(__items.url);
      }
    }
  }
}
