import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
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
  ngAfterViewInit(): void {
    const $tax_status = $('#tax_status');
    const $moh = $('#mode_of_holding');

    $tax_status.select2();
    $moh.select2();

      $tax_status.on('change', (event: any) => {
        this.customer_entry_form.get('tax_status')?.setValue(event.target.value);
        this.customer_entry_form.get('tax_status')?.markAsTouched();
      });
  
      this.customer_entry_form.get('tax_status')?.valueChanges.subscribe(value => {
        if (value !== $tax_status.val()) {
          $tax_status.val(value).trigger('change');
        }
      });

      $moh.on('change', (event: any) => {
        this.customer_entry_form.get('mode_of_holding')?.setValue(event.target.value);
        this.customer_entry_form.get('mode_of_holding')?.markAsTouched();
      });
  
      this.customer_entry_form.get('mode_of_holding')?.valueChanges.subscribe(value => {
        if (value !== $moh.val()) {
          $moh.val(value).trigger('change');
        }
      });
  }
  resetForm(): void {
    this.customer_entry_form.reset(); // Reset form group
    $('#tax_status').val('').trigger('change'); // Reset Select2 UI
    $('#mode_of_holding').val('').trigger('change'); // Reset Select2 UI
  }
}
