const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const categories = require('./data/categories.json')
const toys = require('./data/toys.json')

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@webapp.o75bwya.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const toyCollection = client.db('torToysDB').collection('toys');

        app.get('/addToy', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        app.post('/addToy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        })

        app.put('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedToy = req.body;
            const toy = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    details: updatedToy.details
                }
            }
            const result = await toyCollection.updateOne( filter, toy, options);
            res.send(result);
        })

        app.delete('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/categories', (req, res) => {
    res.send(categories)
})

app.get('/toys', (req, res) => {
    res.send(toys)
})

app.get('/', (req, res) => {
    res.send('toy server is running')
})

app.listen(port, () => {
    console.log(`toy server is running on port: ${port}`)
})