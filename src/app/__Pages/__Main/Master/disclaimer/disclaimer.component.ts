import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit {

  disclaimer_form = new FormGroup({
    disclaimer:new FormArray([])
  })

  // disclaimer_arr:Partial<IDisclaimer>[] = [];

  constructor(private __dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    // this.disclaimer_arr.forEach(element =>{
    //    this.disclaimer.push(this.setDisclaimer(element))
    // })
    this.getDisclaimer();
  }

  getDisclaimer = () =>{
      this.__dbIntr.api_call(0,'/disclaimer',null).pipe(pluck('data'))
      .subscribe((res:Partial<IDisclaimer>[]) =>{
          if(res.length > 0){
           res.forEach((element:Partial<IDisclaimer>,index:number) =>{
                this.disclaimer.push(this.setDisclaimer(element));
                this.disclaimer.at(index).get('dis_for').disable();
                console.log(this.disclaimer.at(index))
           })}
           else{
            this.disclaimer.push(this.setDisclaimer(null))
           }
      },
      err =>{
        this.disclaimer.push(this.setDisclaimer(null))
      }
    )
  }

  get disclaimer():FormArray{
    return this.disclaimer_form.get('disclaimer') as FormArray
  }

  setDisclaimer = (item:Partial<IDisclaimer>) =>{
    return new FormGroup({
      id:new FormControl(item ? item.id : 0),
      dis_for: new FormControl(item ? item.dis_for : '',[Validators.required]),
      dis_des: new FormControl(item ? item.dis_des : '',[Validators.required])
    })
  }

  addDisclaimer =(index:number,disclaimer:Required<IDisclaimer>) =>{
   if(this.disclaimer.at(index).invalid){
    return;
   }
    var disclaimer_payload = new FormData();
    for ( var key in disclaimer ) {
      disclaimer_payload.append(key, disclaimer[key]);
    }
        this.__dbIntr.api_call(1,'/disclaimerAddEdit',disclaimer_payload)
        .pipe(pluck('data'))
        .subscribe((res:Required<IDisclaimer>) =>{
              this.disclaimer.at(index).patchValue({id:res.id})
              this.disclaimer.at(index).get('dis_for').disable();
              this.utility.showSnackbar(`Disclaimer ${disclaimer.id > 0 ? 'updated ' : 'added '}successfully`,1);
        })
  }

  addDisclaimerForm = () =>{
      this.disclaimer.push(this.setDisclaimer(null));
  }

}

export interface IDisclaimer{
  id:number;
  dis_for:string;
  dis_des:string;
}
