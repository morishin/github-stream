({
  init: function() {
    var self = this;
    $(function() {
      self.bindClick();
    });
  },

  /* private */

  bindClick: function() {
    var self = this;
    $('#next-button').click(function(event) {
      var button = this;
      self.getOldestNotification(function(notification) {
        if (notification) {
          self.setDescriptions(notification);
          self.moveToUrl(notification.url, event.metaKey);
        } else {
          self.setNoUnreadDescriptions();
        }
        $(button).toggleClass('disable', !notification);
      });
      return false;
    }).trigger('click');
  },

  getOldestNotification: function(callback) {
    chrome.extension.sendRequest({method: 'popNotification'}, function(res) {
      callback(res);
    });
  },

  moveToUrl: function(url, newTab) {
    chrome.tabs.getSelected(null, function(tab) {
      if (newTab) {
        chrome.tabs.create({url: url, index: tab.index + 1});
      } else {
        chrome.tabs.update(tab.id, {url: url});
      }
    });
  },

  setDescriptions: function(notification) {
    var urlComponents = notification.url.split('//').pop().split('/');
    var repositoryName = urlComponents.slice(1, 3).join('/');
    var number = urlComponents[urlComponents.length - 1].split('#')[0];
    $('#title').text(repositoryName + ' #' + number);
    $('#message').text(notification.title);
    $('#icon').attr('src', notification.icon);
  },

  setNoUnreadDescriptions: function() {
    $('#title').remove();
    $('#message').text('No unread notifications.');
    $('#icon').attr('src', '../images/icon19.png');
    $("#next-button").remove();
  }
}).init();
