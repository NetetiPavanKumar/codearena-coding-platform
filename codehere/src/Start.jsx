import App from "./App.jsx"
import Signin from "./Signin.jsx"
import Signup from "./Signup.jsx"
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Profile from "./Profile.jsx"
import Practice from "./Practice.jsx"
import Problem from "./Problem.jsx"
import AddProblem from "./AddProblem.jsx"
import { useState,useEffect } from "react"
import EditProblem from "./EditProblem.jsx"
import axios from "axios"
import api from "./api.js"
import "./Start.css"

export default function Start(){
    const [isauth,setAuth]=useState(false);
    const [currRole,setCurrRole]=useState("");
    const [role,setRole]=useState("");
    const [loading,setLoading]=useState(true);

          async function authenticated(){
              try{
                setLoading(true);
            //   let response=await axios.get("http://localhost:3000/me",{
              let response=await api.get("/me",{
                  withCredentials:true,
              });
              console.log("Setting True", response)
              let role_=response.data.userRole;
              role_==="Admin"?setCurrRole(role_):setCurrRole(role_);
              console.log(role_);
              setRole(role_);
              setAuth(true);
              }
              catch(err){
              console.log("Error from Header",err)
                  setAuth(false)
              }
              finally{
                setLoading(false);
              }
          }
          useEffect(()=>{
              console.log("Rendering from Header")
              authenticated();
          },[])
    if(loading){
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
            )
    }
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />} />
                <Route path="/signin" element={<Signin setAuth={setAuth} authenticated={authenticated}/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile/" element={isauth?<Profile isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role}/>:<Signin setAuth={setAuth} />} />
                <Route path="/problems" element={isauth?<Practice isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />:<Signin setAuth={setAuth} />} />
                <Route path="/problems/:id" element={isauth?<Problem isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />:<Signin setAuth={setAuth} />} />
                <Route path="/addproblem" element={isauth?(role==="Admin"?<AddProblem />:<Practice isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />):<Signin setAuth={setAuth} />} />
                <Route path="/editproblem/:id" element={isauth?(role==="Admin"?<EditProblem />:<Practice isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />):<Signin setAuth={setAuth} />} />
            </Routes>
        </BrowserRouter>
    )
}