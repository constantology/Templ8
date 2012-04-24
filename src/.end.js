// store a reference to m8 in Templ8 so we can do fun stuff in commonjs modules without having to re-request m8 as well as Templ8 each time.
	m8.def( Templ8, 'm8', m8.describe( { value : m8 }, 'r' ) );
// expose Templ8
	m8.ENV != 'commonjs' ? m8.def( m8.global, 'Templ8', m8.describe( { value : Templ8 }, 'r' ) ) : ( module.exports = Templ8 );
// at this point we don't know if m8 is available or not, and as such do not know what environment we are in.
// so, we check and do what is required.
}( typeof m8 != 'undefined' ? m8 : typeof require != 'undefined' ? require( 'm8' ) : null );

