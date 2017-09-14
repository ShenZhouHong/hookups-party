var requestQueue = function(userPreferences) {
    // Establishes a connection with the server
    var socket = io({forceNew: true});
    socket.emit("requestQueue", userPreferences);
    
};
