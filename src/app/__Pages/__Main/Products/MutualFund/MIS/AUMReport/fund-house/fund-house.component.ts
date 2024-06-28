import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-fund-house',
  templateUrl: './fund-house.component.html',
  styleUrls: ['./fund-house.component.css']
})
export class FundHouseComponent implements OnInit {

  constructor(private dbIntr:DbIntrService) { }

  ngOnInit(): void {
  }

  getFormData =(ev) =>{
      console.log(ev);
      var formdata = new FormData();
      for(let key in ev){
        formdata.append(key,ev[key])
      }
      this.dbIntr.api_call(1,'/clients/aum',formdata).pipe(pluck('data')).subscribe(res =>{
          console.log(res);
      })

  }

}
