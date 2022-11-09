const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { MongoRuntimeError } = require('mongodb');
require('dotenv').config();
const port = process.env.port || 5000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gj8nsdx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {
        const serviceCollection = client.db('CleanService').collection('services');
        const reviewsCollection = client.db('CleanService').collection('reviews');


        app.get(('/'), async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get(('/services'), async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
    }

    finally {

    }

}
run().catch((error) => {
    console.log(error);
})

app.get('/', (req, res) => {
    res.send('Service server running');
})

app.listen(port, () => {
    console.log(`Service running on ${port}`);
})