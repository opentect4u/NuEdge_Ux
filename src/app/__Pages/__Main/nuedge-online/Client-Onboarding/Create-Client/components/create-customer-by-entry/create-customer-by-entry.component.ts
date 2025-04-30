import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-customer-by-entry',
  templateUrl: './create-customer-by-entry.component.html',
  styleUrls: ['./create-customer-by-entry.component.css']
})
export class CreateCustomerByEntryComponent implements OnInit {


  customer_entry_form: FormGroup;
  constructor(private fb: FormBuilder) { 
    this.customer_entry_form = this.fb.group({
      tax_status: ['', Validators.required],
      mode_of_holding: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }
  submitForm(){
    console.log(this.customer_entry_form?.value)
  }
}
