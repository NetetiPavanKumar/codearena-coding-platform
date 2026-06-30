const express=require("express");
const mongoose=require("mongoose");
const app=express();
const cors=require("cors");
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const runCode=require("./judge0.js");


app.listen(3000,()=>{
console.log("Server Started....");
});


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())


mongoose.connect("mongodb://localhost:27017/CodeArena").then(()=>{
    console.log("MongoDB Connected....");
})


const languages={
    javascript:63,
    python:71,
    java:62,
    c:50
}


const sampleSchema=mongoose.Schema({
    p_id:{type:Number},
    p_status:{
        type:String,
        default:"Pending⏳"
    },
    p_prob:{
        type:String,
        required:[true,"Problem is a mandotory field"],
    },
    p_e1:{
        type:String,
    },
    p_e2:{
        type:String,
    },
    p_constr:{
        type:String,
    },
    p_title:{
        type:String,
        required:[true,"Title is mandotory"]
    },
    p_category:{
        type:String,
    },
    p_diff:{
        type:String,
    },
    p_accept:{
        type:String,
    },
    p_testcases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            isPublic:{
                type:Boolean,
                default:false,
            }
        }
    ],
    p_driverCodes:[
        {
            lang:{
                type:String,
                required:true,
            },
            fntemp:{
                type:String,
                required:true,
            },
            drcode:{
                type:String,
                required:true,
            }
        }
    ]
})

const UserSchema=mongoose.Schema({
    userEmail:{
        type:String,
    },
    userName:{
        type:String,
    },
    password:{
        type:String,
    },
    userRole:{
        type:String,
        default:"User",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})


const submissionSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    problem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Problems",
        required:true,
    },
    code:{
        type:String,
    },
    language:{
        type:String,
    },
    sub_status:{
        type:String,
        default:"Pending",
    },
    submittedAt:{
        type:Date,
        default:Date.now,
    },
    output:{
        type:String,
    },
    error:{
        type:String,
    },
    memory:{
        type:String,
    }
})


const draftSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    prob:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Problems",
        required:true,
    },
    lang:{
        type:String,
    },
    draftCode:{
        type:String,
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
})

draftSchema.index({
    user:1,
    prob:1,
    lang:1,
},
{
    unique:true,
})

const Problems=mongoose.model("Problems",sampleSchema);
const Users=mongoose.model("Users",UserSchema);
const Submissions=mongoose.model("Submissions",submissionSchema);
const Drafts=mongoose.model("Drafts",draftSchema);


function authMiddleware(req,res,next){
    const token=req.cookies.token;
    if(!token){
        console.log("Please Login")
        return res.status(401).json({
            msg:"Please Login"
        })
    }
    try{
        let decoded=jwt.verify(token,"Pavan Kumar");
        req.user=decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            msg:"Invalid Token"
        })
    }
}


async function authoriseMiddleware(req,res,next){
    const userEmail=req.user.userEmail;
    const user=await Users.findOne({userEmail,});
    if(user.userRole==="Admin"){
        next();
    }
    else{
        res.status(401).json({msg:"Unauthorised Access, Bad Request"});
        return;
    }
}

app.get("/",(req,res)=>{
    res.send("HIII");
});

app.post("/addproblem",authMiddleware,authoriseMiddleware,async (req,res)=>{
    let last_doc=await Problems.findOne().sort({_id:-1});
    let new_id=1;
    if(last_doc){
        let last_id=last_doc["p_id"];
        new_id=last_id+1;
    }
    let {p_prob,p_title,p_category,p_diff,p_e1,p_e2,p_constr,p_testcases,p_driverCodes}=req.body;
    Problems.create({
        p_id:new_id,
        p_prob,
        p_title,
        p_category,
        p_diff,
        p_accept:"NA",
        p_e1,
        p_e2,
        p_constr,
        p_testcases,
        p_driverCodes,
}).then(()=>{
    res.json("Problem Added");
})
})


app.get("/problems",authMiddleware,async (req,res)=>{

    const user = await Users.findOne({
        userEmail:req.user.userEmail
    });


    let probs = await Problems.find();


    let result = await Promise.all(
        probs.map(async(problem)=>{

            const solved = await Submissions.findOne({
                user:user._id,
                problem:problem._id,
                sub_status:"Accepted"
            });

            const wrong = await Submissions.findOne({
                user:user._id,
                problem:problem._id,
                sub_status:"Wrong Answer"
            });


            return {
                ...problem._doc,
                status: solved ? "🟢" : wrong ? "🔴" : "🟡"
            };

        })
    );


    res.json(result);

})

app.post("/users",async (req,res)=>{
    const {userEmail,userName,password,userRole}=req.body;
    let user= await Users.findOne({userEmail});
    if(!user){
    Users.create({
        userEmail,
        userName,
        password,
        userRole,
    }).then(()=>{
        return res.status(200).json({msg:"User Created"});
    })
}
else{
    // console.log("User Existed: ",err);
    return res.status(201).json({msg:"User already exist"});
}
})

app.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    let doc=await Users.findOne({userEmail:email,password:pass});
    if(!doc){
        res.status(401).json("User doesn't exist");
    }
    else{
        const token=jwt.sign({
        userEmail:doc.userEmail,
        userRole:doc.userRole,
    },"Pavan Kumar",{expiresIn:"1d"})
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
    });
    res.json("User Exist");
    }
})



app.get("/me",authMiddleware,(req,res)=>{
    res.status(200).json(req.user);
})


app.post("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
    });
    res.json({
        msg:"Logged Out Successfully",
    })
})

app.get("/problems/:id",authMiddleware,async(req,res)=>{
    try{
    let prob1;
    const user_=await Users.findOne({userEmail:req.user.userEmail})
    const problem_id=req.params.id;
    const pid=(+problem_id)
    let prob=await Problems.findOne({p_id:pid});
    let python_code=await Drafts.findOne({user:user_._id,prob:prob._id,lang:"Python"})
    let js_code=await Drafts.findOne({user:user_._id,prob:prob._id,lang:"JavaScript"})
    let c_code=await Drafts.findOne({user:user_._id,prob:prob._id,lang:"C"})
    let java_code=await Drafts.findOne({user:user_._id,prob:prob._id,lang:"Java"})
    js_code=js_code?js_code.draftCode : "";
    python_code=python_code?python_code.draftCode : "";
    c_code=c_code?c_code.draftCode : "";
    java_code=java_code?java_code.draftCode : "";
    let last_submitted_code={"JavaScript":js_code,"Python":python_code,"C":c_code,"Java":java_code};
    
    // if(last_submitted_code){
    // prob1={...prob._doc,...last_submitted_code}
    // }
    // else{
    // prob1={...prob._doc}
    // }
    prob1={...prob._doc,...last_submitted_code}
    res.status(200).json({
        msg:"Problem Fetched",
        data:prob1,
    })
}
catch(err){
    res.status(401).json({msg:"Something went wrong"})
}

})


async function calculateAcceptance(prob){
    let total=await Submissions.find({problem:prob._id})
    let accepted=await Submissions.find({problem:prob._id,sub_status:"Accepted"});
    let aceeptance=accepted.length/total.length*100;
    let accept=aceeptance.toFixed(2)+"%";
    await Problems.findOneAndUpdate({p_id:prob.p_id},{$set:{p_accept:accept}})
}



app.post("/submitcode/:ids",authMiddleware,async(req,res)=>{
    try{
    const user=await Users.findOne({userEmail:req.user.userEmail})
    const p_id=req.params.ids;
    const prob=await Problems.findOne({p_id,})
    let {code,language}=req.body;
    let ind=language==="JavaScript"?0:language==="Python"?1:language==="C"?2:language==="Java"?3:""
    code+="\n\n"+prob.p_driverCodes[ind].drcode;
    const lang=language.toLowerCase();
    let user_results=[];
    let results=[];

    for(let test of prob.p_testcases){
        let result=await runCode(code,languages[lang],test.input);
        console.log(result);
        let output=result.stdout || result.stderr || result.compile_output || "";
        output=output.trim();

        test.isPublic && user_results.push({
            input:test.input,
            expected:test.output,
            actual:output,
            status:
            output===test.output.trim()
            ?
            "Accepted"
            :
            "Wrong Answer"
        });
        results.push({
            input:test.input,
            expected:test.output,
            actual:output,
            status:
            output===test.output.trim()
            ?
            "Accepted"
            :
            "Wrong Answer"
        })
    }

    let cnt=0
    results.forEach((result)=>{
        if(result.status==="Accepted"){
            cnt+=1;
        }
    })

    let s_status="";
    if(cnt===results.length)
    {
        s_status="Accepted"
    }
    else{
        s_status="Wrong Answer"
    }

    await Submissions.create({
        user:user._id,
        problem:prob._id,
        code,
        language,
        sub_status:s_status,
    })

    await calculateAcceptance(prob);

    res.json({data:user_results,testcases_passed:cnt,total_cases:results.length});
}
catch(err){
    console.log("Error while submitting :",err)
}
})

app.post("/run/:id",authMiddleware,async(req,res)=>{

    try{
        
        let {code,language}=req.body;
        const lang=language.toLowerCase();
        const prob=await Problems.findOne({p_id:req.params.id});
        let ind=language==="JavaScript"?0:language==="Python"?1:language==="C"?2:language==="Java"?3:""
        code+="\n\n"+prob.p_driverCodes[ind].drcode;
        let user_results=[];
        let results=[];

        for(let test of prob.p_testcases){
            let result=await runCode(code,languages[lang],test.input);
            console.log(result);
            let output=result.stdout || result.stderr || result.compile_output || "";
            output=output.trim();

            test.isPublic && user_results.push({
                input:test.input,
                expected:test.output,
                actual:output,
                status:
                output===test.output.trim()
                ?
                "Accepted"
                :
                "Wrong Answer"
            });
        //     results.push({
        //         input:test.input,
        //         expected:test.output,
        //         actual:output,
        //         status:
        //         output===test.output.trim()
        //         ?
        //         "Accepted"
        //         :
        //         "Wrong Answer"
        //     })
        }

        // let cnt=0
        // results.forEach((result)=>{
        //     if(result.status==="Accepted"){
        //         cnt+=1;
        //     }
        // })

        res.json({data:user_results});
    }
    catch(err){
        console.log("Error while running the code:",err);
        res.status(500).json({msg:"Execution Failed"})
    }
})


app.get("/userstats",authMiddleware,async(req,res)=>{
    try{
    let percent;
    let easy=0;
    let medium=0;
    let hard=0;
    let total=0;
    let easy_solved=0;
    let medium_solved=0;
    let hard_solved=0;
    let total_solved=0;
    let recent_submissions=[];
    const user=await Users.findOne({userEmail:req.user.userEmail});
    let probs=await Problems.find();
    const problems=[...probs];
    for(let prob of problems){
        total+=1;
        prob.p_diff==="Easy"?easy+=1:prob.p_diff==="Medium"?medium+=1:prob.p_diff==="Hard"?hard+=1:""
        let status=await Submissions.findOne({user:user._id,problem:prob._id,sub_status:"Accepted"});
        if(status){
            total_solved+=1;
            prob.p_diff==="Easy"?easy_solved+=1:prob.p_diff==="Medium"?medium_solved+=1:prob.p_diff==="Hard"?hard_solved+=1:""

        }
    }
    let subs=await Submissions.find({user:user._id}).sort({submittedAt:-1})
    let submissions=[...subs];
    let i=0;
    for(let sub of submissions){
        // console.log(sub);
        let k=0;
        for(let j=0;j<recent_submissions.length;j++){
            if(String(sub.problem) == String(recent_submissions[j].problem)){
                k=1;
                continue;
            }
        }
        if(k===1){
            continue;
        }
        else{
            let pr=await Problems.findOne({_id:sub.problem});
            // recent_submissions.push({...sub,...pr});
            if(pr && i<4){
             recent_submissions.push(
                {problem:pr._id,prob_title:pr.p_title,prob_status:sub.sub_status,submitted_at:sub.submittedAt,}
            );
             i+=1;
            }
        }
    }

    percent=(total_solved/total*100).toFixed(2);

    res.status(200).json({
        ...user._doc,
        easy_solved,
        medium_solved,
        hard_solved,
        easy,
        medium,
        hard,
        total_solved,
        total,
        recent_submissions,
        percent,
    })
}
catch(err){
    res.status(401).json({msg:"Bad Request"});
}
})


app.put("/updateproblem/:id",authMiddleware,authoriseMiddleware,async(req,res)=>{
    try{
    const p_id=req.params.id;
    let {p_prob,p_title,p_category,p_diff,p_e1,p_e2,p_constr,p_testcases}=req.body;
    await Problems.findOneAndUpdate({p_id,},{$set:{p_prob,p_title,p_category,p_diff,p_e1,p_e2,p_constr,p_testcases}});
    res.status(201).json({msg:"Updated Successfully"});
    }
    catch(err){
        res.status(501).json("Something Went Wrong, Try Again");
    }
})


app.delete("/deleteproblem/:id",authMiddleware,authoriseMiddleware,async(req,res)=>{
    try{
        await Problems.findOneAndDelete({p_id:req.params.id});
        return res.status(200).json({msg:"Deleted Successfully"})
    }
    catch(err){
        return res.status(501).json("Something went wrong, Please try again");
    }

})


app.post("/autosave/:pid",authMiddleware,async(req,res)=>{
    try{
    const {draft,language}=req.body;
    const userEmail=req.user.userEmail;
    const p_id=req.params.pid;
    const user=await Users.findOne({userEmail,})
    let prob=await Problems.findOne({p_id,})
    await Drafts.findOneAndUpdate(
        {user:user._id,prob:prob._id,lang:language},
        {$set:{draftCode:draft,updatedAt:Date.now()}},
        {upsert:true});
    res.status(200).json("Draft Saved");
    }
    catch(err){
        console.log("Error at auto save : ",err);
    }
})