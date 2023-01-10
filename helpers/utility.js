exports.randomNumber = function (length) {
	var text = '';
	var possible = '123456789';
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup === i ? '0' : possible.charAt(sup);
	}
	return Number(text);
};

exports.normalizePort = (val) => {
	let port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
};

exports.makeSlug = (slug) => {
	let newSlug = slug.toLowerCase().replace(/[^\w-]+/g, '-');

	console.log('newSlug', newSlug);

	while (newSlug.indexOf('--') !== -1) {
		console.log('newSlug', newSlug);
		newSlug = newSlug.replace('--', '-');
	}

	return newSlug;
};
