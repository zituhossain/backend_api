const apiResponse = require('../helpers/apiResponse');
const fs = require('fs');
exports.update = async(req,res) => {
    try{
         const data = req.body;
         const jsonContent = JSON.stringify(data);
        fs.writeFile(process.env.JSON_FILE_PATH, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return apiResponse.ErrorResponse(res,err)
            }
        
            return apiResponse.successResponse(res,"data successfully updated.")
        });
         
     } catch(e){
         return apiResponse.ErrorResponse(res,"Value missing.")
     }
 }
 exports.get = async(req, res)=>{
    try{
       fs.readFile(process.env.JSON_FILE_PATH,
            function(err, data) {
                if (err) throw err;
                const rowJson  = JSON.parse(data.toString('utf8'));
                return apiResponse.successResponseWithData(res, "Data successfully fetched.", rowJson)
        });
    } catch(e){
        return apiResponse.ErrorResponse(res,"Value missing.")
    }
 }

