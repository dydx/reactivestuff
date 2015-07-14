var Rx = require('rx');

function checkStatus(response) {
  if(response.status == 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(
      new Error(response.statusText));
  }
};

function getJSON(response) {
  return response.json();
};

var refreshButton = document.querySelector('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

var requestStream = refreshClickStream.startWith('startup click')
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    // lets use the Fetch API instead of jQuery
    return Rx.Observable.fromPromise(fetch(requestUrl)
      .then(checkStatus)
      .then(getJSON)
      .then(function(data) {
        return data;
      })
      .catch(function(err) {
        return err;
      }));
  });

// set up our suggestionsStream's

// I should be able to either:
// make a stream of streams and multiplex them
// make an array of streams and iterate them

var suggestion1Stream = responseStream
  .map(function(listUsers) {
    return listUsers[Math.floor(Math.random()*listUsers.length)];
  });

var suggestion2Stream = responseStream
  .map(function(listUsers) {
    return listUsers[Math.floor(Math.random()*listUsers.length)];
  });

var suggestion3Stream = responseStream
  .map(function(listUsers) {
    return listUsers[Math.floor(Math.random()*listUsers.length)];
  });

// set up our subscriptions
// I'd like to be able to combine those other three streams
// into one subscribable stream interface, and just map over it
suggestion1Stream.subscribe(function(suggestion) {
  document.querySelector('.user-1').textContent = suggestion.login;
});

suggestion2Stream.subscribe(function(suggestion) {
  document.querySelector('.user-2').textContent = suggestion.login;
});

suggestion3Stream.subscribe(function(suggestion) {
  document.querySelector('.user-3').textContent = suggestion.login;
});
