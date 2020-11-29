const va = require('./src/index');

// TODO: insert your tracking code here
const isCN = false // flag to send event to CN endpoint
const tracker = va.init({ code: "YOUR_TRACKER_CODE", isCN: isCN })

// test click event
tracker.sendEvent("click", {
  name: "testclick",
  web_host: "test_webhost",
  test_data: "test",
  os: "fake_os"
}, success => {
  console.log(success);
}, err => {
  console.error("send testClick failed: ", err);
});
