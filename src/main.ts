class EffectCore {
  private readonly audioContext: AudioContext;

  constructor(
    private readonly audioElement: HTMLMediaElement,
    private tracks: MediaStreamTrack[],
    private connectedAudioNode: AudioNode
  ) {
    this.audioContext = new AudioContext();
  }
  
  async connect() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const input = this.audioContext.createMediaStreamSource(stream);
    const destination = this.audioContext.createMediaStreamDestination();
    const mediaStream = destination.stream;
    this.audioElement.srcObject = mediaStream;
    this.tracks = mediaStream.getAudioTracks();
    this.connectedAudioNode = input.connect(destination);
  }

  async disConnect() {
    this.tracks.every(track => track.stop());
    this.connectedAudioNode.disconnect();
  }
}
