import { Component,OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'Pages-Auth',
  templateUrl: './Auth.component.html',
  styleUrls: ['./Auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private __utility:UtiliService,
  ) { }

  ngOnInit() {
    this.__utility.destroyScript();
  }

}
