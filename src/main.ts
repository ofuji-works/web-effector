export class EffectCore {
  private readonly audioContext: AudioContext;
  private mediaStreamAudioSourceNode?: MediaStreamAudioSourceNode;
  private connectedAudioNode?: AudioNode;

  private analyser?: AnalyserNode;

  constructor() {
    this.audioContext = new (window.AudioContext ||
      // @ts-ignore
      window.webkitAudioContext)();
    this.analyze = this.analyze.bind(this);
  }

  async connect() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.mediaStreamAudioSourceNode =
      this.audioContext.createMediaStreamSource(stream);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.5;

    const destination = this.audioContext.createMediaStreamDestination();
    destination.stream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });

    this.analyser = new AnalyserNode(this.audioContext, { fftSize: 2048 });

    this.connectedAudioNode = this.mediaStreamAudioSourceNode
      .connect(gainNode)
      .connect(this.analyser)
      .connect(destination);

    this.audioContext.resume();
  }

  async analyze(canvas: HTMLCanvasElement) {
    if (!this.analyser) {
      throw new Error('Analyser is not initialized');
    }

    const bufferLength = this.analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    const canvasCtx = canvas.getContext('2d');

    const draw = () => {
      if (!this.analyser || !canvasCtx) {
        throw new Error('Analyser is not initialized');
      }

      requestAnimationFrame(draw);
      this.analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    draw();
  }

  async disConnect() {
    if (!this.connectedAudioNode) {
      throw new Error('AudioNode is not connected');
    }
    this.connectedAudioNode.disconnect();
  }
}
