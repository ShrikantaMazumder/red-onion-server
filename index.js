const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;


//Add multiple products to database
app.post('/add-products',(req,res) => {
    const products = req.body;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnionRestaurant").collection("products");
        collection.insert(products,(err,result) => {
            if (err) {
                console.log(err.message);
            }else{
                res.send(products);
            }
        })
        client.close();
    });
})

//Get all products
app.get('/products',(req,res) => {
    const client = new MongoClient(uri,{useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("redOnionRestaurant").collection("products");
        collection.find().toArray((err,documents)=>{
            if (err) {
                console.log(err)
            }else{
                res.send(documents);
            }
        })
        client.close();
    });
})

//Get specific product 
app.get('/product/:key',(req,res)=> {
    const key = req.params.key;
    
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnionRestaurant").collection("products");
        collection.find({key}).toArray((err,documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            } else {
                res.send(documents[0]);
            }
            
            
        })
        client.close();
      });
})

//Get cart products
app.post('/get-cart-product',(req,res) => {
    const productKeys = req.body;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnionRestaurant").collection("products");
        collection.find({key : {$in : productKeys}}).toArray((err,documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            } else {
                res.send(documents);
            }           
        })
        client.close();
      });
})
// Order store to database
app.post('/place-order',(req,res)=>{
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("redOnionRestaurant").collection("orders");
        collection.insertOne(orderDetails,(err,result) => {
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            } else {
                res.send(result.ops[0]);
            }  
        })
        //Connection close after taking action
        client.close();
      });
})


app.get('/',(req,res) => {
    res.send("Server working")
})


app.listen(3000,() => console.log('Listening port 3000 from red onion server'))