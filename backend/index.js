import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import usersDAO from './dao/usersDAO.js';
import checklistsDAO from './dao/checklistsDAO.js';

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(
  process.env.USERS_DB_URI, { wtimeoutMS: 2500 }
).catch(err => {
    console.error(err.stack);
    process.exit(1);
}).then(async client => {
    await usersDAO.injectDB(client);
    await checklistsDAO.injectDB(client);
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
});