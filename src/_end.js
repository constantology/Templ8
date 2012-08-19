	util.iter( PACKAGE ) || ( PACKAGE = util.ENV == 'commonjs' ? module : util.global );

// expose Templ8
	__Class__ = util.expose( __Class__, Name, PACKAGE );
	util.expose( util, __Class__ );  // store a reference to m8 on Templ8

// at this point we don't know if m8 is available or not, and as such do not know what environment we are in.
// so, we check and do what is required.
}( typeof m8 != 'undefined' ? m8 : typeof require != 'undefined' ? require( 'm8' ) : null, 'Templ8' );

