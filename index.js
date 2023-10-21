const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// const corsOptions ={
//   origin:'*', 
//   credentials:true,
//   optionSuccessStatus:200,
// }

// app.use(cors(corsOptions))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1mhzzn6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

   
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const productCollection = client.db('productDB').collection('products')
const cartCollection = client.db('productDB').collection('carts')

app.get('/products',async(req,res)=>{
  const cursor = productCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.get('/products/:brandName',async(req,res)=>{
  const brandNames = req.params.brandName;
  const query = {brandName: brandNames}
  const result = await productCollection.find(query).toArray()
  res.send(result);
})

app.get('/products/details/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await productCollection.findOne(query)
  res.send(result);
})

app.post('/products',async(req,res)=>{
  const newProducts = req.body;
  const result = await productCollection.insertOne(newProducts)
  res.send(result);
})

// carts

app.get('/carts/:email',async(req,res)=>{
  const email= req.params.email;
  const filter = {userEmail:email};
  const result =await cartCollection.find(filter).toArray()
  res.send(result);
})

app.get('/carts',async(req,res)=>{
  const cursor = cartCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.post('/carts',async(req,res)=>{
  const carts = req.body;
  // console.log(carts);
const result = await cartCollection.insertOne(carts)
res.send(result)
})

app.delete('/carts/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await cartCollection.deleteOne(query)
  res.send(result);
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})