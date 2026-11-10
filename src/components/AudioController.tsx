import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  hasUserInteracted: boolean;
}

export const AudioController: React.FC<AudioControllerProps> = ({ hasUserInteracted }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;
    } catch {
      // AudioContext not supported - graceful fallback
    }
  };

  const playTone = (freq: number, startTime: number, duration: number, volume: number = 0.08) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(volume, startTime + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.4, startTime + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(master);

    osc.start(startTime);
    oscHarmonic.start(startTime);
    osc.stop(startTime + duration + 0.1);
    oscHarmonic.stop(startTime + duration + 0.1);
  };

  // Romantic arpeggiated wedding chords (Canon in D / romantic progression)
  const CHORD_PROGRESSION = [
    [293.66, 369.99, 440.0, 587.33, 739.99], // D Major
    [220.0, 329.63, 440.0, 554.37, 659.25],  // A Major
    [246.94, 293.66, 369.99, 493.88, 587.33], // B minor
    [196.0, 293.66, 392.0, 493.88, 587.33],  // G Major
  ];

  const startMusicLoop = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.8);

    let chordIndex = 0;
    const chordDuration = 4.0;

    const scheduleNextChord = () => {
      const now = ctx.currentTime;
      const notes = CHORD_PROGRESSION[chordIndex % CHORD_PROGRESSION.length];

      playTone(notes[0], now, 3.8, 0.12);

      for (let i = 1; i < notes.length; i++) {
        const delay = 0.35 * i + Math.random() * 0.08;
        playTone(notes[i], now + delay, 3.2, 0.08);
      }

      if (Math.random() > 0.4) {
        const topNote = notes[notes.length - 1] * 1.5;
        playTone(topNote, now + 2.0, 2.6, 0.04);
      }

      chordIndex++;
    };

    scheduleNextChord();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(scheduleNextChord, chordDuration * 1000);

    setIsPlaying(true);
  };

  const stopMusic = () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (master && ctx) {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleToggle = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (isPlaying && !isMuted) {
      setIsMuted(true);
      stopMusic();
    } else {
      setIsMuted(false);
      startMusicLoop();
    }
  };

  useEffect(() => {
    if (hasUserInteracted && !isPlaying && !isMuted) {
      initAudio();
      startMusicLoop();
    }
  }, [hasUserInteracted, isMuted, isPlaying]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed top-3 right-3 z-50 pt-safe pr-safe pointer-events-auto">
      <button
        onClick={handleToggle}
        type="button"
        className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full glass-panel border border-pink-400/20 text-pink-200/90 hover:text-pink-100 hover:border-pink-300/40 hover:bg-rose-950/40 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40"
        aria-label={isPlaying ? 'Mute melody' : 'Play melody'}
      >
        <span className="relative flex h-2 w-2">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isPlaying ? 'bg-pink-400' : 'bg-gray-500'
            }`}
          />
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300 animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300/60" />
        )}

        <span className="text-[11px] sm:text-xs font-serif italic tracking-wide text-pink-200/80 group-hover:text-pink-100">
          {isPlaying ? 'Melody' : 'Music Off'}
        </span>
      </button>
    </div>
  );
};
