function showModal(modalClass){
  smoothscrollToTop();
  if(urlParams.workoutSeries!=undefined)
  deeplink('http://riafy.me/hideBottomBar');
  document.querySelector("body").classList.add('noscroll');
  document.querySelector(modalClass.replace('.','#')).classList.add('showModal');
  setTimeout(function(){
    setTimeout(function(){
        document.querySelector('.modal'+modalClass).classList.add('modalVisible');
      document.querySelector(modalClass.replace('.','#')).classList.add('shadowFadeIn');
    },200);
  },100);
}

function hideModal(modalClass){
  if(urlParams.workoutSeries!=undefined)
  deeplink('http://riafy.me/showBottomBar');
  document.querySelector("body").classList.remove('noscroll');
  document.querySelector('.modal'+modalClass).classList.remove('modalVisible');
  document.querySelector(modalClass.replace('.','#')).classList.remove('shadowFadeIn');
  setTimeout(function(){
    setTimeout(function(){
      document.querySelector(modalClass.replace('.','#')).classList.remove('showModal');
    },200);
  },100);
}

for (var i = 0; i < document.querySelectorAll('.modals').length; i++) {
  document.querySelectorAll('.modals')[i].onclick=function (e) {
  if (e.target.classList.contains('modals') && !e.target.classList.contains('nonDismiss')) {
    hideModal('.'+e.target.id);
    }
  }
}
