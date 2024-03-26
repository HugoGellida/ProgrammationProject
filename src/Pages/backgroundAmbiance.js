import { useEffect, useRef } from "react";

export default function BackgroundAmbiance(){
    const audioRef = useRef();

    useEffect(() => {
        const audio = audioRef.current;
        console.log(audio);
        audio.volume = 0.05;
        audio.loop = true;
        audio.play();
        return () => audio.pause();
    }, []);

    return (
        <audio ref={audioRef}>
            <source src="./backgroundAmbiance.mp3" type="audio/mp3"/>
        </audio>
    )
}