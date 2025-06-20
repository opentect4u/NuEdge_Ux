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

  /**
   * * * This function is responsible for fetching the disclaimer data from the server.
   * * * It makes an API call to retrieve the disclaimer information and populates the disclaimer 
   */
  getDisclaimer = () =>{
      this.__dbIntr.api_call(0,'/disclaimer',null).pipe(pluck('data'))
      .subscribe((res:Partial<IDisclaimer>[]) =>{
          if(res.length > 0){
           res.forEach((element:Partial<IDisclaimer>,index:number) =>{
                this.disclaimer.push(this.setDisclaimer(element));
                this.disclaimer.at(index).get('dis_for').disable();
           })}
           else{
            this.disclaimer.push(this.setDisclaimer(null))
           }
           console.log(this.disclaimer)
      },
      err =>{
        this.disclaimer.push(this.setDisclaimer(null))
      }
    )
  }

  /**
   * * * This getter function returns the FormArray of disclaimers from the disclaimer_form.
   * * * It allows access to the disclaimer array in the template for rendering and manipulation.
   * * @returns FormArray - The FormArray containing disclaimer form controls.
   */
  get disclaimer():FormArray{
    return this.disclaimer_form.get('disclaimer') as FormArray
  }

  /***
   * * * This function is used to create a new FormGroup for a disclaimer item.
   * * * It initializes the form controls with default values or values from the provided item.
   * * * @param item - An optional Partial<IDisclaimer> object to prepopulate the form controls.
   * * @returns FormGroup - The newly created FormGroup for the disclaimer item.
   */
  setDisclaimer = (item:Partial<IDisclaimer>) =>{
    return new FormGroup({
      id:new FormControl(item ? item.id : 0),
      dis_for: new FormControl(item ? item.dis_for : '',[Validators.required]),
      dis_des: new FormControl(item ? item.dis_des : '',[Validators.required]),
      font_size: new FormControl(item?.font_size ? item?.font_size : 8),
      color_code: new FormControl(item?.color_code ? item?.color_code : '#000000')
    })
  }

  /**
   *  * * This function is responsible for adding or updating a disclaimer in the database.
   * * * It takes an index and a disclaimer object as parameters, checks if the form is valid,
   * * * and then constructs a FormData object to send the data to the server.
   * * * If the operation is successful, it updates the form control with the returned ID and displays a success message. 
   * * @param index - The index of the disclaimer in the FormArray.
   * * @param disclaimer - The disclaimer object containing the details to be added or updated.
   * * @returns void
   */
  addDisclaimer =(index:number,disclaimer:Required<IDisclaimer>) =>{
    // console.log(disclaimer);
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

  /**
   * * * This function is used to remove a disclaimer from the FormArray.
   * * * It takes an index as a parameter and removes the corresponding disclaimer form control from
   * * * the FormArray.
   * * @param index - The index of the disclaimer to be removed from the FormArray.
   * * @returns void
   * * @memberof DisclaimerComponent
   * * @description
   * * This function is responsible for removing a disclaimer from the FormArray.
   * * * It updates the FormArray by removing the form control at the specified index.
   */
  addDisclaimerForm = () =>{
      this.disclaimer.push(this.setDisclaimer(null));
  }

}

export interface IDisclaimer{
  id:number;
  dis_for:string;
  dis_des:string;
  font_size:number;
  color_code:string;
}
