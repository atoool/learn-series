function showModal(modalClass){
  if(document.querySelector('.activeWeight')!=undefined)
  {
    if(inchSwiper==undefined)
    document.querySelector('.activeWeight').innerHTML=defaultValues.h;
    if(lbsSwiper==undefined)
    document.querySelector('.weightMeasure .activeWeight').innerHTML=defaultValues.w;
  }

  if (modalClass=='.tapeMeasure') {
      if(inchSwiper==undefined)
      {
        initInchSwiper();
        setTimeout(function(){
          inchSwiper.update();
          inchSwiper.slideTo(18);
        },500);

      }
  }

  document.querySelector(modalClass.replace('.','#')).classList.add('showModal');

  setTimeout(function(){
    // document.querySelector('.modals').style.opacity=1;

    setTimeout(function(){
      // if (modalClass=='.achievementUnlocked') {
      //   document.querySelector('.modal'+modalClass).classList.add('modalFade');
      // }
      // else
      {
        document.querySelector('.modal'+modalClass).classList.add('modalVisible');
      }
      document.querySelector(modalClass.replace('.','#')).classList.add('shadowFadeIn');

      setTimeout(function(){
        if (modalClass=='.weightMeasure') {
            if(lbsSwiper==undefined)
            {
              initLbsSwiper();
              setTimeout(function(){
                lbsSwiper.update();
                if(window.location.hash=='#goalsNew')
                {lbsSwiper.slideTo(lbsSwiper.activeIndex-50);}
                else
                lbsSwiper.slideTo(initialWeightSwiperSlide);
              },500);
            }
            else{
              if(window.location.hash=='#goalsNew')
              {
                if (document.querySelector('.weightMeasure .active').classList.contains('kgs')) {
                  kgsSwiper.slideTo(kgsSwiper.activeIndex-50);
                }
                else
                lbsSwiper.slideTo(lbsSwiper.activeIndex-50);
              }
            }
        }
      },500)

    },200);
  },100);
}

function hideModal(modalClass){
  document.querySelector('.modal'+modalClass).classList.remove('modalVisible');
  document.querySelector(modalClass.replace('.','#')).classList.remove('shadowFadeIn');
  setTimeout(function(){
    // document.querySelector(modalClass.replace('.','#')).style.opacity=0;
    setTimeout(function(){
      document.querySelector(modalClass.replace('.','#')).classList.remove('showModal');
    },200);
  },100);
}

for (var i = 0; i < document.querySelectorAll('.modals').length; i++) {
  document.querySelectorAll('.modals')[i].onclick=function (e) {
  if (e.target.classList.contains('modals') && !e.target.classList.contains('nonDismiss')) {
    hideModal('.'+e.target.id);
    if(document.querySelector('.modals .createAccount .continueBtn')!=undefined)
    {document.querySelector('.modals .createAccount .continueBtn').classList.remove('emailPwPage');
    resetCreateAccountForm();}
    }
  }
}

function resetCreateAccountForm() {
  document.getElementById('emailId').classList.remove('error');
  document.getElementById('emailId').placeholder=data.email;
  document.getElementById('emailId').value='';
  document.getElementById('pwd').classList.remove('error');
  document.getElementById('pwd').placeholder=data.password;
  document.getElementById('pwd').value='';
  document.getElementById('pwdConfirm').classList.remove('error');
  document.getElementById('pwdConfirm').placeholder=data.confirmPassword
  document.getElementById('pwdConfirm').value='';
  document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
}

if(document.querySelector('.modals .createAccount .continueBtn')!=undefined)
document.querySelector('.modals .createAccount .continueBtn').onclick=function(){
  keyboardDeactivated();
  if (this.classList.contains('emailPwPage')) {
    if (this.classList.contains('active')) {
      return;
    }
    this.classList.add('active');
    var signUpData={};

    if (!validateEmail(document.getElementById('emailId').value)) {
      console.log('email wrong');
    }
    else if(!validatePass(document.getElementById('pwd').value)) {
      console.log('pwd wrong');
    }
    else if(!matchPass(document.getElementById('pwd').value,document.getElementById('pwdConfirm').value)) {
      console.log('pwd non match');
    }
    else{
      signUpData['email']=document.getElementById('emailId').value;
      signUpData['pwd']=document.getElementById('pwd').value;
      signUpData['username']=document.getElementById('nickname').value;
      this.innerHTML=spinner;
      gotoDeeplink('http://riafy.me/signUpFbase/'+JSON.stringify(signUpData));
    }
  }
  else
  {
    this.classList.add('active');
    this.classList.add('emailPwPage');
    setTimeout(function () {
      document.querySelector('.modals .createAccount .continueBtn').classList.remove('active');
    },500);
    document.querySelector('.modalTextContent').classList.add('fadeOut');
    setTimeout(function(){
      document.querySelector('.inputsContainer').classList.remove('hidden');
      document.querySelector('.modalTextContent').classList.add('hidden');
      setTimeout(function(){
        document.querySelector('.inputsContainer').classList.add('fadeIn');
      },100);
    },300);
  }
}

// showModal('.createAccount');
