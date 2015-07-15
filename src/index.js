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

// a simple template sorta thing
function generateSuggestionLink(user) {
  // generate our nodes
  var li  = document.createElement('li');
  var img = document.createElement('img');
  var a   = document.createElement('a');
  // set our attributes
  li.setAttribute('class', 'list-group-item');
  img.setAttribute('src', user.avatar_url);
  a.setAttribute('href', user.url);
  a.textContent = user.login;
  // try this crap out
  li.appendChild(img);
  li.appendChild(a);
  // return that badboy
  return li;
}

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
        console.log(data);
        return data;
      })
      .catch(function(err) {
        console.log(err);
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
  document.querySelector('#users').appendChild(generateSuggestionLink(suggestion));
});

suggestion2Stream.subscribe(function(suggestion) {
  document.querySelector('#users').appendChild(generateSuggestionLink(suggestion));
});

suggestion3Stream.subscribe(function(suggestion) {
  document.querySelector('#users').appendChild(generateSuggestionLink(suggestion));
});
