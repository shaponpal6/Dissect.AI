/*
 * JavaScript tracker for Dissect: init.js
 */


/*
 * Get the name of the global input function
 */

import { Dissect } from './dissect';

var queueName,
  queue,
  windowAlias = window;

if (windowAlias.DissectAnalyticsObject && windowAlias.DissectAnalyticsObject.length > 0) {
  queueName = windowAlias.DissectAnalyticsObject;
  queue = windowAlias[queueName];
  queue.q = new Dissect(queue.q, queueName);
} else {
  windowAlias._snaq = windowAlias._snaq || [];
  windowAlias._snaq = new Dissect(windowAlias._snaq, '_snaq');
}

