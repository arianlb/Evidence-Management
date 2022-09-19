const User = require('../models/user');

const socketsController = async (socket) => {
    const id = socket.handshake.query.id;
    const user = await User.findById(id);
    if (!user) {
        return socket.disconnect();
    }

    socket.join(user._id.toString());
    if (user.notifications.length > 0) { 
        socket.emit('notifications', user.notifications.length);
    }

    socket.on('views', async () => { 
        await User.findByIdAndUpdate(id, { $set: { notifications: [] } });
    });

}

module.exports = { socketsController };