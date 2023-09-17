const checkUserRoleByPlace = require('../controllers/globalController');
const { District, Place,} = require('../models')

exports.roleByPlaceId = async (req) => {
    const token = req.headers.authorization.split(' ')[1];
	let roleByplace = await checkUserRoleByPlace(token);
	const divisionIds = roleByplace.division;
	let arr = [];
	if (
		roleByplace.division.length > 0 ||
		roleByplace.district.length > 0 ||
		roleByplace.place.length > 0
	) {
		await Promise.all(
			divisionIds.map(async (id) => {
				// Find place id by division id
				const places = await Place.findAll({
					attributes: ['id'],
					where: {
						division_id: id,
					},
				});

				const placeIds = places.map((place) => place.id);
				// Check place id exist in roleByPlace or not
				const matchingPlaceIds = roleByplace.place.filter((id) =>
					placeIds.includes(id)
				);

				// Find district id by division id
				const districts = await District.findAll({
					attributes: ['id'],
					where: {
						division_id: id,
					},
				});

				const districtIds = districts.map((district) => district.id);
				// Check district id exist in roleByPlace or not
				const matchingDistrictIds = roleByplace.district.filter((id) =>
					districtIds.includes(id)
				);

				if (matchingPlaceIds.length > 0) {
					matchingPlaceIds.map((place) => {
						arr.push(place);
					});
				} else if (matchingDistrictIds.length > 0) {
					const places = await Place.findAll({
						attributes: ['id'],
						where: {
							district_id: matchingDistrictIds,
						},
					});

					places.map((place) => {
						arr.push(place.id);
					});
				} else {
					const places = await Place.findAll({
						attributes: ['id'],
						where: {
							division_id: id,
						},
					});

					places.map((place) => {
						arr.push(place.id);
					});
				}
			})
		);
	}
    return arr;
}