const videoIcon = document.getElementById('video-icon');
const audioIcon = document.getElementById('audio-icon');
const shareIcon = document.getElementById('share-icon');

videoIcon.addEventListener("click", () => {
    const enabled = myVidStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVidStream.getVideoTracks()[0].enabled = false;
        videoIcon.innerHTML = `<i class="fa fa-solid fa-video-slash fa-lg"></i>`;
        videoIcon.style.color = 'red';
    } else {
        myVidStream.getVideoTracks()[0].enabled = true;
        videoIcon.innerHTML = `<i class="fa fa-solid fa-video fa-lg"></i>`;
        videoIcon.style.color = 'green';
    }
});

audioIcon.addEventListener('click', () => {
    const enabled = myVidStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVidStream.getAudioTracks()[0].enabled = false;
        audioIcon.innerHTML = `<i class="fa fa-solid fa-microphone-slash fa-lg"></i>`;
        audioIcon.style.color = 'red';
    } else {
        myVidStream.getAudioTracks()[0].enabled = true;
        audioIcon.innerHTML = `<i class="fa fa-solid fa-microphone fa-lg"></i>`;
        audioIcon.style.color = 'green';
    }
});

shareIcon.addEventListener('click', () => {
    prompt('Invite users to call by sharing the link below', window.location.href);
});