var data={};
data.morning='Good morning';
data.afternoon='Good afternoon';
data.evening='Good evening';
data.greetingsMessage='ready to create a new story?';
data.storyDate='Story date';
data.createStoryBtn='Create story';
data.todayText='today';
data.rateYourDay='RATE YOUR DAY';
data.howWasToday='How was your day today?';

data.dayAgo='day ago';
data.daysAgo='days ago';

data.emtionTerrible='REALLY TERRIBLE';
data.emtionBad='SOWEWHAT BAD';
data.emotionOkay='COMPLETELY OKAY';
data.emotionGood='PRETTY GOOD';
data.emotionAwesome='SUPER AWESOME';

data.howDidYouFeel='How did you feel throughout the day?';
data.feelingOptions=[];
data.feelingOptions[0]=[],data.feelingOptions[1]=[],data.feelingOptions[2]=[],data.feelingOptions[3]=[],data.feelingOptions[4]=[],data.feelingOptions[5]=[];
data.feelingOptions[0][0]='happy';
data.feelingOptions[0][1]='icons/dayFeeling/happy.png';
data.feelingOptions[1][0]='lucky';
data.feelingOptions[1][1]='icons/dayFeeling/lucky.png';
data.feelingOptions[2][0]='good';
data.feelingOptions[2][1]='icons/dayFeeling/good.png';
data.feelingOptions[3][0]='confused';
data.feelingOptions[3][1]='icons/dayFeeling/confused.png';
data.feelingOptions[4][0]='stressed';
data.feelingOptions[4][1]='icons/dayFeeling/stressed.png';
data.feelingOptions[5][0]='down';
data.feelingOptions[5][1]='icons/dayFeeling/down.png';


data.todayOptions=[];
data.todayOptions[0]=[],data.todayOptions[1]=[],data.todayOptions[2]=[],data.todayOptions[3]=[],data.todayOptions[4]=[],data.todayOptions[5]=[],data.todayOptions[6]=[],data.todayOptions[7]=[];
data.todayOptions[0][0]='work';
data.todayOptions[0][1]='icons/dayAction/work.png';
data.todayOptions[1][0]='family';
data.todayOptions[1][1]='icons/dayAction/family.png';
data.todayOptions[2][0]='relationship';
data.todayOptions[2][1]='icons/dayAction/relationship.png';
data.todayOptions[3][0]='education';
data.todayOptions[3][1]='icons/dayAction/education.png';
data.todayOptions[4][0]='food';
data.todayOptions[4][1]='icons/dayAction/food.png';
data.todayOptions[5][0]='travel';
data.todayOptions[5][1]='icons/dayAction/travel.png';
data.todayOptions[6][0]='friends';
data.todayOptions[6][1]='icons/dayAction/friends.png';
data.todayOptions[7][0]='exercise';
data.todayOptions[7][1]='icons/dayAction/exercise.png';
// data.todayOptions[8][0]='down';
// data.todayOptions[8][1]='icons/dayFeeling/down.png';


data.whatMadeToday=[];
data.whatMadeToday[0]='Okay, what made today really terrible?';
data.whatMadeToday[1]='Okay, what made today somewhat bad?';
data.whatMadeToday[2]='Nice, what made today completely okay?';
data.whatMadeToday[3]='Great, what made today pretty good?';
data.whatMadeToday[4]='Fabulous, what made today super awesome?';

data.storyCompleteHeading='Amazing work! Another story created. What would you like to name it?';
data.writeHere='Write here...';
data.storyTitle='Story title';
data.editMore='Wait, I forgot something!';
data.saveStory='Save story';

// data.appIcon='icons/keto.png';

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


data.gradColor1=color1;
data.gradColor2=color2;

var nickname="";
localforage.getItem('nickname').then(function(value) {
  if (value!=null) {
  nickname=value;
  }
});

var email="";
localforage.getItem('email').then(function(value) {
  if (value!=null) {
  email=value;
  }
});


var spinner='<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';


//Date related processing
var d=new Date();
//padded Date
var now=d.getHours(),today=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
var journalTime=('0'+(d.getHours()+1)).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var displayDate=months[d.getMonth()] +" "+ d.getDate();

var Difference_In_Time, Difference_In_Days;

//getting time of day
if (now<12) {
  now='morning';
}
else if (now>=12 && now<16)
{
  now='afternoon';
}
else if (now>=16 && now<=23)
{
  now='evening';
}

var sliderScore=0;

//init swiper variables
var swiper,swiper2,swiperFeeling;


// get nearest date
var pastDays=[];
localforage.getItem('daysLogged').then(function(data) {
    pastDays=data;
    var oldDate=new Date(),currentDate=new Date();
    if (pastDays!=null) {
      //check if date in earlier logs
      // if (pastDays.contains(today))
      {
      var i=1,closeJournalDateFound=false;
        while (pastDays.indexOf(today)!=-1) {
          today=moment().subtract(i,"day").format('YYYY-MM-DD');
          i++;
          displayDate=moment(today).format('MMMM D');

          Difference_In_Days = moment().diff(moment(today),'days');
        }
      }
    }
});

//setting up pages

function swapIcons(){
  var allIcons;
  if (data.appIcon!=undefined && data.appIcon!='') {
    allIcons=document.querySelectorAll('.iconContainer');
    for (var i = 0; i < allIcons.length; i++) {
      allIcons[i].classList.remove('monster');
    }
    allIcons=document.querySelectorAll('.iconContainer img');
    for (var i = 0; i < allIcons.length; i++) {
      allIcons[i].src=data.appIcon;
    }
  }
  else{
    allIcons=document.querySelectorAll('.iconContainer img');
    for (var i = 0; i < allIcons.length; i++) {
      allIcons[i].src=icon;
    }
  }
}

function setupColors(){
  //gradient setup
  var colourStyle='',c1,c2;
  if (data.gradColor1!=undefined && data.gradColor2!=undefined) {
    c1=data.gradColor1;
    c2=data.gradColor2;
  }
  else
  {
    c1=color1;
    c2=color2;
  }
    colourStyle='.swiper-container-v{background: gray;background: -webkit-linear-gradient(to bottom, '+c1+', '+c2+');background: linear-gradient(to bottom, '+c1+', '+c2+');}';
    colourStyle=colourStyle+'.continueBtn{color:'+c2+'}';
    colourStyle=colourStyle+'body{background-color:'+c2+'}';
    colourStyle=colourStyle+'.active .dayActionType{color:'+c2+'}';
    //create style for inverted image colour automatically
    colourStyle=colourStyle+'.active img{'+getColour(c2)+'}';
    colourStyle=colourStyle+'.modal .buttonsContainer .rightPiece img{'+getColour(c2)+'}';
    colourStyle=colourStyle+'.modal .buttonsContainer .leftPiece img{'+getColour('#787878')+'}';
    colourStyle=colourStyle+'.modal .modalTitle{color:'+c2+';}';
    //runnab track of input
    colourStyle=colourStyle+'::-webkit-slider-runnable-track{background:'+LightenDarkenColor(c2,-50)+';filter:saturate(0.75)}';
    colourStyle=colourStyle+'#saveStoryBtn .lds-ellipsis div{background: '+c2+';}';

  addStyle(colourStyle);
}


function createStoryPage(){
  document.querySelector('span.greeting').innerHTML=data[now];
  document.querySelector('span.name').innerHTML=nickname;
  document.querySelector('.greetingsMessage').innerHTML=data.greetingsMessage;
  document.querySelector('.todaysDate .fadedText').innerHTML=data.storyDate;
  document.querySelector('.todaysDate .dateValue').innerHTML=displayDate;
  document.querySelector('.todayText').innerHTML=data.todayText;
  if (Difference_In_Days==1) {
  document.querySelector('.todayText').innerHTML=Difference_In_Days+' '+data.dayAgo;
  }
  else if(Difference_In_Days>1)
  document.querySelector('.todayText').innerHTML=Difference_In_Days+' '+data.daysAgo;
  document.querySelector('#createStoryBtn').innerHTML=data.createStoryBtn;

  if (Difference_In_Days>=1) {
    animatedIntro(false);
  }
  else
  animatedIntro(true);
}

function animatedIntro(animate){
  var s500=500,s1000=1000,s1500=1500;
  if (!animate) {
    s500=100,s1000=300,s1500=500;
  }
  //animated first page intro
  setTimeout(function(){
    document.querySelector('.iconContainer').classList.remove('hide');
    document.querySelector('.iconContainer').classList.add('bounceIn');
    setTimeout(function() {
        document.querySelector('.greetingsText').classList.remove('hide');
        document.querySelector('.greetingsText').classList.add('fadeInUp');
          setTimeout(function() {
            document.querySelector('.todaysDate .fadedText').classList.remove('hide');
            document.querySelector('.todaysDate .fadedText').classList.add('fadeInUp');

            document.querySelector('.todaysDate .dateValue').classList.remove('hide');
            document.querySelector('.todaysDate .dateValue').classList.add('fadeInUp');
            document.querySelector('.todayText').classList.remove('hide');
            document.querySelector('.todayText').classList.add('fadeInUp');

              setTimeout(function(){
                document.querySelector('#createStoryBtn').classList.remove('hide');
                document.querySelector('#createStoryBtn').classList.add('bounceIn');
              },s1000);
          },s1500);
    },s1000);
  },s500);
}

function createEmotionsSliderPage(){
  document.querySelector('.howWasTodayPage .headingText').innerHTML=data.howWasToday;
  document.querySelector('.howWasTodayPage .rateYourDay').innerHTML=data.rateYourDay;
  document.querySelector('.howWasTodayPage #dayRating').innerHTML=data.emotionOkay;
}

function createWhatMadeTodayPage(){

  var todayOptionsHTML='';
  for (var i = 0; i < data.todayOptions.length; i++) {
    todayOptionsHTML=todayOptionsHTML+'<div class="grid grid-3"><div class="shadowLayer"></div><div class="actionContent"><img src="'+data.todayOptions[i][1]+'" alt=""><div class="dayActionType">'+data.todayOptions[i][0]+'</div></div></div>';
  }
  todayOptionsHTML=todayOptionsHTML+'<div class="grid grid-3 writeMore"><div class="shadowLayer"></div><div class="actionContent"><img src="icons/dayAction/other-plus.png" alt=""><div class="dayActionType">other</div></div></div>';
  document.querySelector('.whatMadeToday .dayActions').innerHTML=todayOptionsHTML;
  document.querySelector('.whatMadeToday .headingText').innerHTML=data.whatMadeToday[2];


}

function createFeelingsPage() {
  document.querySelector('.feelingsPage .oneWord').innerHTML=data.howDidYouFeel;
  var feelingsHTML='';
  for (var i = 0; i < data.feelingOptions.length; i++) {
    feelingsHTML=feelingsHTML+'<div class="swiper-slide"><div class="feelingContent"><img src="'+data.feelingOptions[i][1]+'" alt=""><div class="dayActionType">'+data.feelingOptions[i][0]+'</div></div></div>';
  }
  document.querySelector('.feelingsPage .swiper-wrapper').innerHTML=feelingsHTML;
}

function createSaveStoryPage(){
  document.querySelector('.saveStoryPage .headingText .oneWord').innerHTML=data.storyCompleteHeading;
  document.querySelector('.saveStoryPage .dayActionOther').innerHTML=data.storyTitle;
  document.querySelector('#storyTitleText').placeholder=data.writeHere;
  document.querySelector('#dayActionOtherText').placeholder=data.writeHere;
  document.querySelector('#saveStoryBtn').innerHTML=data.saveStory;
  document.querySelector('.saveStoryPage .editMore').innerHTML=data.editMore;
}

function setupTranslations(){
  //Modal related translations go here

  createAccountTranslations();

  document.querySelector('#sureToExit .modalTitle').innerHTML=data.sureToExit;
  document.querySelector('#sureToExit .modalCentrePiece').innerHTML='<p>'+data.cantSaveStory+'</p>';

  document.querySelector('#achievementUnlocked .extraTextInfo').innerHTML='<p>'+data.achievementUnlocked+'</p>';

  document.querySelector('.whatMadeToday .dayActionOther').innerHTML=data.yourCategory;
  document.querySelector('.whatMadeToday .writeLess').innerHTML=document.querySelector('.whatMadeToday .writeLess').innerHTML.replace('Back',data.backBtn);
  document.querySelector('.whatMadeToday .writeMore .dayActionType').innerHTML=data.otherText;

}

function createAccountTranslations(){
  document.querySelector('#createAccount .modalHeading').innerHTML=data.safetyFirst;
  document.querySelector('#createAccount .modalTextContent').innerHTML=data.createAccountExplainer;
  document.querySelector('#createAccount .continueBtn').innerHTML=data.createAccount;
  document.querySelector('#createAccount #nickname').placeholder=data.nickname;
  document.querySelector('#createAccount #emailId').placeholder=data.email;
  document.querySelector('#createAccount #pwd').placeholder=data.password;
  document.querySelector('#createAccount #pwdConfirm').placeholder=data.confirmPassword;
  document.querySelector('#createAccount .explanation').innerHTML=data.passwordExplainer;
}

var initSetupFromCache=false;
localforage.getItem('jsonData').then(function(value) {
  if (value!=null) {
    initSetupFromCache=true;
    document.getElementById("spinner").classList.remove("loaded");
    data=value;
    swapIcons();
    setupColors();
    createStoryPage();
  }
});

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
 if (this.readyState == 4 && this.status == 200) {
   data=JSON.parse(this.responseText);

   localforage.setItem('jsonData',data).then(function(){});
   if (initSetupFromCache==false) {
     document.getElementById("spinner").classList.remove("loaded");
     swapIcons();
     setupColors();
     createStoryPage();
   }
   createEmotionsSliderPage();
   createFeelingsPage();
   createWhatMadeTodayPage();
   createSaveStoryPage();
   setupTranslations();

   swiper = new Swiper('.swiper-container-v', {direction: 'vertical',speed: 800,navigation: {nextEl: '.nextBtn',prevEl: '.prevBtn',},preventInteractionOnTransition:true,});
   swiper2 = new Swiper('.swiper-container-h', {direction: 'horizontal',speed: 800,navigation: {nextEl: '.writeMore',prevEl: '.writeLess',}});
   swiperFeeling = new Swiper('.swiper-container-feeling', {
        spaceBetween: 50,slidesPerView:3,centeredSlides:true,slideToClickedSlide:true,nested: true,preventClicksPropagation:true,preventInteractionOnTransition: true,effect: 'coverflow',grabCursor: true,centeredSlides: true,slidesPerView: 3,coverflowEffect: {rotate: 0,stretch: 0,depth: 100,slideShadows:false,modifier: 1,},
      });

      swiper.on('reachEnd',function(){
        document.querySelector('.navigationBtns').classList.add('hidden');
      });


      swiper.on('slideChange', function () {
        gotoDeeplink('http://riafy.me/vibrate');
        if (this.activeIndex==0) {
          document.querySelector('.navigationBtns').classList.add('hidden');
        }
      });

      document.getElementById('dayActionOtherText').onkeypress=function(e){
        if (e.keyCode=="13") {
          swiper.slideNext();
        }
      }


      document.getElementById('createStoryBtn').onclick=function(e){
        document.getElementById('createStoryBtn').classList.add('active');
        setTimeout(function(){
          swiper.slideNext();
          document.querySelector('.navigationBtns').classList.remove('hidden');
          document.getElementById('createStoryBtn').classList.remove('active');
        },500);
      }


      document.querySelector('.editMore').onclick=function(e){
          swiper.slidePrev();
          document.querySelector('.navigationBtns').classList.remove('hidden');
          setTimeout(function(){
            document.getElementById('saveStoryBtn').classList.remove('active');
          },300);
      }


      document.getElementById('emotionSlider').onclick=function(e){
        console.log('on-click');
        setTimeout(function(){
          swiper.slideNext();
        },500);
      }

      document.getElementById('emotionSlider').onchange=function(e){
        console.log('on-change');
        if (swiper.activeIndex==1) {
          setTimeout(function(){
            swiper.slideNext();
          },500);
        }
      }

      document.getElementById('emotionSlider').oninput=function(e){
        console.log('on-input');
          if (e.target.value>=0 && e.target.value<20) {
            document.querySelector('.emoticon img').src="icons/emoticons/1.png";
            document.getElementById('dayRating').innerHTML=data.emtionTerrible;
            sliderScore=0;
            document.querySelector('.whatMadeToday .headingText').innerHTML=data.whatMadeToday[sliderScore];
          }
          else if (e.target.value>=20 && e.target.value<40) {
            document.querySelector('.emoticon img').src="icons/emoticons/2.png";
            document.getElementById('dayRating').innerHTML=data.emtionBad;
            sliderScore=1;
            document.querySelector('.whatMadeToday .headingText').innerHTML=data.whatMadeToday[sliderScore];
          }
          else if (e.target.value>=40 && e.target.value<60) {
            document.querySelector('.emoticon img').src="icons/emoticons/3.png";
            document.getElementById('dayRating').innerHTML=data.emotionOkay;
            sliderScore=2;
            document.querySelector('.whatMadeToday .headingText').innerHTML=data.whatMadeToday[sliderScore];
          }
          else if (e.target.value>=60 && e.target.value<80) {
            document.querySelector('.emoticon img').src="icons/emoticons/4.png";
            document.getElementById('dayRating').innerHTML=data.emotionGood;
            sliderScore=3;
            document.querySelector('.whatMadeToday .headingText').innerHTML=data.whatMadeToday[sliderScore];
          }
          else if (e.target.value>=80 && e.target.value<=100) {
            document.querySelector('.emoticon img').src="icons/emoticons/5.png";
            document.getElementById('dayRating').innerHTML=data.emotionAwesome;
            sliderScore=4;
            document.querySelector('.whatMadeToday .headingText').innerHTML=data.whatMadeToday[sliderScore];
          }
      }

      var dayFeelings=document.querySelectorAll('.feelingContent');
      for (i = 0; i < dayFeelings.length; i++) {
        dayFeelings[i].addEventListener('click', function(e) {
          setTimeout(function() {
            swiper.slideNext();
          },500);
        });
      }

      var dayActions=document.querySelectorAll('.dayActions .grid');
      for (i = 0; i < dayActions.length; i++) {
        dayActions[i].addEventListener('click', function(e) {
          var curActive=false;
          if (this.classList.contains('active')) {
            curActive=true;
          }

          var dayActionsTemp=document.querySelectorAll('.dayActions .grid');
          for (j = 0; j < dayActionsTemp.length; j++) {
              dayActionsTemp[j].classList.remove('active');
          }

          if (curActive) {
            this.classList.remove('active');
          }
           if(!this.classList.contains('writeMore'))
          {
            this.classList.add('active');
            setTimeout(function(){
              swiper.slideNext();
            },500);
          }
        });
      }


      if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
          FastClick.attach(document.body);
        }, false);
      }


      document.getElementById("dayActionOtherText").onkeyup=function(){
        if (this.value.length >= this.getAttribute('maxlength')) {
          this.value=this.value.slice(0,parseInt(this.getAttribute('maxlength')));
        }
        document.querySelector('.countValue').innerHTML=this.value.length;
      }
      document.getElementById("storyTitleText").onkeyup=function(){
        if (this.value.length >= this.getAttribute('maxlength')) {
          this.value=this.value.slice(0,parseInt(this.getAttribute('maxlength')));
        }
        document.querySelector('.countValueStory').innerHTML=this.value.length;
      }

      document.getElementById('saveStoryBtn').onclick=function(){
        if (this.classList.contains('active')) {
          return;
        }
        keyboardDeactivated();
        document.getElementById('saveStoryBtn').classList.add('active');
        var daysLogged=[];
        localforage.getItem('daysLogged').then(function(data) {
           if (data==null) {
             daysLogged.push(today);
             localforage.setItem('daysLogged',daysLogged).then(function(results) {
               console.log(results);
             });
           }
           else{
             localforage.getItem('daysLogged').then(function(results) {
               if (results.indexOf(today)==-1) {
                results.push(today);
                localforage.setItem('daysLogged',results).then(function(results){
                  console.log(results);
                });
               }
             });
           }
         });

        //not logged in - create account
         if (email=='') {

           //reset the modals
           document.querySelector('.modalTextContent').classList.remove('hidden');
           document.querySelector('.modalTextContent').classList.remove('fadeOut');
           document.querySelector('.inputsContainer').classList.add('hidden');
           document.querySelector('.inputsContainer').classList.add('fadeIn');

           showModal('.createAccount');
           setTimeout(function(){
             document.getElementById('saveStoryBtn').classList.remove('active');
           },1000);
         }
         else{
           this.innerHTML=spinner;
           saveStory();
         }
      }
 }
}
xhttp.open("GET", "https://cookbookapp.in/RIA/gridO.php?lang="+urlParams.lang+"&simcountry="+urlParams.simcountry+"&appname=log_"+urlParams.appname, true);
xhttp.send();

function addStyle(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("body")[0].appendChild(css);
}

// document.querySelector('.swiper-container-feeling').onmousedown=function(e){
//   // e.stopPropagation();
//   alert('s');
// }
// document.querySelector('.swiper-container-feeling').ontouchstart=function(e){
//   // e.stopPropagation();
//   alert('s');
// }
// document.querySelector('.swiper-container-v').onmousedown=function(e){
//   e.stopPropagation();
//   alert('parent');
// }
// document.querySelector('.swiper-container-v').ontouchstart=function(e){
//   e.stopPropagation();
//   alert('parent');
// }


function validateEmail(mail)
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    document.getElementById('emailId').classList.remove('error');
    document.getElementById('emailId').placeholder='Email';
    return (true);
  }
  else{
    document.getElementById('emailId').value='';
    document.getElementById('emailId').classList.add('error');
    document.getElementById('emailId').placeholder='Incorrect email id. Please retry.';
    document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
    return (false);
  }
}

function validatePass(str){
      if (str.length < 8) {
        document.getElementById('pwd').value='';
        document.getElementById('pwd').classList.add('error');
        document.getElementById('pwd').placeholder='Password too short';
        document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
        return(false);
    } else if (str.length > 50) {
      document.getElementById('pwd').value='';
      document.getElementById('pwd').classList.add('error');
      document.getElementById('pwd').placeholder='Password too long';
      document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
        return(false);
    } else if (str.search(/\d/) == -1) {
      document.getElementById('pwd').value='';
      document.getElementById('pwd').classList.add('error');
      document.getElementById('pwd').placeholder='Password should contain a number';
      document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
        return(false);
    } else if (str.search(/[A-Z]/) == -1) {
      document.getElementById('pwd').value='';
      document.getElementById('pwd').classList.add('error');
      document.getElementById('pwd').placeholder='Password needs at least 1 upper case letter';
      document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
        return(false);
    }
    else {
      document.getElementById('pwd').classList.remove('error');
      document.getElementById('pwd').placeholder='Password';
      return true;
    }
}
function matchPass(pwd,pwdC){
  if(pwd==pwdC)
  return true;
  else{
    document.getElementById('pwdConfirm').value='';
    document.getElementById('pwdConfirm').classList.add('error');
    document.getElementById('pwdConfirm').placeholder='Passwords do not match';
    document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
    return false};
}


function gotoDeeplink(link){
  document.getElementById('pwdConfirm').classList.remove('error');
  document.getElementById('pwdConfirm').placeholder='Password confirm';

  if (window.location.href.indexOf('localhost')==-1 && window.location.href.indexOf('192.168')==-1) {
    window.location.assign(link);
  }
  else{
    console.log(link);
  }
}


function showAwards(awardsData){
  awardsData=JSON.parse(awardsData);
  var awardsFlag=false;
  if (awardsData.rewards.dayReward!="") {
    awardsFlag=true;
    document.querySelector('#achievementUnlocked .badge').src=awardsData.rewards.dayReward.rewardBadge;
    document.querySelector('#achievementUnlocked .achievementDone').innerHTML=awardsData.rewards.dayReward.message;
  }
  else if (awardsData.rewards.streakReward!="") {
    awardsFlag=true;
    console.log(awardsData);
    document.querySelector('#achievementUnlocked .badge').src=awardsData.rewards.streakReward.rewardBadge;
    document.querySelector('#achievementUnlocked .achievementDone').innerHTML=awardsData.rewards.streakReward.message;
  }
  if (awardsFlag) {
    showModal('.achievementUnlocked');
  }
  else {
    outro('.saveStoryPage',300,'http://riafy.me/goback');
    // gotoDeeplink('http://riafy.me/goback');
  }
}


function saveStory() {
  // alert('story saved');
  var journal={};
  //creating the journal
  journal['storyTitleText']=document.querySelector('#storyTitleText').value;
  journal['emotionSlider']=document.querySelector('#emotionSlider').value;

  if(document.querySelector('.dayActions .grid.active')==undefined)
  {
      journal['dayActionType']=document.querySelector('#dayActionOtherText').value;
  }
  else{
    journal['dayActionType']=document.querySelector('.grid.active .dayActionType').innerText;
  }

  journal['dayFeelingType']=document.querySelector('.feelingsPage .swiper-slide-active .dayActionType').innerText;

  journal=JSON.stringify(journal);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
      document.getElementById('saveStoryBtn').classList.remove('active');
      document.getElementById('saveStoryBtn').innerHTML=data.saveStory;
      showAwards(this.responseText);
   }
  }
  xhttp.open("GET", 'https://cookbookrecipes.in/moodtracker/reflections.php?action=setReflection&emailId='+email+'&reflectionDate='+today+'&reflectionTime='+journalTime+'&language='+urlParams.lang+'&reflection='+journal, true);
  xhttp.send();
}

//function to invoke on signup complete
function signUpCallback(success,message) {
  document.querySelector('.createAccount .continueBtn').classList.remove('active');
  if (success=='true') {
    email=document.getElementById('emailId').value;
    localforage.setItem('email',email).then(function(){});
    localforage.setItem('nickname',document.getElementById('nickname').value).then(function(){});

    hideModal('.createAccount');
    saveStory();
  }
  else{
    document.getElementById('emailId').value='';
    document.getElementById('emailId').classList.add('error');
    document.getElementById('emailId').placeholder='Could not create account. Please retry.';

    document.querySelector('.createAccount .continueBtn').innerHTML="Create account";
    // document.querySelector('.createAccount .continueBtn').innerHTML=data.createStoryBtn;
  }
}

document.querySelector('.closeBtn').onclick=function(){
  showModal('.sureToExit');
}

function exitToApp(type) {
  if (type!=undefined && type.indexOf(',')!=-1) {
    var modalClass=type.split(',');
    type=modalClass[0];
    modalClass=modalClass[1];
  }
    switch (type) {
      case 'modalExit':
      hideModal('.'+modalClass);
      setTimeout(function(){
        outro('.saveStoryPage',500,'http://riafy.me/goback');
      },200);

        break;
      default:
        gotoDeeplink('http://riafy.me/goback');
    }
}
//type to text, email, password - now assigned to type=text
var inputTypes=['input[type=text]','input[type=email]','input[type=password]'];
var createAccountInputs;
for (var k = 0; k < inputTypes.length; k++) {
  createAccountInputs=document.querySelectorAll(inputTypes[k]);
  for (var i = 0; i < createAccountInputs.length; i++) {
    createAccountInputs[i].onfocus=function(){document.getElementsByTagName('body')[0].classList.add('keyboardActive');
      window.scroll({
        top: this.getBoundingClientRect().top  + window.scrollY-100,
        behavior: 'smooth'
      });
    }
    createAccountInputs[i].onblur=function(e){document.getElementsByTagName('body')[0].classList.add('keyboardActive');

        if (e.relatedTarget==null || e.relatedTarget.tagName.toLowerCase().indexOf('input')==-1) {
          keyboardDeactivated()
        }
    }
  }
}

function keyboardDeactivated(){
  window.scroll({
    top: 0,
    behavior: 'smooth'
  });
  setTimeout(function(){
    document.getElementsByTagName('body')[0].classList.remove('keyboardActive');
  },400);

}

function outro(currentClass,timeInms,link) {
  if (timeInms==undefined) {
    timeInms=300;
  }
  document.querySelector(currentClass+' .continueBtn').classList.add('noClick');
  document.querySelector(currentClass+' .bottomPiece').classList.add('noClick');
  document.querySelector(currentClass+' .centerPiece').classList.add('noClick');
  document.querySelector(currentClass+' .topPiece').classList.add('noClick');

  setTimeout(function(){
  document.querySelector(currentClass+' .bottomPiece').classList.add('fadeOut');
  setTimeout(function(){
    document.querySelector(currentClass+' .centerPiece').classList.add('fadeOut');
    setTimeout(function(){
      document.querySelector(currentClass+' .topPiece').classList.add('fadeOut');
      // setTimeout(function(){
          if (window.location.href.indexOf('localhost')==-1 && window.location.href.indexOf('192.168')==-1) {
            window.location.assign(link);
          }
          else{
            // alert(link);
            console.log(link);
          }
      // },4000);
    },timeInms);
  },timeInms);
},timeInms*1.5);

}

// var inputsMaxlength = document.querySelectorAll('input');
// for (var kk = 0; kk < inputsMaxlength.length; kk++) {
//   inputsMaxlength[kk].onkeypress=function(event){
//     console.log(this.value.length);
//     if (this.value.length >= 20) {
//       console.log('asdasdsad');
//     // if (this.value.length >= parseInt(this.getAttribute('maxlength'), 10)) {
//         event.preventDefault();
//         return;
//     }
//   };
// }
