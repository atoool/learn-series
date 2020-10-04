var data={};
var storyCount=7;
//default values
var icon='icons/cute-monster.png';
// var color1='#FBD786',color2='#f7797d';

// var color1='#e0c3fc',color2='#8ec5fc';
// var color1='#89f7fe',color2='#66a6ff';
// var color1='#37ecba',color2='#72afd3';
// var color1='#fe9a8b',color2='#f78ca0';
// var color1='#48c6ef',color2='#48c6ef';
// var color1='#74ebd5',color2='#9face6';
// var color1='#ff7eb3',color2='#ff758c';
// var color1='#8ddad5',color2='#00cdac';

// var color1='#ffc3a0',color2='#ffafbd';
var color1='#FFC796',color2='#FF6B95';
var color1='#e6dee9',color2='#fdcbf1';
var color1='#90F9C4',color2='#39F3BB';
var color1='#b490ca',color2='#5ee7df';
// var color1='#5ee7df',color2='#b490ca';
// var color1='#b1f4cf',color2='#9890e3';
// var color1='#2af598',color2='#009efd';
// var color1='#2af598',color2='#48c6ef';
// var color1='#96deda',color2='#50c9c3';
// var color1='#fdd6bd',color2='#f794a4';

data.gradColor1=color1;
data.gradColor2=color2;

data.thisWeek='Week 15';
data.thisMonth='April';

var nickname="";
localforage.getItem('nickname').then(function(value) {
  if (value!=null) {
  nickname=value;
  }
});



var email="";

var jsonData={};


// Date.prototype.getWeek = function() {
//     var onejan = new Date(this.getFullYear(),0,1);
//     var millisecsInDay = 86400000;
//     return Math.ceil((((this - onejan) /millisecsInDay) + onejan.getDay()+1)/7);
// };

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function getWeekFirstDay(curr){
var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
var last = first + 6; // last day is the first day + 6
return displayDateFormat(new Date(curr.setDate(first)));
}

function getWeekLastDay(curr){
var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
var last = first + 6; // last day is the first day + 6
return displayDateFormat(new Date(curr.setDate(last)));
}

function displayDateFormat(d)
{
  return months[d.getMonth()] +" "+ d.getDate();

}

function getMonthFirstDay(date){
  firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return displayDateFormat(firstDay);
}
function getMonthLastDay(date){
  firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return displayDateFormat(firstDay);
}

function getMonthName(date){
  return months[date.getMonth()];
}
function getWeekName(date){
  return date.getWeek();
}

function dateFormat(d) {
  d=new Date(d);
  return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
}

var currentWeek,currentMonth;
//Date related processing
var d=new Date();
// var d=new Date('07-20-2020 23:59:59');
//padded Date
var now=d.getHours();
// currentDate=('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)+'-'+d.getFullYear();
currentDate=d;
currentWeek=d.getWeek();
currentMonth=d.getMonth();

// showWeek=currentWeek;
// showMonth=currentMonth;
showDate=new Date(currentDate);


var swiper = new Swiper('.swiper-container-a', {noSwiping:true, direction: 'horizontal',speed: 800,});
var swiperWeeklyCards = new Swiper('.swiper-container-w', {
    noSwiping:false, spaceBetween: 16,slidesOffsetAfter:16,slidesOffsetBefore:16,slidesPerView:1.2,slideToClickedSlide:true,nested: true,preventClicksPropagation:true});


//get data from server
function getGraphData(date,pass){
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
 if (this.readyState == 4 && this.status == 200) {
   data=JSON.parse(this.responseText);
   monthlyJSONLineData=[];
   weeklyJSONLineData=[];
   weeklyJSONDoActivityData=[];
   monthlyJSONDoActivityData=[];
   weeklyJSONDoFeelingData=[];
   monthlyJSONDoFeelingData=[];

   weeklyJSONLineData=Object.values(data.weeklyStats.dailyEmotionSlider);
   document.querySelector('.weeklyStats .bigScore').innerHTML=Math.round(weeklyJSONLineData.reduce((previous, current) => current = current*1 + previous*1)/weeklyJSONLineData.length);

   monthlyJSONLineData=Object.values(data.monthlyStats.dailyEmotionSlider);
   document.querySelector('.monthlyStats .bigScore').innerHTML=Math.round(monthlyJSONLineData.reduce((previous, current) => current = current*1 + previous*1)/monthlyJSONLineData.length);

  setDonutGraphs(data,'monthlyStats','monthlyFeeling','topMonthlyFeeling',monthlyJSONDoFeelingData);
  setDonutGraphs(data,'weeklyStats','weeklyFeeling','topWeeklyFeeling',weeklyJSONDoFeelingData);

  setDonutGraphs(data,'monthlyStats','monthlyActivity','topMonthlyActivity',monthlyJSONDoActivityData);
  setDonutGraphs(data,'weeklyStats','weeklyActivity','topWeeklyActivity',weeklyJSONDoActivityData);

   weeklyJSONDoActivityData=getRealValues(data.weeklyStats.topWeeklyActivity);
   monthlyJSONDoActivityData=getRealValues(data.monthlyStats.topMonthlyActivity);
   monthlyJSONDoFeelingData=getRealValues(data.monthlyStats.topMonthlyFeeling);
   weeklyJSONDoFeelingData=getRealValues(data.weeklyStats.topWeeklyFeeling);


    if (pass==1) {
      swiper.slideNext();
    }

    var graphDelays=[1000,1000,500,600,300];
    if (pass!=1) {
      graphDelays=[0,0,0,0,0];
    }

    setTimeout(function(){
    document.querySelector('.tabBtnContainer').classList.remove('fadeInFromRight');

    setTimeout(function(){
      hideModal('.modalSpinner');
      createGraph('weeklyDoActivity');createGraph('weeklyDoFeeling');
      setTimeout(function(){
        if(pass==1)
      createGraph('weeklyLine'); drawGraph('weeklyLine');

          setTimeout(function(){
            setTimeout(function(){
              createGraph('monthlyLine'); drawGraph('monthlyLine');
            },graphDelays[0]);
            createGraph('monthlyDoActivity');createGraph('monthlyDoFeeling');
          },graphDelays[1]);

      },graphDelays[2]); //graph draw delay
    },graphDelays[3]); //doughnut draw delay


  },graphDelays[4]);
  }
}

localforage.getItem('email').then(function(value) {
  if (value!=null) {
    email=value;
    xhttp.open("GET", "https://cookbookrecipes.in/moodtracker/reflections.php?action=getStats&emailId="+email+"&date="+date+"&language="+urlParams.lang+"&simcountry="+urlParams.simcountry+"&appname="+urlParams.appname, true);
    xhttp.send();
  }
});

}



localforage.getItem('jsonData').then(function(value) {
  if (value!=null) {
  jsonData=value;

  // jsonData.gradColor1=color1;
  // jsonData.gradColor2=color2;
  setupColors();
  setupTranslations();

  currentDate=moment().format('YYYY-MM-DD');
  showDate=moment().format('YYYY-MM-DD');

    localforage.getItem('daysLogged').then(function(value) {
      if (value==null || value.length<storyCount) {
        showModal('.avaialbleIn7days');
      }
      else if (urlParams.data==undefined) {
        showModal('.buyPremium');
      }
      setTimeout(function(){
        getGraphData(moment().format('YYYY-MM-DD'),1);
        setDateRangeUI();
      },1200);
    });


  }
  else{
    setupColors();
    showModal('.avaialbleIn7days');
  }
});

function setDateRangeUI(){

    if (currentDate.toString()==showDate.toString()) {
      document.querySelector('.weeklyStats .dateForward').classList.add('disabled');
      document.querySelector('.monthlyStats .dateForward').classList.add('disabled');
    }
    else{
      document.querySelector('.weeklyStats .dateForward').classList.remove('disabled');
      document.querySelector('.monthlyStats .dateForward').classList.remove('disabled')
    }

    document.querySelector('.monthlyStats .thisWeek').innerHTML=moment(showDate).format('MMMM')
    document.querySelector('.monthlyStats .weekIndicator').innerHTML=moment(showDate).startOf('month').format('MMM D')+' - '+moment(showDate).endOf('month').format('MMM D');

    document.querySelector('.weeklyStats .thisWeek').innerHTML="Week "+moment(showDate).format('W');
    document.querySelector('.weeklyStats .weekIndicator').innerHTML=moment(showDate).startOf('week').format('MMM D')+' - '+moment(showDate).endOf('week').format('MMM D');
}

var dateBackBtns=document.querySelectorAll('.dateBack');
for (var i = 0; i < dateBackBtns.length; i++) {
  dateBackBtns[i].onclick=function(){
    showModal('.modalSpinner');
    var type='weekly';
    showDate=moment(showDate).subtract(1,"week").format('YYYY-MM-DD');
    console.log(showDate);

    if (this.classList.contains('monthly')) {
      type='monthly';

      showDate=moment(showDate).date(14).subtract(1,"month").format('YYYY-MM-DD');
      console.log(showDate);
    }
    setDateRangeUI();
    getGraphData(showDate,0);
  }
}

var dateFwdBtns=document.querySelectorAll('.dateForward');
for (var i = 0; i < dateFwdBtns.length; i++) {
  dateFwdBtns[i].onclick=function(){
    showModal('.modalSpinner');
    var type='weekly';
    showDate=moment(showDate).add(1,"week").format('YYYY-MM-DD');
    console.log(showDate);

    if (this.classList.contains('monthly')) {
      type='monthly';

      showDate=moment(showDate).date(14).add(1,"month").format('YYYY-MM-DD');
      console.log(showDate);
    }
    setDateRangeUI();
    getGraphData(showDate,0);
  }
}

function setupTranslations(){
  document.querySelector('.preparingText').innerHTML=jsonData.preparingData;
  //Modal related translations go here

  document.querySelector('#buyPremium .modalTitle').innerHTML=jsonData.getNow;
  document.querySelector('#buyPremium .modalCentrePiece').innerHTML='<p>'+jsonData.premiumExplainer+'</p>';
  document.querySelector('#avaialbleIn7days .modalTitle').innerHTML=jsonData.moreStories;
  document.querySelector('#avaialbleIn7days .modalCentrePiece').innerHTML='<p>'+jsonData.storiesNeededExplainer+'</p>';


  document.querySelector('.tabBtns.weeklyBtn').innerHTML=jsonData.weekly;
  document.querySelector('.tabBtns.monthlyBtn').innerHTML=jsonData.monthly;

  document.querySelector('.weeklyStats .scoresSubheading').innerHTML=jsonData.weeklyScore;
  document.querySelector('.monthlyStats .scoresSubheading').innerHTML=jsonData.monthlyScore;

  document.querySelector('.weeklyFeeling').nextElementSibling.innerHTML=jsonData.frequentFeeling;
  document.querySelector('.monthlyFeeling').nextElementSibling.innerHTML=jsonData.frequentFeeling;

  document.querySelector('.weeklyActivity').nextElementSibling.innerHTML=jsonData.topActivity;
  document.querySelector('.monthlyActivity').nextElementSibling.innerHTML=jsonData.topActivity;
}

function switchTabs(tab){
  if (tab=='monthly') {
      document.querySelector('.weeklyBtn').classList.remove('selected');
      document.querySelector('.monthlyBtn').classList.add('selected');
      swiperWeeklyCards[0].slideNext();
      swiper.slideNext();
  }
  else if (tab=='weekly' & swiper.realIndex>1) {
      document.querySelector('.weeklyBtn').classList.add('selected');
      document.querySelector('.monthlyBtn').classList.remove('selected');
      swiperWeeklyCards[1].slidePrev();
      swiper.slidePrev();
  }
}


function setupColors(){
  //gradient setup
  var colourStyle='',c1,c2;
  if (jsonData.gradColor1!=undefined && jsonData.gradColor2!=undefined) {
    c1=jsonData.gradColor1;
    c2=jsonData.gradColor2;
  }
  else
  {
    c1=color1;
    c2=color2;
  }
  colourStyle='.swiper-container-a{background: gray;background: -webkit-linear-gradient(to bottom, '+c1+', '+c2+');background: linear-gradient(to bottom, '+c1+', '+c2+');}';
  colourStyle=colourStyle+'.legendPercent{color:'+c2+'}';
  colourStyle=colourStyle+'.tabBtns.selected{color:'+LightenDarkenColor(c1,-10)+'}';
  colourStyle=colourStyle+'.legendColour{background:'+c2+'}';
  addStyle(colourStyle);
}

// setupColors();


function addStyle(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("body")[0].appendChild(css);
}

//
// function percent(array)
// {
//  var i, sum=0,op=[];
//
//  for (i=0; i<array.length; i++)
//   sum=sum+array[i];
//
//  for (i=0; i<array.length; i++)
//   op[i] = Math.round(array[i] / sum*100,0) + '%';
// console.log(op);
//  return op;
// }

function getRealValues(array)
{

  var op={};

  for (var i in array) {
    if (array.hasOwnProperty(i)) {
      if (i.indexOf('filler')==-1 && i.indexOf('blank')==-1)
      op[i]=array[i];
      else op[i]=0;
    }
  }

  console.log(op,'asdasd');
  return Object.values(op);
}
function percent(array)
{
  // console.log(array);
 var i, sum=0,op=[];

 // for (i=0; i<array.length; i++)
 for (i in array) {
   if (array.hasOwnProperty(i)) {
     if (i.indexOf('filler')==-1 && i.indexOf('blank')==-1)
     sum=sum+array[i];
   }
 }
 var j=0;
 for (i in array) {
   if (array.hasOwnProperty(i)) {
     if (i.indexOf('filler')==-1 && i.indexOf('blank')==-1)
     op[j++] = Math.round(array[i] / sum*100,0) + '%';
     else op[j++]=0;
   }
 }
 console.log(op);
 return op;
}



function setDonutGraphs(data,durationType,className,graphType,graphSource){
  // console.log(graphSource+'ddd');
  var tempI=0,acivityPercentage=percent((data[durationType][graphType]));
  console.log(acivityPercentage,'activ');
  var imgurl='';
  var jsonParam=[];
  jsonParam['topMonthlyFeeling']='feelingOptions';
  jsonParam['topWeeklyFeeling']='feelingOptions';
  jsonParam['topMonthlyActivity']='todayOptions';
  jsonParam['topWeeklyActivity']='todayOptions';


   for (var activity in data[durationType][graphType]) {
     if (data[durationType][graphType].hasOwnProperty(activity)) {
       if (document.querySelectorAll('.'+className+' .legendContent .legendText')[tempI]!=undefined && tempI<3) {
         if (activity.indexOf('filler')!=-1 || activity.indexOf('blank')!=-1) {
           document.querySelectorAll('.'+className+' .legend')[tempI].style.visibility='hidden';
         }
         else
         {
           document.querySelectorAll('.'+className+' .legend')[tempI].style.visibility='visible';
           if (activity=="") {
             document.querySelectorAll('.'+className+' .legendContent .legendText')[tempI].innerHTML='-';
           }else
           document.querySelectorAll('.'+className+' .legendContent .legendText')[tempI].innerHTML=activity;
           document.querySelectorAll('.'+className+' .legendContent .legendPercent')[tempI].innerHTML=acivityPercentage[tempI];
           imgurl=jsonData[jsonParam[graphType]].filter(startsWith,activity);
           if (imgurl[0]!=undefined) {
            imgurl=imgurl[0][1];
            document.querySelectorAll('.'+className+' .bgImage')[tempI].src=imgurl;
          }else{
            // console.log(imgurl,'others',activity);
          }
           // graphSource.push(data[durationType][graphType][activity]);
         }

       }

     }
     tempI++;
   }
}


function startsWith(element) {
    if(element[0]==this)
        return element;
}
function exitToApp(type) {
    switch (type) {
      default:
        gotoDeeplink('http://riafy.me/goback');
    }
}
function gotoDeeplink(link){

  if (window.location.href.indexOf('localhost')==-1 && window.location.href.indexOf('192.168')==-1) {
    window.location.assign(link);
  }
  else{
    console.log(link);
  }
}
