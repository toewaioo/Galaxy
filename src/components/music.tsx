"use client";

import { useEffect, useRef } from 'react';

export default function Music() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay was prevented.
        // We'll add a one-time listener for the first user interaction.
        const playMusicOnClick = () => {
          audio.play();
          window.removeEventListener('click', playMusicOnClick);
        };
        window.addEventListener('click', playMusicOnClick);
      });
    }

  }, []);

  return (
    <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/11/17/audio_87a82b8202.mp3" loop />
  );
}
