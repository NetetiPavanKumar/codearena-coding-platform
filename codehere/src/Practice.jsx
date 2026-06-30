import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios"
import "./Practice.css"
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Practice({isauth,setAuth,currRole,setCurrRole,role}){
    const [currSelected,setSelected]=useState(0);
    let [curr_page,setCurrPage]=useState(1);
    let [fields,setFields]=useState(5);
    const nav=useNavigate();
    let btns=["All","Easy","Medium","Hard"];
    let page_btns=[];
    const [probs,setProbs]=useState([]);
    const [probs_,setProbs_]=useState([]);
        async function getProblems(){
                // let response=await axios.get("http://localhost:3000/problems",{
                let response=await api.get("/problems",{
                    withCredentials:true,
                });
                let res=response.data;
                console.log(res);
                setProbs(res);
                setProbs_(res);
                console.log("From Start.jsx");
            }
            useEffect(()=>{
                getProblems();
            },[])
    const [dup_probs,setDups]=useState([]);

    function showPageBtns(probs_1,probs_in_page){
        let no_of_pages=Math.ceil(probs_1.length/probs_in_page);
        console.log("No of Pages : ",no_of_pages)
        let page_btns_dups;

        for(let i=1;i<=no_of_pages;i++){
            page_btns.push(i);
        }

        if(no_of_pages>3){
            let dups_page_btns=page_btns.slice(0,3);
            page_btns_dups=dups_page_btns.map((btn)=>{
                return(
                    <button id="page-btns" onClick={()=>{
                        setCurrPage(btn);
                        paginate(probs_1,btn,fields)
                    }} className={curr_page==btn?"active-green":""}>{btn}</button>
                )
            })
            page_btns_dups.push(<><span id="page-btns">....</span><button id="page-btns" onClick={()=>{
                    setCurrPage(no_of_pages);
                    paginate(probs_1,no_of_pages,fields)
                }} className={curr_page==no_of_pages?"active-green":""}>{no_of_pages}</button></>)
        }

        else{
            page_btns_dups=page_btns.map((btn)=>{
                return(
                        <button id="page-btns" onClick={()=>{
                        setCurrPage(btn);
                        paginate(probs_1,btn,fields)
                    }} className={curr_page==btn?"active-green":""}>{btn}</button>
                )
            })
        }

        page_btns_dups.unshift(<button onClick={()=>{
            if(curr_page>1){
                let cp=curr_page-1;
                setCurrPage(cp);
                paginate(probs_1,cp,fields);
            }
            }} className={curr_page<=1?"block-btn":"active-btn"}>{"<< "}Prev</button>)

            
        page_btns_dups.push(<button onClick={()=>{
            if(curr_page<no_of_pages){
                let cp=curr_page+1;
                setCurrPage(cp);
                paginate(probs_1,cp,fields);
            }
            }} className={curr_page>=no_of_pages?"block-btn":"active-btn"}>Next{" >>"}</button>)
        
        return page_btns_dups;
    }
    function paginate(probs_1,curr_page,probs_in_page){
        let start_ind=(curr_page-1)*probs_in_page;
        let end_ind=(curr_page)*probs_in_page-1;
        let dups=probs_1.filter((prob,ind)=>{
            if(ind>=start_ind && ind<=end_ind){
                return true;
            }
            else{
                return false;
            }
        })
        setDups(dups)
    }

    function searchedProbs(inp){
        let prs=probs.filter((prob)=>{
            if(prob.p_title.toLowerCase().includes(inp.toLowerCase())){
                return true;
            }
            return false;
        })
        setProbs_(prs);
        showPageBtns(prs,fields);
        paginate(prs,1,fields);
        
    }

    function filterByLevel(level){

        if(level==="All"){
            setProbs_(probs);
            showPageBtns(probs,fields);
            paginate(probs,1,fields);
            return;
        }
        let prs=probs.filter((prob)=>{
            if(prob.p_diff.toLowerCase().includes(level.toLowerCase())){
                return true;
            }
            return false;
        })
        setProbs_(prs);
        showPageBtns(prs,fields);
        paginate(prs,1,fields);

    }

    async function deleteProblem(id){
        try{
        // let response=await axios.delete(`http://localhost:3000/deleteproblem/${id}`,{
        let response=await api.delete(`/deleteproblem/${id}`,{

            withCredentials:true,
        });
        console.log("Deleted Successfully :",response.data);
        getProblems();
        }
        catch(err){
            console.log("Error While Deleting :",err)
        }
    }

    useEffect(()=>{
        console.log("from practice.jsx useeffect")
        paginate(probs,curr_page,5);
    },[probs])
    return(
        <>
            <Header isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role}/>
            <div id="problems">
            <div id="p1">
                <div id="p2">
                    <h2>Problem Set</h2>
                    <p>Practice coding challenges to improve your skills</p>
                </div>
                <div id="p3">{currRole==="Admin"?<button id="add-p3" onClick={(e)=>{
                    nav("/addproblem");
                }}>Add Problem</button>:""}</div>
            </div>
            <div id="set-probs">
                <div id="search-bar">
                <select onChange={(e)=>{
                    let _probs=[...probs];
                    setProbs_(_probs);
                    setFields(e.target.value);
                    setCurrPage(1);
                    paginate(probs,1,e.target.value);
                }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    {/* <option value={20}>20</option>
                    <option value={25}>25</option> */}
                </select>
                <input type="search" id="input-search" placeholder="Search Problems" onChange={(e)=>{
                    let inp=e.target.value;
                    searchedProbs(inp);
                }}></input>
                {/* <button className="practice-buttons" onClick={()=>{
                    setbgs();
                }}>All</button>
                <button className="practice-buttons">Easy</button>
                <button className="practice-buttons">Medium</button>
                <button className="practice-buttons">Hard</button> */}
                {btns.map((btn,ind)=>{
                    return(
                        <button className={currSelected==ind?"bg-green":"practice-buttons"} onClick={()=>{
                            setSelected(ind);
                            filterByLevel(btn);
                        }} key={ind}>{btn}</button>
                    )
                })}
                </div>
                <table id="tble">
                    <colgroup>
                        <col style={{width:"10%"}}/>
                        <col style={{width:"50%"}}/>
                        <col style={{width:"20%"}}/>
                        <col style={{width:"10%"}}/>
                        <col style={{width:"10%"}}/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Tilte</th>
                            <th>Category</th>
                            <th>Difficutly</th>
                            <th>Acceptance</th>
                        </tr>
                    </thead>
                    <tbody>
                            {/* <td>dlhvjjsk</td>
                            <td>jdnsl</td>
                            <td>jdnsl</td>
                            <td>jdnsl</td>
                            <td>jdnsl</td> */}
                            {dup_probs.map((prob,ind)=>{
                                return(<tr key={prob.p_id}>
                                <td>{prob.status || "False"}</td>
                                <td>{<span style={{cursor:"pointer",color:"rgb(15, 95, 15)"}} onClick={(e)=>{
                                    nav(`/problems/${prob.p_id}`)
                                }}>{prob.p_title}</span>}</td>
                                <td>{prob.p_category}</td>
                                <td>{prob.p_diff || "Easy"}</td>
                                <td>{prob.p_accept}</td>
                                {currRole==="Admin"?(<><td><button className="edit-btn" onClick={(e)=>{
                                    nav(`/editproblem/${prob.p_id}`);
                                }}>Edit</button></td>
                                <td><button className="delete-btn" onClick={()=>{
                                    deleteProblem(prob.p_id);
                                }}>Delete</button></td></>):""}
                                </tr>)
                            })}
                    </tbody>
                </table>
            </div>
                <div id="pages">
                    <div>🟢Accepted | 🔴Wrong Answer | 🟡Not Attempted</div>
                    <div id="show-page-btns">{showPageBtns(probs_,fields)}</div>
                </div>
            </div>
        </>
    )
}