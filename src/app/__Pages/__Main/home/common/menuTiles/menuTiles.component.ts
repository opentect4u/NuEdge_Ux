import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import moment from 'moment';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'home-menuTiles',
  templateUrl: './menuTiles.component.html',
  styleUrls: ['./menuTiles.component.css']
})
export class MenuTilesComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('op') Overlay__pannel:OverlayPanel
  @Input() __items: any = [];
  @Input() __flag:string;
  chart_dtls:Required<{categories:string[],chart_data:number[],title:string}>;
  tiles__api__subscription:Subscription;
  constructor(private  __utility: UtiliService,private dbIntr:DbIntrService) { }

  ngOnInit() {
  }
  navigate(__items){
    // console.log(this.__flag)
    if(this.__flag == 'BM'){
      if(__items.url){
        this.__utility.navigate(__items.url);
      }
    }
  }

  ngAfterViewInit(): void {
  }
  showReport = (item) =>{
    this.chart_dtls = null;
     if(item.flag == 'L'){
      // if(this.tiles__api__subscription){
      //   this.tiles__api__subscription.unsubscribe();
      // }
      this.tiles__api__subscription = this.dbIntr.api_call(0,'/showLiveSIPTrend','flag='+item.flag,true)
      .pipe(pluck('data'))
      .subscribe((res:Required<{categories:string[],chart_data:number[]}>) =>{
          let val = 0;
          let dt = {
            categories: res.categories,
          //   chart_data:res.chart_data.reverse().map((item:number) =>{
          //      val = val + item
          //      return val
          // }).reverse()
            chart_data:res.chart_data,
            title:"Live SIP"
        }
          this.chart_dtls = dt;
      },
       err =>{
        this.chart_dtls = {
          categories:[],
          chart_data:[],
          title:'Live SIP'
        }
       })
    }
    else if(item.flag == 'C'){
      this.tiles__api__subscription = this.dbIntr.api_call(0,'/showCurrAumTrend',
        'flag='+item.flag,true)
      .pipe(pluck('data'))
      .subscribe((res:any) =>{
          console.log(res);
          let chart_data = [];
          const categories = Object.keys(res?.data).map(key => moment(key).format('MMM-YYYY'));
          Object.keys(res?.data).forEach(key =>{
              console.log(key);
              chart_data.push(Number(res?.data[key]))
          });
          console.log(chart_data);
          this.chart_dtls = {
            categories:categories.reverse(),
            chart_data:chart_data.reverse(),
            title:"AUM"
          }
      },
       err =>{
        this.chart_dtls = {
          categories:[],
          chart_data:[],
          title:'AUM'
        }
       })
    }
    // console.log(item);
    // if(item.flag == 'C'){
    //     this.getIpAddress();
    // }
  }

  // getIpAddress = () =>{
  //   this.dbIntr.api_call(0,'/getip',null).subscribe(res =>{
  //         console.log(res);
  //   })
  // }

  ngOnDestroy(): void {
    // this.tiles__api__subscription.unsubscribe();
  }
}
