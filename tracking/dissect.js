/*
 * JavaScript tracker for Snowplow: snowplow.js
 *
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright
 * 2012-2020 Snowplow Analytics Ltd. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * * Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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

  
  // initialize the Snowplow singleton
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
