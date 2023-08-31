import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/mrg_rplce_acq.json';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu = menu;
  constructor(
    private utility:UtiliService,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
  }
 getItems = (ev) =>{
    this.utility.navigate((ev.url+'/'+this.route.snapshot.params.id),btoa(ev.flag));
  }
}
