import { Fragment } from "react"
import "./App.css"
import { useNavigate } from "react-router-dom"
import Header from "./Header.jsx";
import { useState,useEffect } from "react";
export default function App({isauth,setAuth,currRole,setCurrRole,role}){
  const nav=useNavigate();
  return(
    <>
      <Header isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />
      <div id="main-content">
        <h1>Master Coding Interviews</h1>
        <p>Practice coding problems, improve your skills, and track your progress with our curated collection of challenges.</p>
        <div>
        <button className="main-btns-start" onClick={()=>{
          isauth?nav("/problems"):nav("/signin")
        }}>Start Practicing</button>
        {isauth?(""):(<button className="main-btns" onClick={()=>{
          nav("/signup")
        }}>Sign up</button>)}
        </div>
      </div>
      <div className="boxes">
        <div className="box">
          <h2 className="icon">{"</>"}</h2>
          <h2>Curated Problems</h2>
          <p>Hundreds of coding challenges covering data structures, algorithms, and more.</p>
          </div>
        <div className="box">
          <h2 className="icon">{"{}"}</h2>
          <h2>Real-time Feedback</h2>
          <p>Get instant feedback on your solutions with comprehensive test cases.</p>
        </div>
        <div className="box">
          <h2 className="icon">{"//"}</h2>
          <h2>Track Progress</h2>
          <p>Monitor your improvement with detailed statistics and achievement tracking.</p>
        </div>
      </div>
      <div className="bottom-card">
        <h2>Ready to Level Up?</h2>
        <p>Join thousands of developers improving their coding skills every day.</p>
        <button className="main-btns-start" onClick={()=>{
          isauth?nav("/problems"):nav("/signin")
        }}>Browse problems</button>
      </div>
      <p style={{textAlign:"center",}}>© 2026 CodeArena. Built for competitive programming practice.</p>
    </>
  )
}