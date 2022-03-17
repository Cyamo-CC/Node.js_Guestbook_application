
window.onload= function(){
document.getElementById('Submit').addEventListener('click',log);
};

function log(){
    
    var name= document.getElementById('name').value;
    var country= document.getElementById('country').value;
    var text= document.getElementById('message').value;
    var ajax= new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(this.readyState ==4 && this.status==200){
            //This says:get the response.send from server.js and apply

            document.getElementById('infoOut').innerHTML=this.responseText;
            
        };
    };
    ajax.open("POST","/ajax", true);
    ajax.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    ajax.send("name="+name+"&country="+country+"&text="+text);
    
}