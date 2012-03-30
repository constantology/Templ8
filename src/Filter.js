	Templ8.Filter.add( {
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
		join           : function( o, s ) { return ( 'join' in Object( o ) && typeof o.join == 'function' ) ? o.join( s ) : o; },
		last           : function( o ) {
			switch ( Templ8.type( o ) ) {
				case ARR : return o[o.length-1];
				case STR : return o.charAt( o.length - 1 );
			}
		},
		lowercase      : function( str ) { return Templ8.stringify( str ).toLowerCase(); },
		prefix         : function( str1, str2 ) { return str2 + str1; },
		suffix         : function( str1, str2 ) { return str1 + str2; },
		truncate       : function( str, i ) {
			str = Templ8.stringify( str );
			i   = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i ) + '...' : str;
		},
		uppercase      : function( str ) { return Templ8.stringify( str ).toUpperCase(); },
		wrap           : function( str, start, end ) { return start + str + ( end || start ); }
	} );
