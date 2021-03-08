var fs = require("fs");


module.exports = function(name,obj){
    console.log(name," : " +Date.now());
    var log = "\n\nLog:"+name+"\tTime:"+Date.now()+"\n"+JSON.stringify(obj)+
    "\n-----------------------------------------------------------------------";

    fs.writeFileSync( "log.txt", log,{flag:"a+"});
    
};