// colocar query do MongoDB
const conn = require('./src/db/conn');
conn.db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });