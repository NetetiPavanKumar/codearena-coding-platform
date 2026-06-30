import "./Signin.css"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react";
import axios from "axios"
export default function Signin({setAuth,authenticated}){
    const nav=useNavigate();
    const [email,setEmail]=useState("");
    const [pass,setPass]=useState("");
    const [showPass,setShowPass]=useState(false);
    const credsref=useRef();

    async function checkLogin(){
        try{
        let response=await axios.post("http://localhost:3000/login",{email,pass},{
            withCredentials:true,
        });
        // console.log(response.data);
            credsref.current.style.display="none";
            await authenticated();
        return true;
        }
        catch(err){
            console.log("Error Occured at check Login: ",err);
            credsref.current.style.display="block";
            return false;
        }
    }
    return(
        <>
        <div id="signin-box">
            <h2 onClick={()=>{
                    nav("/")
                }} style={{cursor:"pointer",color:"rgb(230, 231, 231)"}}>{"</>"}CodeArena</h2>
            <h3>Welcome Back</h3>
            <p>Sign in to continue your coding journey</p>
            <div className="inputs">
                <label>Email Address</label>
                <input type="text" placeholder="pavankumarneteti717@gmail.com" className="input-box" onChange={(e)=>{
                    setEmail(e.target.value);
                }}/>
                <label>Password</label>
                <input type={showPass?"text":"password"} placeholder="Pavan8345@" className="input-box" onChange={(e)=>{
                    setPass(e.target.value);
                }}/>
                <div><input type="checkbox" id="show-pass-signin" onChange={(e)=>{
                        if(e.target.checked){
                        setShowPass(true);
                        }
                        else{
                            setShowPass(false);
                        }
                    }}></input><label htmlFor="show-pass-signin" style={{cursor:"pointer",backgroundColor:"#f9eded",padding:"5px",borderRadius:"5px"}}>Show Password</label></div>
                <div id="forget"><div style={{color:"green",fontWeight:"normal",cursor:"pointer",marginRight:"10px"}}>Forgot Password?</div></div>
                <div id="invalid" className="err-class-1"><div ref={credsref} className="inval">* Invalid Email or Password</div></div>
                <button id="signin-btn-full" onClick={async()=>{
                    let result=await checkLogin();
                    if(result){
                        setAuth(true);
                        nav("/")
                    }
                    else{
                        console.log("Invalid Credentials")
                    }
                }}>Sign In</button>
                <div className="dont-have"><p>Don't have an account? <span style={{color:"green",fontWeight:"bold",fontFamily:"-apple-system",cursor:"pointer"}} onClick={()=>{
                    nav("/signup")
                }}>Sign up</span></p></div>
            </div>
        </div>
        </>
    )
}