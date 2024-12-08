export const useSound = (audioUrl: string, preload = false) => {
  let audioContext: AudioContext | null = null;
  let audioBuffer: AudioBuffer | null = null;
  let source: AudioBufferSourceNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;

  const initContext = () => {
    if (!audioContext) {
      audioContext = new window.AudioContext();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
    }
    return audioContext;
  };

  const loadAudio = async () => {
    if (!audioBuffer) {
      try {
        const context = initContext();
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await context.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    }
    return audioBuffer;
  };

  const playSound = async (loop = false) => {
    try {
      const context = initContext();

      if (preload && !audioBuffer) {
        throw Error('If you use preloading, you need to call "loadAudio" function first');
      }

      const buffer = preload ? audioBuffer : await loadAudio();

      if (!buffer || !gainNode) return;

      if (isPlaying) {
        stopSound();
      }

      source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;
      source.connect(gainNode);

      source.onended = () => {
        if (!loop) {
          isPlaying = false;
        }
      };

      source.start(0);
      isPlaying = true;
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopSound = () => {
    if (source) {
      source.stop();
      source.disconnect();
      source = null;
      isPlaying = false;
    }
  };

  const getVolume = () => {
    if (!gainNode) return 100;
    return gainNode.gain.value * 100;
  };

  const setVolume = (newVolume: number) => {
    if (!gainNode) return;
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    gainNode.gain.value = clampedVolume / 100;
  };

  const resumeContext = async () => {
    if (audioContext?.state === 'suspended') {
      await audioContext.resume();
    }
  };

  const cleanup = () => {
    if (source) {
      source.stop();
      source.disconnect();
    }
    if (gainNode) {
      gainNode.disconnect();
    }
    if (audioContext) {
      audioContext.close();
    }
    audioContext = null;
    audioBuffer = null;
    source = null;
    gainNode = null;
    isPlaying = false;
  };

  return {
    loadAudio,
    playSound,
    stopSound,
    getVolume,
    setVolume,
    resumeContext,
    cleanup,
    get isPlaying() {
      return isPlaying;
    },
  };
};
