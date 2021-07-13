var data={};

//default values
var icon='icons/cute-monster.png';
var color1='#FBD786',color2='#f7797d';

var color1='#e0c3fc',color2='#8ec5fc';
var color1='#89f7fe',color2='#66a6ff';
var color1='#37ecba',color2='#72afd3';
var color1='#fe9a8b',color2='#f78ca0';
// var color1='#48c6ef',color2='#48c6ef';
// var color1='#74ebd5',color2='#9face6';
// var color1='#ff7eb3',color2='#ff758c';
// var color1='#8ddad5',color2='#00cdac';

// var color1='#ffc3a0',color2='#ffafbd';
var color1='#FFC796',color2='#FF6B95';
// color1='#e2ebf0';color2='#cfd9df';
// color1='#ebedee';color2='#eef1f5';

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
localforage.getItem('jsonData').then(function(value) {
console.log(value);
  if (value!=null) {
  jsonData=value;
  setupTranslations();
  setupColors();
  }
  else{
    setupColors();
  }
});
// jsonData.gradColor1=color1;
// jsonData.gradColor2=color2;

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
// var swiperWeeklyCards = new Swiper('.swiper-container-w', {
//     noSwiping:false, spaceBetween: 16,slidesOffsetAfter:16,slidesOffsetBefore:16,slidesPerView:1.2,slideToClickedSlide:true,nested: true,preventClicksPropagation:true});


//get data from server
function getRewardsData(date,pass){
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
 if (this.readyState == 4 && this.status == 200) {
   data=JSON.parse(this.responseText);
   console.log(data);
  //add rewards
  var rewardsHTML='';
  for (var reward in data.rewards) {
    if (data.rewards.hasOwnProperty(reward)) {
      if(data.rewards[reward].inactive==undefined)
      rewardsHTML=rewardsHTML+'<div class="rewardItem"><div class="rewardImage"><img src="'+data.rewards[reward].img+'" alt=""></div><div class="rewardTextContainer"><div class="rewardName">'+data.rewards[reward].message+'</div><div class="rewardText"></div></div></div>';
      else rewardsHTML=rewardsHTML+'<div class="rewardItem inactive"><div class="rewardImage"><img src="'+data.rewards[reward].img+'" alt=""></div><div class="rewardTextContainer"><div class="rewardName">'+data.rewards[reward].message+'</div><div class="rewardText"></div></div></div>';
    }
  }
  document.querySelector('.rewardsContainer .centerPiece').innerHTML=rewardsHTML;
  //add streaks
  var rewardsHTML='';
  for (var reward in data.streaks) {
    if (data.streaks.hasOwnProperty(reward)) {
      if(data.streaks[reward].inactive==undefined)
      rewardsHTML=rewardsHTML+'<div class="rewardItem"><div class="rewardImage"><img src="'+data.streaks[reward].img+'" alt=""></div><div class="rewardTextContainer"><div class="rewardName">'+data.streaks[reward].message+'</div><div class="rewardText"></div></div></div>';
      else rewardsHTML=rewardsHTML+'<div class="rewardItem inactive"><div class="rewardImage"><img src="'+data.streaks[reward].img+'" alt=""></div><div class="rewardTextContainer"><div class="rewardName">'+data.streaks[reward].message+'</div><div class="rewardText"></div></div></div>';
    }
  }
  document.querySelector('.streaksContainer .centerPiece').innerHTML=rewardsHTML;


   if (pass==1) {
     swiper.slideNext();
     document.querySelector('.tabBtnContainer').classList.remove('fadeInFromRight');
   }

  }
}

localforage.getItem('email').then(function(value) {
  if (value!=null) {
    email=value;
    xhttp.open("GET", "https://cookbookrecipes.in/moodtracker/reflections.php?action=allAwards&emailId="+email+"&date="+date+"&language="+urlParams.lang+"&simcountry="+urlParams.simcountry+"&appname="+urlParams.appname, true);
    // xhttp.open("GET", "https://cookbookrecipes.in/moodtracker/reflections.php?action=allAwards&emailId="+email+"&date="+date+"&language="+urlParams.lang+"&simcountry="+urlParams.simcountry+"&appname="+urlParams.appname, true);
    xhttp.send();
  }
  else {
    xhttp.open("GET", "https://cookbookrecipes.in/moodtracker/reflections.php?action=allAwards&emailId=&date="+date+"&language="+urlParams.lang+"&simcountry="+urlParams.simcountry+"&appname="+urlParams.appname, true);
    // xhttp.open("GET", "https://cookbookrecipes.in/moodtracker/reflections.php?action=allAwards&emailId="+email+"&date="+date+"&language="+urlParams.lang+"&simcountry="+urlParams.simcountry+"&appname="+urlParams.appname, true);
    xhttp.send();
  }
});

}

getRewardsData(moment().format('YYYY-MM-DD'),1);

function setupTranslations(){
  document.querySelector('.preparingText').innerHTML=jsonData.preparingData;
  document.querySelector('.tabBtns.weeklyBtn').innerHTML=jsonData.rewards;
  document.querySelector('.tabBtns.monthlyBtn').innerHTML=jsonData.streaks;
}

function switchTabs(tab){
  if (tab=='streaks') {
      document.querySelector('.weeklyBtn').classList.remove('selected');
      document.querySelector('.monthlyBtn').classList.add('selected');
      swiper.slideNext();
  }
  else if (tab=='rewards' & swiper.realIndex>1) {
      document.querySelector('.weeklyBtn').classList.add('selected');
      document.querySelector('.monthlyBtn').classList.remove('selected');
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
  colourStyle=colourStyle+'.tabBtns.selected{color:'+LightenDarkenColor(c1,-10)+'}';
  addStyle(colourStyle);
}



function addStyle(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("body")[0].appendChild(css);
}


function percent(array)
{
 var i, sum=0,op=[];

 for (i=0; i<array.length; i++)
  sum=sum+array[i];

 for (i=0; i<array.length; i++)
  op[i] = Math.round(array[i] / sum*100,0) + '%';

 return op;
}


function setDonutGraphs(data,durationType,className,graphType,graphSource){
  // console.log(graphSource+'ddd');
  var tempI=0,acivityPercentage=percent(Object.values(data[durationType][graphType]));
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
