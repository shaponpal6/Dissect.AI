

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function cuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function get_browser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }


  function trackBrowser() {
    return {
        "pageId": getCookie('dissectPageViewId'),
        "entryTime": new Date().toISOString(),
        "browser": get_browser(),
        "page": window.location.href,
        "screenX": window.screen.width,
        "screenY": window.screen.height,
    }
}


/**
 * Define core Dissect Tracker object
 * 
 */
function Dissect(){
    this.tracker = "";
    this.sessionId  = sessionStorage.getItem('dissectSessionId');
    // this.pageViewId  = cuid();
    setCookie('dissectPageViewId', cuid());
    if(!this.sessionId){
        const uid = cuid();
        sessionStorage.setItem('dissectSessionId', uid)
    }


    return {
        getPageViewId: function() {
            return getCookie('dissectPageViewId');
        },
        getSession: function() {
            return sessionStorage.getItem('dissectSessionId');
        },
        init: function(tracker){
            this.tracker = tracker;
            return this.track();
        }, 
        track: function(){
            let data = {};
            if(this.tracker ==="pageview"){
                try{
                    let trackData = trackBrowser();
                    if(window.localStorage && window.localStorage.getItem(this.getSession())){
                        let storage = window.localStorage.getItem(this.getSession());
                        if(JSON.parse(storage)){ 
                            let margeData = JSON.parse(storage);
                            margeData[this.getPageViewId()] = trackData;
                            trackData = margeData;
                        }
                        window.localStorage.setItem(this.getSession(), JSON.stringify(trackData));
                        if(Object.keys(trackData).length > 10){
                            window.localStorage.removeItem(this.getSession());
                        }
                    }else{
                        window.localStorage.setItem(this.getSession(), JSON.stringify(trackData));
                    }
                    data['browserData'] = trackData;
                    return data;
                }catch(e){
                    console.error('Error>>', e);
                }
            }
            return data;
        },
        
        print: function(printType="dom"){
            let data = {};
            data['sessionId'] = this.getSession();
            data['currentPageViewId'] = this.getPageViewId();
            data['trackingData'] = this.track();
            if(printType ==="dom"){
                try{
                    const node = document.createElement('DIV');
                    const p = document.createElement('p');
                    node.setAttribute('style', 'height: 200px; overflow:auto; border: 1px solid');
                    node.innerHTML = JSON.stringify(data);
                    document.body.prepend(node);
                }catch(e){
                    console.error('Error>>', e);
                }
            }
            if(printType ==="collector"){
                try{
                    // Send Data to database
                }catch(e){
                    console.error('Error>>', e);
                }
            }
        }, 
    }
}

// window.dissect = new Dissect();
export default new Dissect();