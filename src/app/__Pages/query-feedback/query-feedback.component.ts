import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-query-feedback',
  templateUrl: './query-feedback.component.html',
  styleUrls: ['./query-feedback.component.css']
})
export class QueryFeedbackComponent implements OnInit {

  feedbackForm = new FormGroup({
    investor_name:new FormControl('',[Validators.required]),
    investor_email:new FormControl('',[Validators.email]),
    rating: new FormControl('',[Validators.required]),
    query_feedback: new FormControl(''),
    query_id:new FormControl(''),
    color_code:new FormControl(''),
    enc_query_id:new FormControl(''),
    suggestion:new FormControl(''),
  });

  emojiDtls = [
    {
      id:1,
      emoji_type:"Very Poor",
      emoji:"VerryPoor.png",
      emoji_value:1,
      selected_color:"#c4232f",
      activeBgColor:"rgb(218 111 84 / 10%)"
    },
    {
      id:2,
      emoji_type:"Poor",
      emoji:"Poor.png",
      emoji_value:2,
      selected_color:"#bc326e",
      activeBgColor:"rgb(184 36 105 / 10%)"
    },
    {
      id:3,
      emoji_type:"Avarage",
      emoji:"Avarage.png",
      emoji_value:3,
      selected_color:"#3d3dfe",
      activeBgColor:"rgb(0 0 247 / 10%)"
    },
    {
      id:4,
      emoji_type:"Good",
      emoji:"Good.png",
      emoji_value:4,
      selected_color:"#fcdc01",
      activeBgColor:"rgb(251 234 13 / 10%)"
    },
    {
      id:5,
      emoji_type:"Excellent",
      emoji:"Excellent.png",
      emoji_value:5,
      selected_color:"#3ea52a",
      activeBgColor:"rgb(62 165 42 / 10%)"
    }
  ]

  constructor(private rtDt: ActivatedRoute,
    private router:Router,
    private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    this.rtDt.params.subscribe(res =>{
      this.feedbackForm.get('enc_query_id').setValue(res.query_id);
      if(res.query_id){
        this.fetchQueryDetails(res.query_id);
      }
      else{
        this.router.navigate(['not-found']);
      }
    })
  }
  submitFeedback(){
      if(this.feedbackForm.invalid){
        this.utility.showSnackbar(
            'Validation Error',2
        );
        return ;
      }
      // const {color_code,query_id,rest} = this.feedbackForm.value;
      this.dbIntr.api_call(1,'/cus_service/queryFeedback',this.utility.convertFormData(this.feedbackForm.value))
      .subscribe((res:any) =>{
          this.utility.showSnackbar(
            res.suc == 1 ? 'Thanks for your feedback!!!' : 'Err!!Something went wrong',
            res.suc
          );
          // if(res.suc == 1){
          //   this.feedbackForm.patchValue({
          //     feedback:'',
          //     rating:'',
          //     suggestion:''
          //   })
          // }
      })
  }

  fetchQueryDetails = (query_id:string) =>{
    // eyJpdiI6IlViYk5XRythYjFwVTltTy9KYnJaZ1E9PSIsInZhbHVlIjoiSUlLMFgyY3prL0kvMktRcC93WVFDUmwzMGxCWDcyTU1qWlY0dUVkbTdzMD0iLCJtYWMiOiIxODczYjBjZDQwOGI5Njc1NGMzY2YyYzg2YWM0NmExZGMxMjRmYzA0ZTAzZjA3YTkzOGY3ZGQ5ODc4ZTAwNjVlIiwidGFnIjoiIn0=
    this.dbIntr.api_call(1,`/cus_service/queryShowDetails?query_id=${query_id}`,null)
    .pipe(pluck('data'))
    .subscribe((res:any) =>{
      this.feedbackForm.patchValue({
        query_id:res?.query_id,
        investor_name:res ? res?.investor_name : '',
        investor_email:res ? res?.investor_email : '',
        rating:res ? res?.rating : '',
        query_feedback:res ? res?.query_feedback : '',
        color_code:res ? res?.color_code : '',
        suggestion:res ? res?.suggestion : '',
      });
      this.feedbackForm.get('investor_name').disable();
      this.feedbackForm.get('investor_email').disable();
    })
}

  selectEmoji(emoji){
      console.log(emoji);
      this.feedbackForm.get('rating').setValue(emoji.emoji_value);
      console.log(this.feedbackForm.get('rating').value);
  }

}
