const User = require('../models/user');

const socketsController = async (socket) => {
    const id = socket.handshake.query.id;
    const user = await User.findById(id);
    if (!user) {
        return socket.disconnect();
    }

    socket.join(user._id);
    if (user.notifications.length > 0) { 
        socket.emit('notifications', user.notifications.length);
    }

    socket.on('views', () => { 
        user.notifications = [];
        user.save();
    });

}

module.exports = { socketsController };