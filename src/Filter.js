	Templ8.Filter.add( {
//		bold           : function( str ) { return format( '<strong>{0}</strong>', Templ8.stringify( str ) ); },
		capitalize     : function( str ) {
			str = Templ8.stringify( str );
			return str.charAt( 0 ).toUpperCase() + str.substring( 1 ).toLowerCase();
		},
		count          : function( o ) {
			switch( Templ8.type( o ) ) {
				case ARR : case HTMCOL : case STR : return o.length;
				case OBJ : return Object.keys( o ).length;
			}
			return 0;
		},
		crop           : function( str, i ) {
			str = Templ8.stringify( str );
			i   = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i / 2 ) + '...' + str.substring( str.length - ( i / 2 ) ) : str;
		},
		def            : function( str, def ) { return ba.blank( str ) ? def : str; },
		first          : function( o ) {
			switch ( Templ8.type( o ) ) {
				case ARR : return o[0];
				case STR : return o.charAt( 0 );
			}
		},
//		italics        : function( str ) { return format( '<em>{0}</em>', Templ8.stringify( str ) ); },
		last           : function( o ) {
			switch ( Templ8.type( o ) ) {
				case ARR : return o[o.length-1];
				case STR : return o.charAt( o.length - 1 );
			}
		},
//		linebreaks     : function( str ) { return Templ8.stringify( str ).replace( /[\r\n]/gm, '<br />\n' ); },
//		link           : function( url, str ) {
//			str = is_str( str ) ? str : url;
//			return str.link( ( !!~url.indexOf( '@' ) ? 'mailto:' : '' ) + url );
//		},
//		log            : function() {
//			console.log( SLICE.call( arguments ) );
//			return '';
//		},
		lowercase      : function( str ) { return Templ8.stringify( str ).toLowerCase(); },
//		paragraph      : function( str ) { return Templ8.stringify( str ).replace( /([^\r\n]+)/gm, '<p>$1</p>' ); },
		prefix         : function( str1, str2 ) { return str2 + str1; },
//		stripe         : function( i ) { return parseInt( i, 10 ) & 1 ? 'stripe-odd' : 'stripe-even'; },
		suffix         : function( str1, str2 ) { return str1 + str2; },
		truncate       : function( str, i ) {
			str = Templ8.stringify( str );
			i   = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i ) + '...' : str;
		},
		uppercase      : function( str ) { return Templ8.stringify( str ).toUpperCase(); }//,
//		wrap           : function( str, start, end ) { return start + str + ( end || start ); }
	} );
