!function( root ) {
	var el, txt, u, undef = u + '';
	typeof Templ8 != undef || typeof require == undef || ( Templ8 = require( 'Templ8' ) );

	if ( typeof root.document != undef ) {
		el  = document.createElement( 'div' );
		txt = el.appendChild( document.createTextNode( '' ) );
		Templ8.Filter.add( 'escapeHTML', function( str ) {
			txt.data = str;
			var s    = el.innerHTML;
			txt.data = '';
			return s;
		} );
	}

	Templ8.Filter.add( {
		bold       : function( str ) { return Templ8.format( '<strong>{0}</strong>', Templ8.stringify( str ) ); },
		italics    : function( str ) { return Templ8.format( '<em>{0}</em>', Templ8.stringify( str ) ); },
		linebreaks : function( str ) { return Templ8.stringify( str ).replace( /[\r\n]/gm, '<br />\n' ); },
		link       : function( url, str ) {
			str = typeof str == 'string' ? str : url;
			return str.link( ( !!~url.indexOf( '@' ) ? 'mailto:' : '' ) + url );
		},
		paragraph  : function( str ) { return Templ8.stringify( str ).replace( /([^\r\n]+)/gm, '<p>$1</p>' ); },
		stripe     : function( i ) { return parseInt( i, 10 ) & 1 ? 'stripe-odd' : 'stripe-even'; }
	} );

}( typeof Templ8 != 'undefined' ? Templ8.global : this );
