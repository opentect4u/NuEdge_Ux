/// <reference lib="webworker" />

// import { global } from "src/app/__Utility/globalFunc";
import moment from 'moment';

addEventListener('message', ({ data }) => {
    // console.log(data)
  const res = data.res;
  const spliceDT = data.res.slice(data.start,data.length);
  let dt = res.map(el => {
              const XIRRCalc = XIRR(el.xirr_amt_arr,el.xirr_date_arr,0);
              const actualXirr = XIRRCalc ? (isFinite(XIRRCalc) && XIRRCalc ? XIRRCalc : 0) : 0;
              el.xirr = `${(Number(actualXirr) * 100).toFixed(2)}%`;
            return el;
  });
  postMessage(dt);
 });

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key] || 'NO_PAN'] = rv[x[key]  || 'NO_PAN'] || []).push(x);
    return rv;
  }, {});
};


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


  