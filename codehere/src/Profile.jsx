import { useEffect, useState } from "react";
import Header from "./Header";
import "./Profile.css"
import axios from "axios"
export default function Profile({isauth,setAuth,currRole,setCurrRole,role}){

    const [stats,setStats]=useState("");
    async function getStats(){
        let response=await axios.get("http://localhost:3000/userstats",{
            withCredentials:true,
        })
        console.log("Stats :",response.data)
        setStats(response.data);
    }


    function getProfileLogo(name){
        let name_list=name.split(" ");
        let logo=""
        name_list.forEach((n)=>{
            logo+=n[0];
        })
        return logo;
    }

    function getTimeLine(time){
        const diff = Date.now() - new Date(time);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let result;

        if (minutes < 60) {
            result = `${minutes} minutes ago`;
        } else if (hours < 24) {
            result = `${hours} hours ago`;
        } else {
            result = `${days} days ago`;
        }
        return result;
    }
    useEffect(()=>{
        getStats();
    },[])
    return(
        <>
            <Header isauth={isauth} setAuth={setAuth} currRole={currRole} setCurrRole={setCurrRole} role={role}/>
            <div className="profile-box">
                <div id="main-profile">
                    <h1 style={{backgroundColor:"white",display:"flex",flexDirection:"row",alignItems:"center",padding:"0px 10px", marginLeft:"80px",borderRadius:"50px"}}>{stats?getProfileLogo(stats.userName):""}</h1>
                    <div><h2>{stats?stats.userName:""}</h2>
                    <p>{stats?stats.userEmail:""}</p>
                    <p>Member since {new Date(stats.createdAt).toLocaleString('default', { month: 'long' })} {new Date(stats.createdAt).getFullYear()}</p></div>
                </div>
                <div className="problems-box">
                    <div>
                    <p>{"@ "}Problems Solved</p>
                    <span style={{fontWeight:"bold"}}>{stats?stats.total_solved:""}</span>
                    </div>
                    <div>
                    <p>{"# "}Completion Rate</p>
                    <span style={{fontWeight:"bold"}}>{stats?stats.percent:""}%</span>
                    </div>
                    <div>
                    {/* <p>{"$ "}Current Streak</p>
                    <span style={{fontWeight:"bold"}}>7 days</span>
                    </div>
                    <div>
                    <p>{"% "}Global Ranking</p>
                    <span style={{fontWeight:"bold"}}>#12453</span> */}
                    </div>
                </div>
            </div>
            <div className="problem-stats">
                <div className="stats">
                    <h3>Problems Statistics</h3>
                    <div className="level"><p className="lev">Easy</p><p className="nums">{stats?stats.easy_solved:""}/{stats?stats.easy:""}</p></div>
                    <div className="level"><p className="lev">Medium</p><p className="nums">{stats?stats.medium_solved:""}/{stats?stats.medium:""}</p></div>
                    <div className="level"><p className="lev">Hard</p><p className="nums">{stats?stats.hard_solved:""}/{stats?stats.hard:""}</p></div>
                    <div className="level"><p className="lev">Total Progress</p><p className="nums">{stats?stats.total_solved:""}/{stats?stats.total:""}</p></div>
                </div>
                <div className="stats">
                    <h3>Recent Submissions</h3>
                    {stats && stats.recent_submissions.length>0 ? stats.recent_submissions.map((rec)=>{
                        return(
                            <div className="prob-area"><div className="prob"><p>{rec.prob_title}</p><p>{getTimeLine(rec.submitted_at)}</p></div><div>{rec.prob_status}</div></div>
                        )
                    }):[1,2,3,4].map(()=>{
                        return(
                        <div className="prob-area"><div className="prob"><p>Problem Title</p><p>Y hours ago</p></div><div>Status</div></div>
                    )
                    })}
                </div>
            </div>
        </>
    )
}