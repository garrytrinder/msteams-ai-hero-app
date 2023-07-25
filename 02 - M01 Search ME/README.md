# Lab 02-M01 Search ME

This lab builds on Lab 02 to add a Search message extension

## Instructions:

In addition to code changes, these instructions will be needed in the lab:

1. npm install adaptivecards-templating

## Discussion items:

1. No easy way to correlate selectItem activities. I invented one but IMO the AI SDK should handle this.

2. Need a way to make selectItem type safe - item is an any

3. OK to use fetch (experimental in node 18)?

4. Would an ME module ever need access to application state?
   Note the more elegant way of wiring it up I used in the supplier ME. Which do you prefer?
