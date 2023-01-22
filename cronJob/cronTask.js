const models = require('../models');
class CronTask{
// Replace the uri string with your connection string.
    constructor({mongoDB}){
        this.mongoDB = mongoDB;
        this.insertData = this.insertData.bind(this); 
    };

    async insertData(){
        const placeAll = await models.Place.findAll({
            include : [
                { model : models.Division },
                { model : models.District }
            ],
            raw: true,
            nest: true,});
        for (let index = 0; index < placeAll.length; index++) {
            const row = placeAll[index];
            const data = await this.mongoDB.getDataByColum({id:row.id});
            if(!data){
                const response = await this.mongoDB.insertData('',row);
            }
            
            
        }
        
    }
    async run() {
       this.insertData();
    }
    

    // async run(){
       
    //     console.log('response from cronTask class')
    //     mongo();
    // }
}

module.exports ={
    CronTask
}