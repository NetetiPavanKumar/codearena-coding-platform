import { useRef, useState } from "react";
import "./Signup.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export default function Signup(){
    const nav=useNavigate();
    const [userData,setUserData]=useState({userEmail:"",userName:"",password:"",});
    const [confirmPass,setConfirmPass]=useState("");
    const nameref=useRef();
    const emailref=useRef();
    const passref=useRef();
    const confirmref=useRef();
    const passwordref=useRef();
    const cpasswordref=useRef();
    const [showPass,setShowPassWord]=useState(false);
    const [showConfirmPass,setShowConfirmPassWord]=useState(false);
    const [userExists,setUserExists]=useState(false);


    function validateConfirmPass(){
        if(userData.password===confirmPass){
            confirmref.current.style.display="none";
            return true;
        }
        confirmref.current.style.display="block";
        return false;
    }

    function validateName(){
        if(userData.userName.length<=2){
            nameref.current.style.display="block";
            return false;
        }
        nameref.current.style.display="none";
        return true;
    }

    function validateEmail(){
        if(!(/^[A-Za-z]+[A-Za-z0-9]+@[a-z]+\.[a-z]+$/.test(userData.userEmail))){
            emailref.current.style.display="block";
            return false;
        }
        emailref.current.style.display="none";
        return true;
    }

    function validatePassword(){
        if(userData.password.length<8){
            passref.current.style.display="block";
            return false;
        }
        if(/[A-Z]/.test(userData.password) && /[a-z]/.test(userData.password) && /[0-9]/.test(userData.password) && /(?=.*[@$!%*?&])/.test(userData.password)){
            passref.current.style.display="none";
            return true;
        }
        else{
            passref.current.style.display="block";
            return false;

        }
    }


    function validateUserData(){
        let isname=validateName();
        let isemail=validateEmail();
        let ispass=validatePassword();
        let isconfirm=validateConfirmPass();
        if(isname && isemail && ispass && isconfirm){
            return true;
        }
        return false;
        
    }

    async function postUserData(){
        try{
        let response=await axios.post("http://localhost:3000/users",userData);
        if(response.data.msg==="User already exist"){
            emailref.current.style.display="block";
            setUserExists(true);
            return false;
        }
        return true;
        }
        catch(err){
            console.log("User already Existed",err);
            return false;
        }
    }
    return(
        <>
            <div className="signup-main">
                <h2 onClick={()=>{
                    nav("/")
                }} style={{cursor:"pointer",color:"rgb(230, 231, 231)",}}>{"</>"}CodeArena</h2>
                <h3>Welcome Back</h3>
                <p>Start your coding journey today</p>
                <div className="signup-body">
                    <label>User Name</label>
                    <input type="text" placeholder="Pavan Kumar Neteti" className="input-signup" onChange={(e)=>{
                        userData.userName=e.target.value;
                        setUserData(userData);
                    }}></input>
                    <div ref={nameref} className="err-class name-err"><span>*</span>Name should have atleast two characters</div>
                    <label>Email Address</label>
                    <input type="email" placeholder="pavankumarneteti717@gmail.com" className="input-signup" onChange={(e)=>{
                        userData.userEmail=e.target.value;
                        setUserData(userData);
                    }}></input>
                    <div ref={emailref} className="err-class email-err"><span>*</span>{userExists?"User Already Existed":"Enter valid Email Id"}</div>

                    <label>Password</label>
                    <input type={showPass?"text":"password"} placeholder="........" className="input-signup" onChange={(e)=>{
                        userData.password=e.target.value;
                        setUserData(userData);
                    }}></input>
                    <div ref={passref} className="err-class pass-err"><span>*</span>Password must contain atleast 8 characters that includes atleast one Capital, small letters, digits and special characters.</div>
                    <div><input type="checkbox" id="show-pass" onChange={(e)=>{
                        if(e.target.checked){
                        setShowPassWord(true);
                        }
                        else{
                            setShowPassWord(false);
                        }
                    }}></input><label htmlFor="show-pass" style={{cursor:"pointer",backgroundColor:"#f9eded",padding:"5px",borderRadius:"5px"}}>Show Password</label></div>

                    <label>Confirm Password</label>
                    <input type={showConfirmPass?"text":"password"} placeholder="........" className="input-signup" onChange={(e)=>{
                        setConfirmPass(e.target.value)
                    }}></input>
                    <div><input type="checkbox" id="show-conf-pass" onChange={(e)=>{
                        if(e.target.checked){
                        setShowConfirmPassWord(true)
                        }
                        else{
                            setShowConfirmPassWord(false);
                        }
                    }}></input><label htmlFor="show-conf-pass" style={{cursor:"pointer",backgroundColor:"#f9eded",padding:"5px",borderRadius:"5px"}}>Show Confirm Password</label></div>

                    <div ref={confirmref} className="err-class confirm-err"><span>*</span>Password Mismatched</div>

                    {/* <div><input type="checkbox" />I agree to the Terms of Service and Privacy Policy.</div> */}
                    <button className="create-account-btn" onClick={async()=>{
                        if(validateUserData()){
                            if(await postUserData()){
                        nav("/signin");
                        }
                        else{
                            console.log("wrong post")
                        }
                        }
                        else{
                            console.log("wrong")
                        }
                    }}>Create Account</button>
                    <div id="signin-up"><span>Already have an account?</span><span style={{color:"green",fontWeight:"bold",cursor:"pointer"}} onClick={()=>{
                        nav("/signin")
                    }}>Sign in</span></div>
                </div>
            </div>
        </>
    )
}