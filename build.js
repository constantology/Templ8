#!/usr/bin/env node

//  require modules
	var fs       = require( 'fs' ),
		util     = require( 'util' ),
		jsp      = require( 'uglify-js' ).parser,
		pro      = require( 'uglify-js' ).uglify,
		Templ8   = require( './Templ8' ),
	
//  define vars
		EXT      = '.js',
		FILE, FILES,
		SLICE   = ( [] ).slice;

//  get the command line args, replacing any of the default values
	params = process.argv.reduce( function( res, arg ) {
		arg = arg.split( '=' );
		res[arg[0]] = arg[1];
		return res;
	}, {
//  default values,
		dir_output    : './',              dir_src       : 'src',
		encoding      : 'UTF-8',           files         : 'Tags,Statements,Filters',
		file_name     : 'Templ8',          file_shim     : 'shimmed',
		global_client : 'window',          global_server : 'global',
		ns_client     : 'window.Templ8',   ns_server     : 'module.exports'
	} );

	FILES = ( params.files.split( ',' ).join( Templ8.format( '{0},', EXT ) ).split( ',' ) + EXT ).split( ',' );

	fs.readdir( params.dir_src, function( err, files ) {
		if ( err ) throw err;

		var current,
			defaults      = { dir : params.dir_output, name : params.file_name, ext : EXT },
			encoding      = params.encoding,
			file_client, file_server, file_shim, 
			i             = 0,
			l             = 5,
			tpl_fc        = '\n/* {0} */\n{1}',
			tpl_fn        = '{0}/{1}',
			tpl_log       = 'processing file: {0}', 
			tpl_wrapper   = new Templ8( '{{env if env|notEmpty}}\n( function( global ) {\n{{code}}\n{{namespace}} = TPL;\n}( {{global}} ) );', { compiled : true, id : 'tpl-wrapper' } ),
			tpl_file_name = new Templ8( '{{dir}}{{name}}{{ type|prefix:"." if type|notEmpty }}{{ ".min" if min|is:true }}{{ext}}',             { compiled : true, id : 'tpl-file-name' } );

		files = files.reduce( function( o, f ) { o[f] = true; return o; }, {} );

// merging the ancillary files
		FILES = FILES.map( function( fn, i ) {
			if ( fn in files ) {
				return Templ8.format( tpl_fc, fn, fs.readFileSync( Templ8.format( tpl_fn, params.dir_src, fn ) ), encoding );
			}
			return '';
		} );
// add the Templ8 file at the beginning
		FILES.unshift( fs.readFileSync( Templ8.format( tpl_fn, params.dir_src, params.file_name + EXT ), encoding ) );

// joining the files together
		FILE = FILES.join( '\n' );

// get the shim file for older (shite) browser's
		file_shim = Templ8.format( tpl_fc, params.file_shim + EXT, fs.readFileSync( Templ8.format( tpl_fn, params.dir_src, params.file_shim + EXT ), encoding ) );

// wrapping the generated files in closures and assigning the correct namespace
		file_server = tpl_wrapper.parse( { code : FILE,             global : params.global_server,  namespace : params.ns_server, env : '#!/usr/bin/env node' } );
		file_client = tpl_wrapper.parse( { code : FILE,             global : params.global_client,  namespace : params.ns_client } );
		file_shim   = tpl_wrapper.parse( { code : FILE + file_shim, global : params.global_client,  namespace : params.ns_client } );


// writing the files

	// standard files
		// server
		current = tpl_file_name.parse( defaults );
util.log( Templ8.format( tpl_log, current ) );
		fs.writeFile( current, file_server, encoding, handleWriteFile );

		// client
		current = tpl_file_name.parse( Templ8.copy( { type : 'client' }, defaults ) );
util.log( Templ8.format( tpl_log, current ) );
		fs.writeFile( current, file_client, encoding, handleWriteFile );

		current = tpl_file_name.parse( Templ8.copy( { type : params.file_shim }, defaults ) );
util.log( Templ8.format( tpl_log, current ) );
		fs.writeFile( current, file_shim,   encoding, handleWriteFile );

	// minimised files
		// client
		current = tpl_file_name.parse( Templ8.copy( { min : true, type : 'client' }, defaults ) );
util.log( Templ8.format( tpl_log, current ) );
		fs.writeFile( current, pro.gen_code( pro.ast_squeeze( pro.ast_mangle( jsp.parse( file_client ) ) ) ), encoding, handleWriteFile );

		current = tpl_file_name.parse( Templ8.copy( { min : true, type : params.file_shim }, defaults ) );
util.log( Templ8.format( tpl_log, current ) );
		fs.writeFile( current, pro.gen_code( pro.ast_squeeze( pro.ast_mangle( jsp.parse( file_shim ) ) ) ),   encoding, handleWriteFile );

		function handleWriteFile( err ) {
			if ( err ) throw err;
			if ( ++i >= l ) {
				util.log( 'FINISHEDEDED!!!' );
			}
		}
	} );
