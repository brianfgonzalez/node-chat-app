// Jan 1st 1970 00:00:00 am = 0 in UTC
// -1000 = 1 second before 0
// 1000 = Jan 1st 1970 00:00:01 am
// documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

var moment = require('moment')

// var date = new Date()
// console.log(date.getMonth())

// https://momentjs.com/
// moment().format('MMMM Do YYYY, h:mm:ss a'); // January 29th 2018, 9:51:35 pm
// moment().format('dddd');                    // Monday
// moment().format("MMM Do YY");               // Jan 29th 18
// moment().format('YYYY [escaped] YYYY');     // 2018 escaped 2018
// moment().format();
// moment("20111031", "YYYYMMDD").fromNow(); // 6 years ago
// moment("20120620", "YYYYMMDD").fromNow(); // 6 years ago
// moment().startOf('day').fromNow();        // a day ago
// moment().endOf('day').fromNow();          // in 2 hours
// moment().startOf('hour').fromNow();       // an hour ago

var someTimestamp = moment().valueOf()
console.log(someTimestamp)

//var createdAt = 1234
var date = moment(someTimestamp)
console.log(date.format('h:mm a'))

// 10:35 am
