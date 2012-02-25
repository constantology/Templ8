Templ8.Filter.add( {
		bold           : function( str ) { return Templ8.format( '<strong>{0}</strong>', Templ8.stringify( str ) ); },
		italics        : function( str ) { return Templ8.format( '<em>{0}</em>', Templ8.stringify( str ) ); },
		linebreaks     : function( str ) { return Templ8.stringify( str ).replace( /[\r\n]/gm, '<br />\n' ); },
		link           : function( url, str ) {
			str = typeof str == 'string' ? str : url;
			return str.link( ( !!~url.indexOf( '@' ) ? 'mailto:' : '' ) + url );
		},
		paragraph      : function( str ) { return Templ8.stringify( str ).replace( /([^\r\n]+)/gm, '<p>$1</p>' ); },
		stripe         : function( i ) { return parseInt( i, 10 ) & 1 ? 'stripe-odd' : 'stripe-even'; }
} );
