let onlineUsers = []

export default function (socket, io) {
    socket.on('join', (user_id) => {
        socket.join(user_id)

        // add joined to online users
        if(!onlineUsers.some((u) =>  u.userId === user_id)) {
            onlineUsers.push({ userId: user_id, socketId: socket.id })
        }

        // send online users
        io.emit('get-online-users', onlineUsers)

        //send socket id
        io.emit('setup socket', socket.id);
    });

    // socket disconnect
    socket.on('disconnect', () => {
        
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-online-users', onlineUsers)
    })

    // join a conversation room
    socket.on('join conversation', (conversation) => {
        console.log(conversation)
        socket.join(conversation)
    })

    // send and receive message
    socket.on('send message', (message) => {

        let conversation = message.conversation

        if(!conversation.users) return;

        conversation.users.forEach(user => {
            if(user._id === message.sender._id) return;
            socket.in(user._id).emit('receive message', message)
        });
    })
    // typing
    socket.on('typing', (conversation) => {
        socket.in(conversation).emit('typing', conversation);
      });

      socket.on('stop typing', (conversation) => {
        socket.in(conversation).emit('stop typing', conversation);
      });

    // call
    socket.on('call user', (data) => {
        let userId = data.userToCall;
        let userSocketId = onlineUsers.find((user) => user.userId == userId)
    
        io.to(userSocketId.socketId).emit('call user', {
            signal: data.signal,
            from: data.from,
            name: data.name,
            picture: data.picture,
            receiveingCall: data.receiveingCall
        })
    })

    // answer call
    socket.on('answer call', (data) => {
        io.to(data.to).emit('call accepted', data.signal)
    })

    // end call 
    socket.on('end call', (id) => {
        io.to(id).emit('end call')
    })

}