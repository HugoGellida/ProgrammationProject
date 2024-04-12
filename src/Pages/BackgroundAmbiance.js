import { useEffect, useRef } from "react";

export default function BackgroundAmbiance({ source, volume, noloop, onEnded }) {
    const audioRef = useRef();

    const handleEnded = () => {
        if (onEnded) onEnded();
    }

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("ended", handleEnded);
        audio.volume = volume;
        audio.loop = noloop ? false : true;
        audio.play();
        return () => {
            audio.pause();
        }
    }, []);

    return (
        <audio ref={audioRef}>
            <source src={source} type="audio/mp3" />
        </audio>
    )
}