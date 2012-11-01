	__Class__.Filter.add( {
		capitalize     : function( str ) {
			str = __Class__.stringify( str );
			return str.charAt( 0 ).toUpperCase() + str.substring( 1 ).toLowerCase();
		},
		count          : function( o ) { return util.len( o ) || 0; },
		crop           : function( str, i ) {
			str = __Class__.stringify( str );
			i   = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i / 2 ) + '...' + str.substring( str.length - ( i / 2 ) ) : str;
		},
		def            : function( str, def ) { return ba.blank( str ) ? def : str; },
		first          : function( o ) {
			switch ( util.ntype( o ) ) {
				case 'array'  : return o[0];
				case 'string' : return o.charAt( 0 );
			}
		},
		join           : function( o, s ) { return util.got( o, 'join' ) && typeof o.join == 'function' ? o.join( s ) : o; },
		last           : function( o ) {
			switch ( util.ntype( o ) ) {
				case 'array'  : return o[o.length-1];
				case 'string' : return o.charAt( o.length - 1 );
			}
		},
		lowercase      : function( str ) { return __Class__.stringify( str ).toLowerCase(); },
		prefix         : function( str1, str2 ) { return str2 + str1; },
		suffix         : function( str1, str2 ) { return str1 + str2; },
		truncate       : function( str, i ) {
			str = __Class__.stringify( str );
			i   = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i ) + '...' : str;
		},
		uppercase      : function( str ) { return __Class__.stringify( str ).toUpperCase(); },
		wrap           : function( str, start, end ) { return start + str + ( end || start ); }
	} );
