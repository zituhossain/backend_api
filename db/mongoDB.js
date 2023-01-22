const { MongoClient } = require("mongodb");

class MongoDB{
// Replace the uri string with your connection string.
    constructor(){
        this.uri = process.env.MONGODB_URL;
        this.client = new MongoClient(this.uri);
        this.database = this.client.db('ngo');
        
    };
    async insertData(table, data) {
        try {
            
            const movies = this.database.collection('place');
            const result = await movies.insertOne(data);
            console.log(result, '-----------result')
        } catch(e) {
            
        }
    }
    async getDataByColum(query) {
        try {
            
            const movies = this.database.collection('place');
            const movie = await movies.findOne(query);
            return movie;
        } finally {
          
        }
    }
}

module.exports ={
    MongoDB
}