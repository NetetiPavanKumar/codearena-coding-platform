import { useEffect,useState } from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import api from "./api";
export default function Header({isauth,setAuth,currRole,setCurrRole,role}){
    const nav=useNavigate();
    async function Logout(){
        try{
            // await axios.post("http://localhost:3000/logout",{},{
            await api.post("/logout",{},{
                withCredentials:true,
            })
            setAuth(false)
        }
        catch(err){
            console.log("Error while Logging Out",err);
            setAuth(true)
        }
    }
    return(
    <>
        <div id="title-are">
            <div id="title-area" onClick={()=>{
            nav("/")
            }}>
                <h3 id="app-icon">{"< />"}</h3>
                <h3 id="app-name">CodeArena</h3>
            </div>
            <div id="profile-area">
                {isauth?(<><p onClick={()=>{
                    nav("/problems")
                }} style={{cursor:"pointer"}}>Problems</p>
                <p onClick={()=>{
                    nav(`/profile/`)
                }} style={{cursor:"pointer"}}>Profile</p></>):""}
                <button className="signin-btn" onClick={()=>{
                    isauth?Logout():nav("/signin")
                }}>{isauth?"Sign Out":"Sign in"}</button>
                <select className="role-options" value={currRole} onChange={(e)=>{
                    if(e.target.value==="User"){
                        setCurrRole("User")
                    }
                    else if(e.target.value==="Admin"){
                        setCurrRole("Admin")
                    }
                }}>
                    {role==="Admin"?<option>Admin</option>:""}
                    <option>User</option>
                </select>
            </div>
        </div>
    </>
    )
}