
var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  var sessionEndpoint = '/api/session';

  var sessionId = null;

  return {
    sendRequest: sendRequest,
    getSessionId: getSessionId,

    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr).result;
    },
    setErrorPayload: function() {
    }
  };

  function getSessionId(callback) {
    var http = new XMLHttpRequest();
    http.open('GET', sessionEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () {
      if (http.readyState === XMLHttpRequest.DONE) {
        let res = JSON.parse(http.response);
        sessionId = res.result.session_id;
        callback();
      }
    };
    http.send();
  }


  // envia a mensagem para o servidor
  function sendRequest(text) {
    
    var payloadToWatson = {
      session_id: sessionId
    };

    payloadToWatson.input = {
      message_type: 'text',
      text: text,
    };

    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === XMLHttpRequest.DONE && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
      } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
        Api.setErrorPayload({
          'output': {
            'generic': [
              {
                'response_type': 'text',
                'text': 'I\'m having trouble connecting to the server, please refresh the page'
              }
            ],
          }
        });
      }
    };

    var params = JSON.stringify(payloadToWatson);

    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

    // Send request
    http.send(params);
  }
}());
