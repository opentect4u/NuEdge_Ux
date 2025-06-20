import { Component, EventEmitter, OnInit, Output,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
declare var $: any;
@Component({
  selector: 'app-create-customer-by-entry',
  templateUrl: './create-customer-by-entry.component.html',
  styleUrls: ['./create-customer-by-entry.component.css']
})
export class CreateCustomerByEntryComponent implements OnInit {

  @Output() sendEntry = new EventEmitter();

  @Input() md_taxStatus:any = []; 
  @Input() md_clientHolding:any = [];
  customer_entry_form: FormGroup;
  constructor(private fb: FormBuilder) { 
    this.customer_entry_form = this.fb.group({
      tax_status: ['', Validators.required],
      mode_of_holding: ['', [Validators.required]]
    });
  }
  

  ngOnInit(): void {
  }




  /**
   * @description This function is used to submit the form data
   * It emits the form value through the sendEntry event emitter.
   * The form value is logged to the console for debugging purposes.
   * 
   * @returns void
   */
  submitForm(){
    console.log(this.customer_entry_form?.value);
    this.sendEntry.emit(this.customer_entry_form?.value);
  }
  ngAfterViewInit(): void {
    const $tax_status = $('#tax_status');
    const $moh = $('#mode_of_holding');

    $tax_status.select2();
    $moh.select2();

      $tax_status.on('change', (event: any) => {
        this.customer_entry_form.get('tax_status')?.setValue(event.target.value);
        this.customer_entry_form.get('tax_status')?.markAsTouched();
        if(event.target.value != '11' 
          && event.target.value != '21'
          && event.target.value != '22'
          && event.target.value != '37'
          && event.target.value != '1'){
            // this.customer_entry_form.get('mode_of_holding')?.setValue('S',{emitEvent:true});
            $moh.prop('disabled',true);
            $moh.val(1).trigger('change');
          }
          else{
            // this.customer_entry_form.get('mode_of_holding')?.setValue('',{emitEvent:true});
            $moh.prop('disabled',false);
            $moh.val('').trigger('change');

          }
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
  /**
   * @description This function is used to reset the form
   * It resets the form group and also resets the Select2 UI elements for tax status and mode of holding.
   * 
   * @returns void
   */
  resetForm(): void {
    this.customer_entry_form.reset(); // Reset form group
    $('#tax_status').val('').trigger('change'); // Reset Select2 UI
    $('#mode_of_holding').val('').trigger('change'); // Reset Select2 UI
  }
}
