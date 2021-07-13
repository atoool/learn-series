//var inputs for graphs
var monthlyStatsLineGraph;
var weeklyStatsLineGraph;

var monthlyJSONLineData=[35,100,20,75,14,90,100];
var weeklyJSONLineData=[35,100,20,75,14,90,100];
var weeklyJSONDoActivityData=[35,100,20];
var monthlyJSONDoActivityData=[35,100,20];
var weeklyJSONDoFeelingData=[35,100,20];
var monthlyJSONDoFeelingData=[35,100,20];

var monthlyStatsLineData=[];
var monthlyStatsXaxis=['1','2','3','4','5','6','7','1','2','3','4','5','6','7','1','2','3','4','5','6','7','1','2','3','4','5','6','7','1','2','3'];
var monthlyStatsPoints=[10];

var weeklyStatsLineData=[];
var weeklyStatsXaxis=['1','2','3','4','5','6','7'];
var weeklyStatsPoints=[10];

var weeklyDoActivityXaxis=['','',''];
var weeklyDoActivityData=[];

var monthlyDoActivityXaxis=['','',''];
var monthlyDoActivityData=[];

var monthlyDoFeelingData=[];
var weeklyDoFeelingData=[];


function drawGraph(graphType){
  switch (graphType) {
    case 'monthlyLine':
    if (monthlyStatsLineData.length>monthlyJSONLineData.length) {
      for (var j = monthlyJSONLineData.length; j < monthlyStatsLineData.length; j++) {
        monthlyStatsLineData[j]=undefined;
      }
    }
    // monthlyStatsLineData=monthlyJSONLineData;
    // monthlyStatsPoints=monthlyStatsXaxis;
    // monthlyStatsLineGraph.update();
      for (var i = 0; i < monthlyJSONLineData.length; i++) {
          // (function (i) {
            // setTimeout(function () {
              monthlyStatsLineData[i]=monthlyJSONLineData[i];
              if (i>0) {
                monthlyStatsPoints.unshift(0);
              }
              monthlyStatsLineGraph.update();
            // }, 260*i);
            // })(i);
      }
      break;
    case 'weeklyLine':
    // weeklyStatsLineData=weeklyJSONLineData;
    if (weeklyStatsLineData.length>weeklyJSONLineData.length) {
      for (var j = weeklyJSONLineData.length; j < weeklyStatsLineData.length; j++) {
        weeklyStatsLineData[j]=undefined;
      }
    }
    for (var i = 0; i < weeklyJSONLineData.length; i++) {
        (function (i) {
          setTimeout(function () {

            weeklyStatsLineData[i]=weeklyJSONLineData[i];
            if (i>0)
            {
              weeklyStatsPoints.unshift(0);
            }
            weeklyStatsLineGraph.update(3000);
          }, 460*i);
          })(i);
    }
      break;
    default:

  }
}

function createGraph(graphType){
switch (graphType) {
  case 'monthlyLine':
      var ctx2m = document.getElementById('myChart5').getContext('2d');
      monthlyStatsLineGraph = new Chart(ctx2m, {
        type: 'line',
        data: {
            labels: monthlyStatsXaxis,
            datasets: [{
                data: monthlyStatsLineData,
                backgroundColor: ['transparent'],
                borderColor:['white'],
                borderJoinStyle:'round',
                borderCapStyle:'round',
                borderWidth:6,
                radius:monthlyStatsPoints,
                pointBackgroundColor:'white',
                pointBorderColor:'white',
                pointBorderWidth:1,
                gridLines:false
            }]
        },
        options:{
          legend:{
            display:false
          },
          layout: {
              padding: {
                  left: 0,
                  right: 20,
                  top: 20,
                  bottom: 20
              }
          },
          scales: {
                  xAxes: [{
                      display:false,
                      gridLines: {
                          display:false
                      }
                  }],
                  yAxes: [{
                    display:false,
                      gridLines: {
                          display:false
                      }
                  }]
              },
          animation: {
              duration: 0
          },
          hover: {
              animationDuration: 0
          },
          responsiveAnimationDuration: 0
            }
      });

    break;
  case 'weeklyLine':
      var ctx2m = document.getElementById('myChart2').getContext('2d');
      weeklyStatsLineGraph = new Chart(ctx2m, {
        type: 'line',
        data: {
            labels: weeklyStatsXaxis,
            datasets: [{
                data: weeklyStatsLineData,
                backgroundColor: ['transparent'],
                borderColor:['white'],
                borderJoinStyle:'round',
                borderCapStyle:'round',
                borderWidth:6,
                radius:weeklyStatsPoints,
                pointBackgroundColor:'white',
                pointBorderColor:'white',
                pointBorderWidth:1,
                gridLines:false
            }]
        },
        options:{
          legend:{
            display:false
          },
          layout: {
              padding: {
                  left: 0,
                  right: 20,
                  top: 20,
                  bottom: 20
              }
          },
          scales: {
                  xAxes: [{
                      display:false,
                      gridLines: {
                          display:false
                      }
                  }],
                  yAxes: [{
                    display:false,
                      gridLines: {
                          display:false
                      }
                  }]
              }
        }
      });

    break;

    case 'weeklyDoActivity':
    weeklyDoActivityData=weeklyJSONDoActivityData;
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: weeklyDoActivityXaxis,
          datasets: [{
              // label: '# of Votes',
              data: weeklyDoActivityData,
              backgroundColor: [
                jsonData.gradColor2,
                  LightenDarkenColor(jsonData.gradColor2,20),
                  LightenDarkenColor(jsonData.gradColor2,40)
              ]
          }]
      },
      options:{
        legend:{
          position:'right',
          display:false
        },
        layout: {
            padding: {
                left: 24,
                right: 24,
                top: 16,
                bottom: 24
            }
        },
        // animation: {
        //     duration: 0
        // },
        // hover: {
        //     animationDuration: 0
        // },
        // responsiveAnimationDuration: 0
      }
    });
    setTimeout(function(){
      document.querySelector('.weeklyActivity .legendContainer').classList.remove('zeroOpacity');
    },300);
      break;

    case 'monthlyDoActivity':
    monthlyDoActivityData=monthlyJSONDoActivityData;
    var ctx = document.getElementById('myChart4').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: monthlyDoActivityXaxis,
          datasets: [{
              // label: '# of Votes',
              data: monthlyDoActivityData,
              backgroundColor: [
                jsonData.gradColor2,
                  LightenDarkenColor(jsonData.gradColor2,20),
                  LightenDarkenColor(jsonData.gradColor2,40)
              ]
          }]
      },
      options:{
        legend:{
          position:'right',
          display:false
        },
        layout: {
            padding: {
                left: 24,
                right: 24,
                top: 16,
                bottom: 24
            }
        },
      }
    });
    setTimeout(function(){
      document.querySelector('.monthlyActivity .legendContainer').classList.remove('zeroOpacity');
    },300);
      break;

    case 'weeklyDoFeeling':
    weeklyDoFeelingData=weeklyJSONDoFeelingData;
    var ctx3 = document.getElementById('myChart3').getContext('2d');
    var myChart = new Chart(ctx3, {
      type: 'doughnut',
      data: {
          labels: monthlyDoActivityXaxis,
          datasets: [{
              data: weeklyDoFeelingData,
              backgroundColor: [
                jsonData.gradColor2,
                  LightenDarkenColor(jsonData.gradColor2,20),
                  LightenDarkenColor(jsonData.gradColor2,40)
              ]
          }]
      },
      options:{
        legend:{
          position:'right',
          display:false
        },
        layout: {
            padding: {
                left: 24,
                right: 24,
                top: 16,
                bottom: 24
            }
        },
        animation: {
            duration: 0
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0
      }
    });

    setTimeout(function(){
      document.querySelector('.weeklyFeeling .legendContainer').classList.remove('zeroOpacity');
    },300);

      break;

    case 'monthlyDoFeeling':
    monthlyDoFeelingData=monthlyJSONDoFeelingData;
    var ctx3 = document.getElementById('myChart6').getContext('2d');
    var myChart = new Chart(ctx3, {
      type: 'doughnut',
      data: {
          labels: monthlyDoActivityXaxis,
          datasets: [{
              data: monthlyDoFeelingData,
              backgroundColor: [
                jsonData.gradColor2,
                  LightenDarkenColor(jsonData.gradColor2,20),
                  LightenDarkenColor(jsonData.gradColor2,40)
              ]
          }]
      },
      options:{
        legend:{
          position:'right',
          display:false
        },
        layout: {
            padding: {
                left: 24,
                right: 24,
                top: 16,
                bottom: 24
            }
        },
        animation: {
            duration: 0
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0
      }
    });

    setTimeout(function(){
      document.querySelector('.monthlyFeeling .legendContainer').classList.remove('zeroOpacity');
    },300);

      break;

    default:
  }
}

let draw2 = Chart.controllers.line.prototype.draw;
Chart.controllers.line = Chart.controllers.line.extend({
    draw: function() {
        draw2.apply(this, arguments);
        let ctx = this.chart.chart.ctx;
        let _stroke = ctx.stroke;
        ctx.stroke = function() {
            ctx.save();
            ctx.shadowColor = 'rgba(35, 35, 35, 0.25)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 8;
            _stroke.apply(this, arguments)
            ctx.restore();
        }
    }
});

let draw = Chart.controllers.line.prototype.draw;
Chart.controllers.line = Chart.controllers.line.extend({
    draw: function() {
        draw.apply(this, arguments);
        let ctx = this.chart.chart.ctx;
        let _stroke = ctx.stroke;
        ctx.stroke = function() {
            ctx.save();
            ctx.shadowColor = 'rgba(35, 35, 35, 0.25)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 8;
            _stroke.apply(this, arguments)
            ctx.restore();
        }
    }
});
