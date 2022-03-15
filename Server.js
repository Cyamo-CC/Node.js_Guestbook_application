var express = require('express');
var app = express();
var fs= require("fs");
//require("dotenv").config();
var bodyParser= require("body-parser");
const port = process.env.PORT||3000;

//page details
var metadata= `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <style>
    p,h1,h2,h3,a, button{
        font-family: "Georgia","Trirong",serif;
    }
    </style>
    <title>Guest Book</title>
    </head>`
  var nav=` <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="http://localhost:3000/">Caritas Guestbook</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggle">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarToggle">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="http://localhost:3000/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="http://localhost:3000/guestbook">Guestbook</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="http://localhost:3000/newmessage">New Message</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="http://localhost:3000/ajaxmessage">Ajax</a> 
                </li>
            </ul> 
        </div>
    </div>
    </nav>`

//app dependencies
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//routes
app.get('/',function (req, res){
    //this serves static file to page
    res.sendFile(__dirname+'/index.html')
});

app.get('/guestbook',function (req,res){
    var data= require('./public/GuestLog.json');
    var outputTable = '<table  class="d-flex justify-content-start table table-striped">'+
    '<tr>'+
    '<th>ID Nro</th>'+
    '<th>Name</th>'+
    '<th>Country</th>'+
    '<Th>Time</th>'+
    '<th>Message</th>'+
    '</tr>';

    for(var i=0; i<data.length; i++){
        outputTable +=
        '<tr>'+
        '<td>'+data[i].id+'</td>'+
        '<td>'+data[i].username+'</td>'+
        '<td>'+data[i].country+'</td>'+
        '<td>'+data[i].date+'</td>'+
        '<td>'+data[i].message+'</td>'+
        '</tr>';
    }
    outputTable+=
    '</table>';
    
    res.send(metadata+ nav+'<h2 class="p-3">Guest Logs</h2>'+'<div class="container-fluid table-responsive">'+outputTable+'</div>');

});

app.get('/newmessage',function (req,res){
    
    res.sendFile(__dirname+"/public/form.html")
});

    app.post('/newmessage', function(req,response){
        //load existing data
        var data= require('./public/GuestLog.json');
         //select fields to fetch and write
         function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
          }
         var d= new Date();
         let day=addZero(d.getDate());
         let month=addZero(d.getMonth()+1);
         let year=d.getFullYear();
         let hour=addZero(d.getHours());
         let min= addZero(d.getMinutes());
         var timestamp= day+"-"+month+"-"+year+" "+hour+":"+min;
        data.push({
            id: data.length+1,
            username: req.body.name,
            country: req.body.country,
            date: timestamp,
            message: req.body.text
        });
        //convert to string
        var jsonStr= JSON.stringify(data);
        //save to orginal file
        fs.writeFile("./public/GuestLog.json",jsonStr, (err)=>{
        if(err) throw err;});

    response.send(metadata+nav+'<h2>Thank you for posting!</h2>');

    });

app.get('/ajaxmessage',function (req,res){
    res.sendFile(__dirname+'/public/ajax.html');
})
    app.post('/ajaxmessage',function(request,response){
        
        //select fields to fetch and write
        var name= request.body.name;
        var country = request.body.country;
        var text= request.body.text;
    if(name==""||country==""||text==""){
        response.send("You need to fill all of the fields!");
    }else{
    response.send(`<h3 class="mt-3">Thank you for Logging!</h3><h6>Name:</h6><p>`+name+`</p><h6>Country:</h6><p>`+country+`</p><h6>Message:</h6><p>`+text+`</p>`);
    }
});
//always keep this failsafe as the last route
app.get('*',function (req,res){
    res.status(404).send("Cant find the page you requested");
})

app.listen(port, function(){
    console.log('listening to port: http://localhost:3000/')
})