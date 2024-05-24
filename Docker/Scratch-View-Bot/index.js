const fs = require('fs').promises;
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');

const LOG_FILE_PATH = `${__dirname}/output.log`;
const DEFAULT_FREQUENCY = 1000;
let views = 0;
let viewsSinceUpdate = 0;

async function log(message) {
    const timestamp = new Date().toISOString();
    const formattedMsg = `[${timestamp}] ${message}`;
    try {
        await fs.appendFile(LOG_FILE_PATH, `${formattedMsg}\n`);
        console.log(formattedMsg);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

async function sendRequest(url) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'same-site',
                'Sec-GPC': '1',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            referrer: 'https://scratch.mit.edu/',
            method: 'POST',
            mode: 'cors'
        });
        if (response.status === 200) {
            views++;
            viewsSinceUpdate++;
        }
        if (response.status !== 429) {
            await log(`Views Generated: ${views}, Latest Request Status: ${response.status}, Request URL: ${url}`);
        }
    } catch (error) {
        await log(error);
    }
}

async function init() {
    try {
        const { MONGO_URL, NAME } = process.env;
        if (!MONGO_URL || !NAME) {
            throw new Error('Required environment variables not set. Exiting.');
        }
        const mongoClient = new MongoClient(MONGO_URL);
        await mongoClient.connect();
        const db = mongoClient.db('SC_Swarm');
        const [config, worker] = await Promise.all([
            db.collection('Config').findOne(),
            db.collection('Workers').findOne({ name: NAME })
        ]);
        if (!config) {
            await db.collection('Config').insertOne({ active: false, frequency: DEFAULT_FREQUENCY, url: '' });
        }
        if (!worker) {
            await db.collection('Workers').insertOne({ name: NAME, viewsGenerated: 0 });
        }
        fetchData(db, NAME);
        setInterval(() => fetchData(db, NAME), 60000);
        setInterval(() => {
            if (config.active) {
                sendRequest(config.url);
            } else {
                log('Client is inactive, not sending requests.');
            }
        }, config.frequency || DEFAULT_FREQUENCY);
    } catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
}

async function fetchData(db, name) {
    try {
        const config = await db.collection('Config').findOne();
        const worker = await db.collection('Workers').findOne({ name });
        await Promise.all([
            db.collection('Config').updateOne({}, { $set: { viewsGenerated: viewsSinceUpdate + (config.viewsGenerated || 0) } }),
            db.collection('Workers').updateOne({ name }, { $set: { viewsGenerated: viewsSinceUpdate + (worker.viewsGenerated || 0) } })
        ]);
        viewsSinceUpdate = 0;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

init();