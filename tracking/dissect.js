/*
 * JavaScript tracker for Dissect: Dissect.js
 */

import { uid, getCookie, setCookie } from "./libs/helper";
import { browserInfo } from "./tracker/browserInfo";

export function Dissect(asynchronousQueue, functionName) {
  var state = {},
    pageViewId = 1 * new Date(),
    sessionId;

  /************************************************************
   * Constructor
   ************************************************************/

  
  // initialize the Dissect singleton
  if (asynchronousQueue.length > 0) {
    asynchronousQueue.forEach((element) => {
      console.log("element", element);
      if (element[0] === "create") {
        init();
      }
      if (element[0] === "send") {
        print();
      }
    });
  }

  function init(){
	sessionId = sessionStorage.getItem("dissectSessionId");
	setCookie("dissectPageViewId", pageViewId);
	if (!sessionId) {
	  sessionId = uid();
	  sessionStorage.setItem("dissectSessionId", sessionId);
	}
	state["sessionId"] = sessionStorage.getItem("dissectSessionId");
	state["currentPageViewId"] = getCookie("dissectPageViewId");
  }

  function track() {
    let data = {};
    try {
      let browserInfoData = browserInfo();
      let trackData = {};
      if (
        window.localStorage &&
        window.localStorage.getItem(sessionId)
      ) {
        let storage = window.localStorage.getItem(sessionId);
        if (JSON.parse(storage)) {
          let margeData = JSON.parse(storage);
          margeData[pageViewId] = browserInfoData;
          trackData = Object.assign({}, margeData);
        }
        window.localStorage.setItem(
          sessionId,
          JSON.stringify(trackData)
        );
        if (Object.keys(trackData).length > 10) {
          window.localStorage.removeItem(sessionId);
        }
      } else {
        window.localStorage.setItem(
          sessionId,
          JSON.stringify(trackData)
        );
      }
	  data["browserData"] = trackData;
      return data;
    } catch (e) {
      console.error("Error>>", e);
    }
    return data;
  }



  function print() {
	state["trackingData"] = track();
	console.log('state', state)
    try {
      const node = document.createElement("DIV");
      const p = document.createElement("p");
      node.setAttribute(
        "style",
        "height: 200px; overflow:auto; border: 1px solid"
      );
      node.innerHTML = JSON.stringify(state);
      document.body.prepend(node);
    } catch (e) {
      console.error("Error>>", e);
    }
  }
}
