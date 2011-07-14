var AP     = Array.prototype,
	SP     = String.prototype,
	fn_arr = {
		every : function( fn, ctx ) {
			ctx || ( ctx = this );
			var i = -1, l = this.length;
			while( ++i < l ) {
				if ( !fn.call( ctx, this[i], i, this ) ) { return FALSE; }
			}
			return TRUE;
		}, 
		forEach : function( fn, ctx ) {
			ctx || ( ctx = this );
			this.reduce( function( v, o, i, a ) {
				fn.call( ctx, o, i, a );
				return v;
			}, this );
			return this;
		},
		map : function( fn, ctx ) {
			return this.reduce( function( res, o, i, a ) {
				res.push( fn.call( ctx, o, i, a ) );
				return res;
			}, [], ctx );
		},
		reduce : function( fn, v ) {
			ctx || ( ctx = this );
			var i = -1, l = this.length;
			while( ++i < l ) {
				v = fn.call( ctx, v, this[i], i, this );
			}
			return v;
		},
		some : function( fn, ctx ) {
			ctx || ( ctx = this );
			var i = -1, l = this.length;
			while( ++i < l ) {
				if ( fn.call( ctx, this[i], i, this ) ) { return TRUE; }
			}
			return FALSE;
		}
	},
	fn_str = {
		trim : function( o ) { return String( o ).replace( trim_left, '$1' ).replace( trim_right, '$1' ); }
	},
	fn_name,
	oToStr     = ( {} ).toString,
	re_window  = /global|window/,
	trim_left  = /^[\n\r\t\s]*(\S.*?)/m,
	trim_right = /(.*?\S)[\n\r\t\s]*$/m;

	for ( fn_name in fn_arr ) {
		if ( !( fn_name in AP ) ) { AP[fn_name] = fn_arr[fn_name]; }
	}
	for ( fn_name in fn_str ) {
		if ( !( fn_name in SP ) ) { SP[fn_name] = fn_str[fn_name]; }
	}

	TPL.type = function( o ) {
		if ( o === UNDEF || o === NULL ) return FALSE;
		var type = oToStr.call( o ).split( ' ' )[1].toLowerCase();
		type = type.substring( 0, type.length - 1 );

		switch ( type ) {
			case 'object'   :
				if ( window.attachEvent ) { // handle IE coz it can has stupidz
					if ( o.nodeName && o.nodeType == 1 ) { return HTMEL; }
					if ( !isNaN( o.length ) && typeof o.item == 'function' ) { return HTMLCOL; }
					if ( o === global.document ) { return 'htmldocument'; }
					if ( o === global ) { return 'window'; }
				}
				return type;
			case 'nodelist' : return HTMLCOL; // normalise: webkit returns nodelist, FF returns htmlcollection
			default         : // this will be something like htmlwindowelement, htmldocumentelement, ..., htmldivelement
				if ( type.indexOf( 'html' ) > -1 ) {
					return type.indexOf( 'htmldocument' ) > - 1 ? 'htmldocument' : re_window.test( type ) ? 'window' : HTMLEL;
				}
		}

		return type;
	};
