// This is just opening and closing the window every 3 seconds
module.exports = function(server) {
  var windowQuery = server.where({ type: 'window' });
  server.observe([windowQuery], function(window) {
    setInterval(function() {
      if (window.state === 'closed') {
        window.call('open');
      } else {
        window.call('close');
      }
    }, 3000);
  });

};
