import { useNavigate, useParams } from "react-router-dom"
import Header from "./Header.jsx"
import "./Problem.css"
import { useEffect, useState,useRef } from "react";
import axios from "axios"
import Editor from "@monaco-editor/react";
export default function Problem({isauth,setAuth,currRole,setCurrRole,role}){
    const params=useParams();
    const nav=useNavigate();
    const id=params.id;
    const [matched_prob,setMatched]=useState({});
    const [code,setCode]=useState("");
    const [language,setLanguage]=useState("JavaScript");
    const [output,setOutput]=useState("");
    const [executing,setExecuting]=useState(false);
    const [submitting,setSubmitting]=useState(false);
    const [showOutput,setShowOutput]=useState(false);
    const throttelleRef=useRef();
    const [showFlash,setShowFlash]=useState(false);

    async function findMatched(){
        let response=await axios.get(`http://localhost:3000/problems/${id}`,{
            withCredentials:true,
        });
        let matched=response.data.data;
        console.log("Matched_Prob :",matched)
        setMatched(matched);
        setCode(matched.JavaScript || matched.p_driverCodes[0].fntemp);
    }

    async function setDraft(lang){
        await findMatched();
        lang==="JavaScript"?setCode(matched_prob.JavaScript || matched_prob.p_driverCodes[0].fntemp)
                :lang==="Python"?setCode(matched_prob.Python || matched_prob.p_driverCodes[1].fntemp)
                :lang==="C"?setCode(matched_prob.C || matched_prob.p_driverCodes[2].fntemp)
                :lang==="Java"?setCode(matched_prob.Java || matched_prob.p_driverCodes[3].fntemp):setCode("")
    }


    async function submitCode(){
        let response=await axios.post(`http://localhost:3000/submitcode/${matched_prob.p_id}`,{
            code,
            language,
        },{
            withCredentials:true,
        })
        console.log("Output: ",response.data);
        let outloop=response.data.data;
        let out=outloop.map((outp,ind)=>{
            return(
                <>
                    <div className={outp.status==="Accepted"?"output-boxes":"failed-box"}>
                        <h4 id={outp.status==="Accepted"?"heading":"heading-failed"}>Test Case {ind+1} :</h4>
                        <h4>Input :</h4>{outp.input}
                        <h4>Expected :</h4>{outp.expected}
                        <h4>Actual :</h4>{outp.actual}
                    </div>
                </>
            )
        })
        
        out.unshift(<h3>{response.data.testcases_passed} passed out of {response.data.total_cases}</h3>)
        setSubmitting(false);
        setOutput(out);
    }


    async function runCode(){
        let response=await axios.post(`http://localhost:3000/run/${matched_prob.p_id}`,{
            code,
            language
        },{
            withCredentials:true
        });
        console.log("Output: ",response.data);
        let outloop=response.data.data;
        let out=outloop.map((outp,ind)=>{
            return(
                <>
                    <div className={outp.status==="Accepted"?"output-boxes":"failed-box"}>
                        <h4 id={outp.status==="Accepted"?"heading":"heading-failed"}>Test Case {ind+1} :</h4>
                        <h4>Input :</h4>{outp.input}
                        <h4>Expected :</h4>{outp.expected}
                        <h4>Actual :</h4>{outp.actual}
                    </div>
                </>
            )
        })
        
        // out.unshift(<h3>{response.data.testcases_passed} passed out of {response.data.total_cases}</h3>)
        setExecuting(false);
        setOutput(out);
    }


    async function saveDraft(draft,language){
        let response=await axios.post(`http://localhost:3000/autosave/${id}`,{
            draft,
            language,
            },{
                withCredentials:true,
            })
        console.log("Saved",response.data);
        setShowFlash(true)
        setTimeout(()=>{
            setShowFlash(false);
        },2000)
    }

    function throttelle(fn,delay){
        let last_call=0;
        let timer;
        function inner(inp,lang){
            let now=Date.now();
            if(now-last_call>=delay){
                last_call=Date.now();
                fn(inp,lang);
            }
            else{
                clearTimeout(timer);
                timer=setTimeout(()=>{
                    last_call=Date.now();
                    fn(inp,lang);
                },delay-(now-last_call));
            }
        }
        return inner;
    }

    useEffect(()=>{
        findMatched();
    },[])
    useEffect(()=>{
        throttelleRef.current=throttelle(saveDraft,5000);
    },[])
    return(
        <>
            <Header isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role} />
            <div id="problem-inp">
            <div id="problem-panel">
            <span style={{color:"green",cursor:"pointer"}} onClick={()=>{
                nav("/problems")
            }}>{"< "}Back to Problems</span>
            <h3>{matched_prob?matched_prob.p_title:""}</h3>
            <h5>{matched_prob?matched_prob.p_diff:""}</h5>
            <h4>Description</h4>
            <p>{matched_prob?matched_prob.p_prob:""}</p>
            <h4>Examples</h4>
            <div>
                <div className="exam">
                    <h4>Example 1</h4>
                    <div><span className="examples">{matched_prob?`${matched_prob.p_e1}`:""}</span></div>
                </div>
                <div className="exam">
                    <h4>Example 1</h4>
                    <div><span className="examples">{matched_prob?`${matched_prob.p_e2}`:""}</span></div>
                </div>
            </div>
            <h4>Constraints</h4>
            <p>{matched_prob?matched_prob.p_constr:""}</p>
            </div>
            <div id="editor-panel">
                {/* <input type="text" rows="5" cols="5"></input> */}
                <div id="editor-head">
                    <select id="lang" style={{width:"150px",marginLeft:"20px",fontSize:"16px",paddingLeft:"20px"}} onChange={(e)=>{
                        setLanguage(e.target.value);
                        setDraft(e.target.value);
                    }}>
                        <option value={"JavaScript"}>JavaScript</option>
                        <option value={"Python"}>Python</option>    
                        <option value={"C"}>C</option>
                        <option value={"Java"}>Java</option>
                    </select>
                    <div id={showFlash?"save":"not-save"}>{showFlash?"Saved Successfully":""}</div>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",paddingRight:"20px"}}><button className="run-code" onClick={(e)=>{
                        setShowOutput(true);
                        setSubmitting(true);
                        submitCode();
                    }}>Submit</button><button className="run-code" onClick={()=>{
                        setShowOutput(true);
                        setExecuting(true);
                        runCode();
                    }}>Run Code</button></div></div>
                {/* <textarea id={showOutput?"small-text-area":"text-area"} value={code} onChange={(e)=>{
                    setCode(e.target.value);
                }}/> */}
                {/* <Editor language={language} id={showOutput?"small-text-area":"text-area"} value={code} onChange={(value)=>setCode(value)} /> */}
                <div className={showOutput?"editor-small":"editor-large"}>
                    <Editor language={language} value={code} onChange={(value)=>{
                        throttelleRef.current(value,language);
                        setCode(value);
                    }} theme="vs-dark" />
                </div>
                {showOutput && <div id="output-box">
                    {executing?(<><h3>Output</h3><pre><div style={{textAlign:"center"}}><h3>🔃Executing....</h3></div></pre></>)
                    :submitting?(<><h3>Output</h3><pre><div style={{textAlign:"center"}}><h3>🔃Submitting....</h3></div></pre></>)
                    :(<><div id="output-cross"><h3>Output</h3><div style={{textAlign:"end"}}><button style={{cursor:"pointer",backgroundColor:"#fa3838",border:"none"}} onClick={()=>{
                        setShowOutput(false);
                    }}>X</button></div></div><pre>{output}</pre></>)}
                    
                </div>}
                </div>
            </div>
        </>
    )
}