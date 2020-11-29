import trackBrowser from './trackBrowser'
import cuid from 'cuid';
// var crypto = require('crypto');
var sessionstorage = require('sessionstorage');
var Cookies = require('js-cookie');
const parseJson = require('parse-json');


/**
 * Define core Dissect Tracker object
 * 
 */
function Dissect(){
    this.tracker = "";
    this.sessionId  = sessionstorage.getItem('dissectSessionId');
    // this.pageViewId  = cuid();
    Cookies.set('dissectPageViewId', cuid());
    if(!this.sessionId){
        const uid = cuid();
        sessionstorage.setItem('dissectSessionId', uid)
    }


    return {
        getPageViewId: function() {
            return Cookies.get('dissectPageViewId');
        },
        getSession: function() {
            return sessionstorage.getItem('dissectSessionId');
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
                        if(parseJson(storage)){
                            let margeData = parseJson(storage);
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

const dt = new Dissect();
dt.init('pageview')
dt.print();