const mongoose = require('mongoose');

async function main() {
    const DB_NAME = 'Cookmaster';
    // await mongoose.connect(`mongodb://mongodb:27017/${DB_NAME}`);
    await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);
    console.log('conectou no mongoose!');
}

main().catch((err) => console.log(err));

module.exports = mongoose;