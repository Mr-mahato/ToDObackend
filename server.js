const express = require('express')
const fs = require('fs');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
const port = 3000

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var data = req.body;
    data.id = Math.floor(Math.random()*100);
    console.log(data);
    fs.readFile('todos.json','utf-8',(err,info)=>{
        var retrivedData = info;
        retrivedData = JSON.parse(retrivedData);
        retrivedData.push(data);
        if(err){res.status(400)}
        else{
            fs.writeFile('todos.json',JSON.stringify(retrivedData),(err)=>{
                if(err){console.log(err);}
            })  
        }
    })
    res.send({message:"Data post successfully"});
})

app.get('/todos',(req,res)=>{
    fs.readFile('todos.json', 'utf-8', (err,data)=>{
        if(err){res.status(401).send(`File reading error from json file`);}
        else {
            res.send(data);
        }
    })
})

app.put('/changeTodo/:id',(req,res)=>{
    const id = req.params.id;
    const newData = req.body;
    fs.readFile('todos.json',"utf-8",(err,data)=>{
        if(err){
            res.status(400).send(err);
        }
       var rData = data;
       rData = JSON.parse(rData);
       const findInd = rData.findIndex(val => val.id == id);
       if(findInd == -1)
       {
        res.status(402).send({message:"index not found"});
       }
       else 
       {
           Object.assign(rData[findInd],newData);
           fs.writeFile('todos.json',JSON.stringify(rData),(err)=>{
               if(err){
                   res.status(400).send(`error in writing into file after updation`);
                }
                else 
                {
                    res.status(200).send({message:"task updated successfully"});
                }
            })
        }
        })
})

app.delete('/deleteTodo/:id',(req,res)=>{
    const id = req.params.id;
    console.log(id);
    console.log('i am called');
    fs.readFile('todos.json',"utf-8",(err,data)=>{
        var rData = data;
        rData = JSON.parse(rData);
        const findInd = rData.findIndex(val=>val.id == id);
        if(findInd == -1)
        {
            res.status(402).send({message:"index not matched"});
        }
        else{
            console.log(findInd);
             rData.splice(findInd,1);
            fs.writeFile('todos.json',JSON.stringify(rData),(err)=>{
                if(err)
                {
                    res.status(400).send({message:"Error in writing data to files after deletion"});
                }
                else 
                {
                    res.status(200).send({message:"Data send successfully after deletion"});
                }
            })
        }
    })
})

// server is working fine

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})