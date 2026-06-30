import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditProblem(){
    const params=useParams()
    const prob_id=params.id;
    const [prob,setProb]=useState({});
    const [testcases,setTestCases]=useState([{input:"",output:"",isPublic:true},{input:"",output:"",isPublic:true}]);
    const [title,setTitle]=useState("");
    const [category,setCategory]=useState("");
    const [diff,setDiffi]=useState("Easy");
    const [e1,setE1]=useState("");
    const [e2,setE2]=useState("");
    const [constr,setConstr]=useState("");
    const [pr,setPr]=useState("");
    const [driverCodes,setDriverCodes]=useState([{lang:"JavaScript",fntemp:"",drcode:""},{lang:"Python",fntemp:"",drcode:""},{lang:"C",fntemp:"",drcode:""},{lang:"Java",fntemp:"",drcode:""}])

    const nav=useNavigate();


    async function findProblem(){
        let response=await axios.get(`http://localhost:3000/problems/${prob_id}`,{
            withCredentials:true,
        });
        let matched=response.data.data;
        console.log("Matched_Prob :",matched)
        setProb(matched);
        setPr(matched.p_prob);
        setTitle(matched.p_title);
        setCategory(matched.p_category);
        setDiffi(matched.p_diff);
        setE1(matched.p_e1);
        setE2(matched.p_e2);
        setConstr(matched.p_constr);
        setTestCases(matched.p_testcases);
        setDriverCodes(matched.p_driverCodes);
    }

    async function updateProblem(){
        try{
        let response=await axios.put(`http://localhost:3000/updateproblem/${prob_id}`,{
            p_prob:pr,
            p_title:title,
            p_category:category,
            p_diff:diff,
            p_e1:e1,
            p_e2:e2,
            p_constr:constr,
            p_testcases:testcases,
            p_driverCodes:driverCodes,
        },{withCredentials:true}
        )
        console.log("Problem Updated", response.data)
    }
    catch(err){
        console.log("Error Occured while updating the problem:", err)
    }
    }


    function addTestCase(){
        let copy=[
            ...testcases,
            {
                input:"",
                output:"",
                isPublic:false,
            }
        ];
        setTestCases(copy);
    }

    useEffect(()=>{
        findProblem();
    },[])

    return(
        <>
            <p style={{color:"green",cursor:"pointer"}} onClick={()=>{
                nav("/problems")
            }}>{"< "}Back to Problems</p>
            <div className="add-prob">
            <h2 className="brand" onClick={()=>{nav("/")}}>{"</>"}CodeArena</h2>
            <h2 className="page-title">Update the Problem here</h2>
            <div className="main-prob">
                <div className="prob-inp-1">
                    <div>
                    <label>Title : </label>
                    <input className="inp-box" type="text" value={title} onChange={(event)=>{
                        setTitle(event.target.value);
                    }}></input>
                    </div>
                    <div>
                        <label>Category : </label>
                        <input className="inp-box" type="text" value={category} onChange={(e)=>{
                            setCategory(e.target.value);
                        }}></input>
                        </div>
                </div>
                <div className="prob-inp">
                    <div>
                    <label>Difficulty : </label>
                    <select className="inp-box-2" value={diff} onChange={(e)=>{
                        setDiffi(e.target.value);
                    }}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    </div>
                </div>
                <div className="prob-inp">
                        <label>Problem :</label>
                        <label>Description :</label>
                        <textarea rows={10} cols={100} value={pr} onChange={(e)=>{
                            setPr(e.target.value);
                        }} placeholder="Type your problem description here...."></textarea>
                </div>
                <div className="prob-inp">
                        <label>Examples :</label>
                        <label>Example 1 :</label>
                        <textarea rows={5} cols={100} value={e1} onChange={(e)=>{
                            setE1(e.target.value);
                        }}placeholder={`Input:
Output: 
Explanation:`}></textarea>
                </div>
                <div className="prob-inp">
                        <label>Example 2 :</label>
                        <textarea rows={5} cols={100} value={e2} onChange={(e)=>{
                            setE2(e.target.value);
                        }} placeholder={`Input:
Output: 
Explanation:`}></textarea>
                </div>
                <div className="prob-inp">
                        <label>Constraints :</label>
                        <textarea rows={5} cols={100} value={constr} onChange={(e)=>{
                            setConstr(e.target.value);
                        }} placeholder={`2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
Only one valid answer exists.`}></textarea>
                </div>
                <div id="test-case">
                    {testcases.map((test,ind)=>{return(
                    <div id="one-case" key={ind}>
                        <div id="test-cases">
                            <label>TestCase {ind+1}:</label>
                            <div style={{display:"flex",justifyContent:"flex-end", alignItems:"center"}}>
                                <label htmlFor={`show-test-${ind}`} 
                                style={{backgroundColor:"#dfdbdb",cursor:"pointer",padding:"3px 10px",borderRadius:"5px"}}
                               >Show Test Case</label>
                                <input type="checkbox" id={`show-test-${ind}`}  checked={test.isPublic} onChange={(e)=>{
                                    let copy=[...testcases];
                                    copy[ind].isPublic=e.target.checked;
                                    setTestCases(copy);
                                }}></input>
                            </div>
                        </div>
                        <div id="inp-out-main">
                        <div id="inp-out">
                            <label>Input</label>
                            <textarea rows={5} cols={50} value={testcases[ind].input} onChange={(e)=>{
                                let copy=[...testcases];
                                copy[ind].input=e.target.value;
                                setTestCases(copy);
                            }}/>
                        </div>
                        <div id="inp-out">
                            <label>Output</label>
                            <textarea rows={5} cols={45} value={testcases[ind].output} onChange={(e)=>{
                                let copy=[...testcases];
                                copy[ind].output=e.target.value;
                                setTestCases(copy);
                            }}/>
                        </div>
                        </div>
                        {ind+1>2?<div id="del-btn"><button id="delete-btn" onClick={(e)=>{
                            let copy=[...testcases];
                            copy.splice(testcases.length-1,1);
                            setTestCases(copy);
                        }}>Delete</button></div>:""}
                    </div>
                    )})
                    
                    }
                </div>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",width:"100%",}}><button style={{cursor:"pointer"}} onClick={()=>{
                    addTestCase();
                }}>➕Add Test Case</button></div>
                <div className="overall-drivers">
                    {driverCodes.map((dr,ind)=>{
                        return(
                        <>
                        <div id="one-driver">
                            <div><label>{dr.lang || "Python"}</label></div>
                            <div id="drivers">
                            <div id="driver-code">
                                <label>Function Template:</label>
                                <textarea rows={5} cols={43} value={dr.fntemp} onChange={(e)=>{
                                    let copy=[...driverCodes]
                                    copy[ind].fntemp=e.target.value;
                                    setDriverCodes(copy);
                                }}/>
                            </div>
                            <div id="driver-code">
                                <label>Driver Code:</label>
                                <textarea rows={5} cols={43} value={dr.drcode} onChange={(e)=>{
                                    let copy=[...driverCodes];
                                    copy[ind].drcode=e.target.value;
                                    setDriverCodes(copy);
                                }}/>
                            </div>
                            </div>
                        </div>
                        </>
                        )
                    })}
                </div>
                <button style={{width:"100%",height:"30px",backgroundColor:"green",cursor:"pointer",color:"white",borderRadius:"5px",}} onClick={()=>{
                    updateProblem();
                    nav("/problems");
                }}>Update Problem</button>
            </div>
            </div>
        </>
    )
}