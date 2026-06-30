const axios=require("axios");


async function runCode(code,language_id,input){
    try{
    const response=await axios.post("https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
            source_code: code,
            language_id: language_id,
            stdin: input
        },
        {
            headers:{
                "Content-Type":"application/json",
            }
        }
    );
    return response.data;
}
catch(err){
    console.log("Error while executing the code :",err);
    return ("Error while executing the code :",err)
}
}

module.exports=runCode;