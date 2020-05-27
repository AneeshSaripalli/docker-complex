const keys = require('./keys');


const bodyparser = require('body-parser');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

// postgres
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    password: keys.pgPassword,
    database: keys.pgDatabase,
    port: keys.pgPort
})

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.error("Could not create table", err));

// Redis client setup

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// express routers
app.get("/", async(req, res) => {
    res.send("hello");
})

app.get("/values/all", async(req, res) => {
    const values = await pgClient.query("SELECT * from values");

    console.log(values.rows);

    return res.send(values.rows);
});

app.get("/values/current", async(req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values)
    })
})

app.post('/values', async(req, res) => {
    const index = req.body.index;

    if (+index > 40) return res.status(402).send("index too high");

    redisClient.hset('values', index, "nothing yet");
    redisPublisher.publish('insert', index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
    res.send({ working: true })
})

app.listen(5000, () => {
    console.log("server running on 5000");
})