// const multer = require('multer');
const { Sub_place } = require("../models");
const apiResponse = require('../helpers/apiResponse');
// const jwt = require('jsonwebtoken');
// const secret = process.env.JWT_SECRET;
// const sequelize = require('sequelize');
const base_dir_config = require('../config.js');

const readXlsxFile = require("read-excel-file/node");

// const upload = async (req, res) => {
//     try {
//         if (req.file === undefined) {
//             return res.status(400).send("Please upload an excel file!");
//         }
//
//         let path = base_dir_config.base_dir + 'uploads/excel_file/' + req.file.filename;
//
//         const rows = await readXlsxFile(path);
//         // Skip header
//         // rows.shift();
//
//         const subPlace = rows.map(row => ({
//             place_id: row[1],
//             upazilla_id: row[2],
//             union_id: row[3],
//             name: row[4],
//             comments: row[5],
//             assigned_officer: row[6],
//             officer_phone: row[7],
//             population: row[8],
//             type: row[9]
//         }));
//
//         await Sub_place.bulkCreate(subPlace, {
//             updateOnDuplicate: ['name']
//         });
//
//         // res.status(200).send({
//         //     message: "Uploaded the file successfully: " + req.file.originalname,
//         // });
//         return apiResponse.successResponse(res, "Successfully uploaded.")
//     } catch (err) {
//         // console.log(error);
//         // res.status(500).send({
//         //     message: "Could not upload the file: " + req.file.originalname,
//         // });
//         return apiResponse.ErrorResponse(res, err.message)
//     }
// };

// const upload = async (req, res) => {
//     try {
//         if (req.file === undefined) {
//             return res.status(400).send("Please upload an excel file!");
//         }

//         let path = base_dir_config.base_dir + 'uploads/excel_file/' + req.file.filename;

//         const rows = await readXlsxFile(path);
//         const headers = rows[0];

//         // Remove header row
//         rows.shift();

//         const subPlace = rows.map(row => {
//             let data = {};
//             headers.forEach((header, index) => {
//                 data[header] = row[index];
//             });
//             return data;
//         });

//         // Loop through each row and check if the name already exists in the database
//         for (let i = 0; i < subPlace.length; i++) {
//             const existingPlace = await Sub_place.findOne({
//                 where: { name: subPlace[i].name }
//             });

//             if (existingPlace) {
//                 // Update only the specified fields of the existing record with the new values
//                 await existingPlace.update({
//                     place_id: subPlace[i].place_id,
//                     upazilla_id: subPlace[i].upazilla_id,
//                     union_id: subPlace[i].union_id,
//                     comments: subPlace[i].comments.trim(),
//                     assigned_officer: subPlace[i].assigned_officer.trim(),
//                     officer_phone: subPlace[i].officer_phone.trim(),
//                     population: subPlace[i].population.trim(),
//                     type: subPlace[i].type
//                 });
//             } else {
//                 // Create a new record
//                 await Sub_place.create({
//                     place_id: subPlace[i].place_id,
//                     upazilla_id: subPlace[i].upazilla_id,
//                     union_id: subPlace[i].union_id,
//                     name: subPlace[i].name.trim(),
//                     comments: subPlace[i].comments.trim(),
//                     assigned_officer: subPlace[i].assigned_officer.trim(),
//                     officer_phone: subPlace[i].officer_phone.trim(),
//                     population: subPlace[i].population.trim(),
//                     type: subPlace[i].type
//                 });
//             }
//         }

//         return apiResponse.successResponse(res, "Successfully uploaded.")
//     } catch (err) {
//         return apiResponse.ErrorResponse(res, err.message)
//     }
// };

const upload = async (req, res) => {
    try {
        if (req.file === undefined) {
            return res.status(400).send("Please upload an excel file!");
        }

        let path = base_dir_config.base_dir + 'uploads/excel_file/' + req.file.filename;

        const rows = await readXlsxFile(path);
        const headers = rows[0];

        // Remove header row
        rows.shift();

        const subPlace = rows.map(row => {
            let data = {};
            headers.forEach((header, index) => {
                data[header] = row[index];
            });
            return data;
        });

        const existingPlaces = await Sub_place.findAll({
            where: { name: subPlace.map(place => place.name) }
        });

        const updates = [];
        const inserts = [];

        subPlace.forEach(place => {
            const existingPlace = existingPlaces.find(p => p.name === place.name);

            if (existingPlace) {
                updates.push({
                    place_id: place.place_id,
                    upazilla_id: place.upazilla_id,
                    union_id: place.union_id,
                    comments: place.comments.trim(),
                    assigned_officer: place.assigned_officer.trim(),
                    officer_phone: place.officer_phone.trim(),
                    population: place.population.trim(),
                    type: place.type,
                    id: existingPlace.id
                });
            } else {
                inserts.push({
                    place_id: place.place_id,
                    upazilla_id: place.upazilla_id,
                    union_id: place.union_id,
                    name: place.name.trim(),
                    comments: place.comments.trim(),
                    assigned_officer: place.assigned_officer.trim(),
                    officer_phone: place.officer_phone.trim(),
                    population: place.population.trim(),
                    type: place.type
                });
            }
        });

        await Sub_place.bulkCreate(inserts);

        for (let i = 0; i < updates.length; i++) {
            const { id, ...updateData } = updates[i];
            await Sub_place.update(updateData, { where: { id } });
        }

        return apiResponse.successResponse(res, "Successfully uploaded.")
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
};


module.exports = {
    upload,
};
