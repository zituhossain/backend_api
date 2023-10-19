const checkUserRoleByPlace = require('../controllers/globalController');
const { Division, District, Place, Previlege_place_division_district, sequelize } = require('../models');

exports.roleByPlaceId = async (id) => {
	// All Division
	const divisions = await Division.findAll({
		attributes: ['id'],
	});
	const allDivisionId = divisions.map((division) => division.id);

	// Role Division
	const roleDivisions = await Previlege_place_division_district.findAll({
		attributes: ['division_id'],
		where: { user_role_id: id },
	});
	const roleDivisionId = roleDivisions.map((division) => division.division_id);

	

	// Role District
	const [roleDistricts, roleDistrictsMeta] = await sequelize.query(
		`SELECT district_id
				FROM previlege_place_division_districts
				WHERE district_id != '' AND user_role_id = ${id}`
	);
	let roleDistrictId = roleDistricts.map((district) => district.district_id);

	// Role Place
	const [rolePlaces, rolePlacesMeta] = await sequelize.query(
		`SELECT place_id
				FROM previlege_place_division_districts
				WHERE place_id != '' AND user_role_id = ${id}`
	);
	let rolePlaceId = rolePlaces.map((place) => place.place_id);

	const divisionIds = roleDivisionId.length > 0 ? roleDivisionId : allDivisionId;

	let arr = [];
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
			const matchingPlaceIds = rolePlaceId.filter((id) =>
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
			const matchingDistrictIds = roleDistrictId.filter((id) =>
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

	let filterDivisionId = [];
	await Promise.all(
		divisionIds.map(async (divisionId) => {
			try {
				const places = await Place.findAll({
					attributes: ['id'],
					where: {
						division_id: divisionId,
					},
				});

				const placeIds = places.map((place) => place.id);

				const districts = await District.findAll({
					attributes: ['id'],
					where: {
						division_id: divisionId,
					},
				});

				const districtIds = districts.map((district) => district.id);

				const matchingDistrictIds = roleDistrictId.filter((id) =>
					districtIds.includes(id)
				);
				const matchingPlaceIds = rolePlaceId.filter((id) =>
					placeIds.includes(id)
				);

				if (matchingPlaceIds.length === 0 && matchingDistrictIds.length === 0) {
					// Fetch the division data only if both matchingPlaceIds and matchingDistrictIds are empty
					filterDivisionId.push(divisionId);
				}
			} catch (error) {
				// Handle errors if necessary
				return `Error fetching data for divisionId: ${divisionId}`;
			}
		})
	);

	const divisionData = {};

	await Promise.all(
		divisionIds.map(async (divisionId) => {
			// Find district IDs by division ID
			const districts = await District.findAll({
				attributes: ['id'],
				where: {
					division_id: divisionId,
				},
			});

			const districtIds = districts.map((district) => district.id);
			const matchingDistrictIds = roleDistrictId.filter((id) =>
				districtIds.includes(id)
			);

			// Create the division object if it doesn't exist
			if (!divisionData[divisionId]) {
				divisionData[divisionId] = {
					divisionId: divisionId,
					districts: {},
				};
			}

			// Determine which district IDs to use
			const districtIdsToUse =
				matchingDistrictIds.length > 0 ? matchingDistrictIds : districtIds;

			// Create district objects within the division
			districtIdsToUse.forEach((districtId) => {
				divisionData[divisionId].districts[districtId] = {
					districtId: districtId,
					placeIds: [],
				};
			});
		})
	);

	// Populate place IDs for each district within a division
	await Promise.all(
		divisionIds.map(async (divisionId) => {
			const division = divisionData[divisionId];

			await Promise.all(
				Object.keys(division.districts).map(async (districtId) => {
					// Find place IDs by district ID
					const places = await Place.findAll({
						attributes: ['id'],
						where: {
							district_id: districtId,
						},
					});

					const placeIds = places.map((place) => place.id);
					const matchingPlaceIds = rolePlaceId.filter((id) =>
						placeIds.includes(id)
					);

					// Determine which place IDs to use
					const placeIdsToUse =
						matchingPlaceIds.length > 0 ? matchingPlaceIds : placeIds;

					// Update place IDs for the district
					division.districts[districtId].placeIds = placeIdsToUse;
				})
			);
		})
	);

	const globalData = {
		allPlaceId: arr,
		divisionId: divisionIds,
		districtId: roleDistrictId,
		placeId: rolePlaceId,
		fullAccessDivision: filterDivisionId,
		allRoleById: divisionData,
	};
	return globalData;
};

