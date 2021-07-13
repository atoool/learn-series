document.querySelector("head").insertAdjacentHTML('beforeend','<style media="screen">.toTrans{opacity:.5;}.toTrans.ted{opacity:1;}</style>');
if (localStorage['prevLanguage']==undefined) {
  localStorage['prevLanguage']="en";
}

if (localStorage['prevLanguage']!=urlParams.lang) {
  localStorage['prevLanguage']=urlParams.lang;
  localStorage['transSystem']=undefined;
}
var allStrings={};

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
    setupTransSystem();
	}, false);
}

var pass=1,dataPasses=[];
function changeStrings(force=false){
  if(localStorage['transSystem']!=undefined && localStorage['transSystem']!="undefined")
  {
    var data=JSON.parse(localStorage['transSystem']);
    if(force)
    var q=document.querySelectorAll('.toTrans');
    else var q=document.querySelectorAll('.toTrans:not(.ted)');
    if (q.length==0) {
      return;
    }
    // console.log(q,force);
    for (var i = 0; i < q.length; i++) {
      // infinite loop prevention
      if (dataPasses[q[i].innerHTML]==undefined) {
        dataPasses[q[i].innerHTML]=0
      }
      else dataPasses[q[i].innerHTML]++;

      if (dataPasses[q[i].innerHTML]>200) {
        return;
      }
      // console.log(data[q[i].innerHTML],'in data');
      if(data[q[i].innerHTML]!=undefined)
      {
        q[i].innerHTML=data[q[i].innerHTML];
        q[i].classList.add('ted');
      }
      else if(urlParams.lang=="en") getNewStrings(force);
      else getNewStrings();

    }
  }
  if(pass++==1)
  {
    getNewStrings();


    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { childList: true,attributes:true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
          if(mutation.target.querySelector('.toTrans')==null)
          continue;

            if (mutation.type === 'childList') {
                changeStrings();
            }
            else if (mutation.type === 'attributes') {
                changeStrings(true);
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);


  }

}

function getNewStrings(force=false){
  var q,toTranslate="";
  if(force)
  q=document.querySelectorAll('.toTrans');
  else q=document.querySelectorAll('.toTrans:not(.ted)');
  for (var i = 0; i < q.length; i++) {
    toTranslate=toTranslate+"||"+q[i].innerHTML;
  }
  toTranslate=toTranslate.replace("||","");

  if(toTranslate.length==0) return;

    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         if(this.responseText!="[]")
        {
          var newItems=JSON.parse(this.responseText);
          for (var item in newItems) {
            if (newItems.hasOwnProperty(item)) {
              allStrings[item]=newItems[item];
            }
          }
          localStorage['transSystem']=JSON.stringify(allStrings);
          changeStrings();
        }
      }
    }
    xhttp.open("GET", "https://cookbookapp.in/RIA/play/transSystem.php?q="+toTranslate+"&lang="+urlParams.lang, true);
    xhttp.send();
}

function setupTransSystem(){
  changeStrings();
}
