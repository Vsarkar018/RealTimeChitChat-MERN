const express = require("express")
require("dotenv").config();         
const app = express();

const port = process.env.PORT || 5000;

app.get("/api/chats",(req,res)=>{
    res.send("Heello I'm the data from backend")
})

app.listen(port,console.log(`Server is listening to the port ${port}`));