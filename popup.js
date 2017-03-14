function getCurrentTabInfo(callback) {
  var queryInfo = {active: true, currentWindow: true};

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    callback({title: tab.title, url: tab.url});
  });
}

function loadConfig() {
  var configObject = false;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", chrome.runtime.getURL('/config.json'), false);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      configObject = JSON.parse(xhr.responseText);
    }
  };

  try {
    xhr.send();
  } catch(e) {
    renderStatus('Could not load config.json');
  }

  return configObject;
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function iceIt(title, url) {
  var config = loadConfig();

  var xhr = new XMLHttpRequest();
  xhr.open('POST', config.host + '/items', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('X-Api-Email', config.email);
  xhr.setRequestHeader('X-Api-Key', config.key);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      renderStatus('Done!');
    } else {
      renderStatus('Something went wrong!');
    }
  };
  xhr.send(JSON.stringify({item: {title: title, url: url}}));
}

document.addEventListener('DOMContentLoaded', function() {
  renderStatus('Putting this page on ice...');

  getCurrentTabInfo(function(info) {
    iceIt(info.title, info.url);
  });
});
