const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://mongodb:27017/Cookmaster');
    
    // await mongoose.connect('mongodb://localhost:27017/Cookmaster');
    // const DB_NAME = 'Cookmaster';
}

main().catch((err) => console.log(err));

module.exports = mongoose;