!function( root ) {
	var reamp = /&/g, regt = />/g, relt = /</g, req = /"/g;

	typeof Templ8 != 'undefined' || typeof require == 'undefined' || ( Templ8 = require( 'Templ8' ) );

	Templ8.Filter.add( {
		bold       : function( str ) { return Templ8.format( '<strong>{0}</strong>', Templ8.stringify( str ) ); },
		escapeHTML : function( str ) { return str.replace( reamp, '&amp;' ).replace( regt, '&gt;' ).replace( relt, '&lt;' ).replace( req, '&quot;' ); },
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
