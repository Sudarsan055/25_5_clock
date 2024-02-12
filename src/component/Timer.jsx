import React, { useState,useEffect,useRef } from 'react'
import sound from '../audio/alarm.wav'

export default function Timer() {
    const [slength,newslength]=useState(25)
    const [blength,newblength]=useState(5)
    const [timeleft,setTimeLeft]=useState(slength*60)
    const [timeLabel,setTimeLabel]=useState("session")
    const [running,setRunning]=useState(false)

    const beep = useRef(null)

    function incrementSessionLength(){
        if(slength<60){
          newslength(slength+1)
          setTimeLeft((slength+1)*60)
        }
    }
    function decrementSessionLength(){
      if(slength>1){
        newslength(slength-1)
        setTimeLeft((slength-1)*60)
      }  
    }
    const decrementBreakLength = () => {
      if (blength > 1) newblength(blength - 1);
    };
  
    const incrementBreakLength = () => {
      if (blength < 10) newblength(blength + 1);
    };
    // const toggleTimer = () => {
    //     setRunning(!running);
    // }if you want to set start and stop in one button
    const resetTimer = () => {
        setRunning(false);
        setTimeLabel('Session');
        newblength(5);
        newslength(25);
        setTimeLeft(25 * 60);
        beep.current.pause();
        beep.current.currentTime = 0;
    }
    useEffect(() => {
        let timer;
    
        if (running) {
          timer = setInterval(() => {
            setTimeLeft((prevTime) => {
              if (prevTime > 0) {
                return prevTime - 1;
              } else {
                if (timeLabel === 'Session') {
                  setTimeLabel('Break');
                  setTimeLeft(blength * 60);
                } else {
                  setTimeLabel('Session');
                  setTimeLeft(slength * 60);
                } 
                beep.current.play(); 
              }
            });
          }, 1000);
        } else {
          clearInterval(timer);
        }
    
        return () => clearInterval(timer);
      }, [running, timeLabel, blength, slength])

  return (
    <div>
        
        <div className='timeAdjust'>
            <div style={{height:"12rem",width:'12rem',display:'flex',justifyContent:'center',alignItems:'center',gap:'0.5rem'}}>
                <button className='button' onClick={incrementBreakLength}>+</button>
                <div className='lengthDisplay' style={{height:"8rem",width:'8rem',display:'flex',justifyContent:'center',alignItems:'center'}}>Break Length:<br/>{blength} min</div>
                <button className='button' onClick={decrementBreakLength}>-</button>
            </div>
            <div style={{height:"12rem",width:'12rem',display:'flex',justifyContent:'center',alignItems:'center',gap:'0.5rem'}}>
                <button className='button' onClick={incrementSessionLength}>+</button>
                <div className='lengthDisplay' style={{height:"8rem",width:'8rem',display:'flex',justifyContent:'center',alignItems:'center'}}>Session Length:<br/>{slength} min</div>
                <button className='button' onClick={decrementSessionLength}>-</button>
            </div>
        </div>
        <div className='displayBoard'>
            <div className='timeDisplay'>
                <label style={{fontWeight:'bolder',textDecoration:'underline',fontSize:'1.3rem'}} htmlFor="">{timeLabel}</label>
                <h1 id='displayTime'>{`${Math.floor(timeleft / 60)
            .toString()
            .padStart(2, '0')}:${(timeleft % 60).toString().padStart(2, '0')}`}</h1>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem',marginBottom:"10px"}}>
                    <button className='button' onClick={()=>{setRunning(false)}}>STOP</button>
                    <button className='button' onClick={()=>{setRunning(true)}}>START</button>
                    <button className='button' onClick={resetTimer}>RESTART</button>
                    <audio id="beep" ref={beep} src={sound} />
                </div>
            </div>
        </div>
    </div>
  )
}
