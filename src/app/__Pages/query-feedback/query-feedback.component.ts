import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-query-feedback',
  templateUrl: './query-feedback.component.html',
  styleUrls: ['./query-feedback.component.css']
})
export class QueryFeedbackComponent implements OnInit {

  feedbackForm = new FormGroup({
    investor_name:new FormControl(''),
    investor_email:new FormControl(''),
    rating: new FormArray([]),
    feedback: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }
  submitFeedback(){
      console.log(this.feedbackForm.value)
  }

}
