import './style.css'
import { getRoom } from './peer';

const videoElement = document.querySelector<HTMLVideoElement>('video');
if (!videoElement) {
  throw new Error('video element not found');
}

const room = getRoom();
if (!room) {
  throw new Error('room not found');
}

room.onPeerJoin((peerId) => {
  console.log('peer joined', peerId);

  if(!amIStreaming() || !activeStream)
    return;

  room.addStream(activeStream, peerId);
});

room.onPeerStream((stream, peerId, peerMetadata) => {
  stopStream(false);
  activeStream = stream;
  videoElement.srcObject = stream;
});

//add stream screen button
const streamButton = document.querySelector<HTMLButtonElement>('#stream');
if (!streamButton) {
  throw new Error('stream button not found');
}

let activeStream: MediaStream | null = null;
const amIStreaming = () => streamButton?.classList.contains('active');

const stopStream = (isStreaming: boolean) => {
  streamButton.classList.remove('active');
  streamButton.textContent = 'Stream';

  if (activeStream) {
    if (isStreaming) {
      room.removeStream(activeStream);
    }

    activeStream.getTracks().forEach(track => track.stop());
  }

  activeStream = null;
}

const startStream = async () => {
  streamButton.textContent = 'Stop';
  streamButton.classList.add('active');
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  activeStream = stream;
  room.addStream(stream);
  videoElement.srcObject = stream;
};

streamButton?.addEventListener('click', async () => {
  const isStreaming = amIStreaming();
  if (isStreaming) {
    stopStream(isStreaming);
    return;
  }

  await startStream();
});

/*
const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
player.src = { src: videoStream, type: 'video/object' };
*/