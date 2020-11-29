const { detect } = require('detect-browser');
const browser = detect();
// var sessionstorage = require('sessionstorage');
var Cookies = require('js-cookie');
// const publicIp = require('public-ip');
var ip = require('ip');

// console.log('browser', browser)
// console.log('ip', ip)
// console.log('ip', ip.address())

 function trackBrowser() {
    return {
        "pageId": Cookies.get('dissectPageViewId'),
        "entryTime": new Date().toISOString(),
        "browser": browser,
        "screenX": window.screen.width,
        "screenY": window.screen.height,
        "ip": ip.address(),
        // "ip": await publicIp.v4(),
    }
}


export default trackBrowser
