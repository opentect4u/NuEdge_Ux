/// <reference lib="webworker" />

// import { global } from "src/app/__Utility/globalFunc";
import moment from 'moment';

addEventListener('message', ({ data }) => {
    console.log(data)
    let  all_amount_arr = [...(data.res.map(el => el.xirr_amt_arr))];
    let  all_date_arr = [...data.res.map(el =>el.xirr_date_arr)];
    const xirr_amt_arr = [...all_amount_arr.reduce((acc, val) => acc.concat(val), []),Number(data.footerDT?.AUM).toFixed(2)];
    const xirr_date_arr = [...all_date_arr.reduce((acc, val) => acc.concat(val), []),data.date];
    const xirr = XIRR(xirr_amt_arr,xirr_date_arr,0)
    postMessage(xirr);
 });

function XIRR(values, dates, guess) {
    var irrResult = function(values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      values.forEach((el,i) =>{
        if(i>0){
         result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
       }
      })
      return result;
    }

    // Calculates the first derivation
    var irrResultDeriv = function(values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      values.forEach((el,i) =>{
        if(i>0){
        var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      })
      return result;
    }

    var guess = (typeof guess === 'undefined') ? 0.1 : guess;
    var resultRate = guess;
    var epsMax = 1e-10;
    var iterMax = 20;
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    } while(contLoop && (++iteration < iterMax));
    if(contLoop)return 0;
    return resultRate;
  }


  