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

        const myReviewCollection = client.db('CleanService').collection('myreviews');

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
            const query1 = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query1);
            res.send(service);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = myReviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/addreview', async (req, res) => {
            const review = req.body;
            const result = await myReviewCollection.insertOne(review);
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/myreviews', async (req, res) => {
            const query = {};
            const cursor = myReviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query1 = { _id: ObjectId(id) };
            const review = await myReviewCollection.findOne(query1);
            res.send(review);
        })


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myReviewCollection.deleteOne(query);
            res.send(result);
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