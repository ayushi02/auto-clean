var clean = require('./clean');

var source_loc = process.argv[2];

clean.clean(source_loc, function ()
{
	console.log('All files are sorted');
});
