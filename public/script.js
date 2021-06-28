const socket = io().connect('/');
const videoGrid = document.getElementById('video-grid');
const myVid = document.createElement('video');
var myVidStream;
myVid.style.border = '5px solid darkgray';
myVid.muted = true;

const allVidElements = {};
// generating peer Id for client and emitting join-room-request event
const peer = new Peer();

// const peer = new Peer();
peer.on('open', (id) => {
    console.log(id);
    socket.emit('join-room-request', roomId, id); // basic emit from client to server
});

socket.on('user-disconnected', (id) => {
    allVidElements[id].remove();
    delete allVidElements[id];
})

// getting personal stream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then((stream) => {
    // adding my stream to the page
    myVidStream = stream;
    addVidStream(myVid, stream);

    // socket listening for add-new-user-peer event to get peer id of remote client
    socket.on('add-new-user-peer', (id) => {
        connectNewUser(id, stream); // this function calls the given peer using id
    })

    // if called, the call is answered
    peer.on('call', (call) => {
        // Answer the call, providing our mediaStream
        call.answer(stream);
        // insert the caller's stream to video-grid
        const vid = document.createElement('video');
        allVidElements[call.peer] = vid;

        call.on('stream', (remoteClientStream) => {
            console.log('answering call from -> ' + call.peer);
            addVidStream(vid, remoteClientStream);
        });

    });
});

// function to call and add receiver's stream
const connectNewUser = (id, stream) => {
    const call = peer.call(id, stream);
    // when call gets answered by remote user
    const remoteClientVid = document.createElement('video');
    allVidElements[call.peer] = remoteClientVid;

    call.on('stream', (remoteClientStream) => {
        console.log('doing call to ->' + id);
        addVidStream(remoteClientVid, remoteClientStream);
    });
}

// function to add video stream to a given video element
const addVidStream = (myVid, stream) => {
    myVid.srcObject = stream;
    myVid.addEventListener('loadedmetadata', () => {
        myVid.play();
    })
    videoGrid.append(myVid);
}