const express = require('express');
const app = express()
const port = process.env.PORT || 5000


app.get('/', (req, res) => {
   res.send({message: "crack the power of ai"})
})

app.listen(port, ()=>console.log("server is running on PORT", port ))