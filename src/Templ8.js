	var F = !1, N = null, OP = Object.prototype, T = !0, U,
		ARR   = 'array',       FUN      = 'function', GLOBAL = 'global', HTMCOL = 'htmlcollection',
		HTMEL = 'htmlelement', NODELIST = 'nodelist', NUM    = 'number', OBJ    = 'object',
		STR   = 'string',      UNDEF    = 'undefined',
		RESERVED = {
			'__ASSERT__' : T,  '__CONTEXT__' : T, '__FILTER_' : T, '__OUTPUT__' : T, '__UTIL__'   : T,
			'$_'         : T,  'document'    : T, 'false'     : T, 'global'     : T, 'instanceof' : T,
			'null'       : T,  'true'        : T, 'typeof'    : T, 'undefined'  : T, 'window'     : T
		},
		RE_GSUB  = /\$?\{([^\}\s]+)\}/g, SLICE = ( [] ).slice,
		ba       = {
			blank      : function( o ) { return !not_empty( o ) || !o.trim() || !re_not_blank.test( o ); },
			contains   : contains,
			endsWith   : function( s, str ) {
				s = String( s );
				var n = s.length - str.length;
				return n >= 0 && s.lastIndexOf( str ) == n;
			},
			empty      : function( o )      { return !not_empty(o ); },
			equals     : function( o, v )   { return o == v },
			exists     : function( o )      { return typeof o == NUM ? !isNaN( o ) : ( o !== U && o !== N ); },
			is         : function( o, v )   { return o === v },
			isEven     : function( i )      { return !( parseInt( i, 10 ) & 1 ); },
			isOdd      : function( i )      { return !( parseInt( i, 10 ) & 1 ); },
			isTPL      : function( id )     { return !!( getTPL( format( tpl_sub, this.id, id ) ) || getTPL( id ) ); },
			iterable   : function( o )      { return re_iterable.test( Templ8.type( o ) ); },
			notEmpty   : not_empty,
			startsWith : function( s, str ) { return String( s ).indexOf( str ) === 0; }
		},
		bf = {}, bu = {
			context    : function( o, fb )      { return new ContextStack( o, fb ); },
			output     : function( o )          { return new Output( o ); },
			iter       : function( i, p, s, c ) { return new Iter( i, p, s, c  ); },
			objectify  : function( v, k )       { var o = {}; o[k] = v; return o; },
			parse      : function( o, id, mixins ) {
				id    = String( id ).trim();
				var t = getTPL( format( tpl_sub, this.id, id ) ) || getTPL( id );
				switch( Templ8.type( mixins ) ) {
					case OBJ :              break;
					case F   : mixins = {}; break;
					default  : mixins = { __MIXINS__ : mixins };
				}

				return t ? t.parse( copy( mixins, o, T ), this.filters ) : this.fallback;
			},
			stop       : function( iter ) { iter.stop(); },
			type       : function( o )    { return Templ8.type( o ); }
		},
		ck        = '__tpl_cs_cached_keys',                  cs      = '__tpl_cs_stack',
		defaults  = ['compiled', 'debug', 'fallback', 'id'], delim   = '<~>',
		esc_chars = /([-\*\+\?\.\|\^\$\/\\\(\)[\]\{\}])/g,   esc_val = '\\$1',

		fn_var   = { assert : '__ASSERT__', dict : '__CONTEXT__', filter : '__FILTER__', output : '__OUTPUT__', util : '__UTIL__' },
		fn_end   = format( '$C.destroy(); return {0}.join( "" );\n ', fn_var.output ),
		fn_start = format( 'var $C = {0}.context( {1}, this.fallback ), $_ = $C.current(), iter = {0}.iter(), {2} = {0}.output(), U;', fn_var.util, fn_var.dict, fn_var.output ),

		id_count = 999, internals,

		re_domiter       = new RegExp( format( '{0}|{1}', HTMCOL, NODELIST ) ), //htmlcollection|nodelist/,
		re_esc           = /(['"])/g,       re_element            = /^html\w+?element$/, re_format_delim    = new RegExp( delim, 'gm' ),
		re_global        = /global|window/, re_iterable           = new RegExp( format( '{0}|{1}|{2}|arguments|{3}', ARR, HTMCOL, OBJ, NODELIST ) ), //array|htmlcollection|object|arguments|nodelist/,
		re_new_line      = /[\r\n]+/g,      re_not_blank          = /\S/,                re_special_char    = /[\(\)\[\]\{\}\?\*\+\/<>%&=!-]/,
		re_statement_fix = /\.(\d+)(\.?)/g, re_statement_replacer = '[\'$1\']$2',        re_statement_split = new RegExp( '\\s*([^\\|]+(?:\\|[^\\|]+?)){0,}' + delim, 'g' ),
		re_space         = /\s+/g,          re_split_tpl,

		split_token = '<__SPLIT__TEMPLATE__HERE__>', split_replace = ['', '$1', '$2', ''].join( split_token ),

		tpl = {}, tpl_id = 'tpl-anon-{0}', tpl_statement = '{0}["{1}"].call( this, {2}{3}, {4} )', tpl_sub = '{0}.{1}';

/*** START: Utility Functions ***/

	Object.values || ( Object.values = function( o ) {
		var k, values = [];
		for ( k in o ) !has( o, k ) || values.push( o[k] );
		return values;
	} );

	function contains( o, k ) { return Templ8.type( o.indexOf ) == FUN ? !!~o.indexOf( k ) : k in o; }

	function copy( d, s, n ) {
		n = n === T; s || ( s = d, d = {} );
		for ( var k in s ) ( n && k in d ) || ( d[k] = s[k] );
		return d;
	}

	function escapeRE( s ) { return String( s ).replace( esc_chars, esc_val ); }

	function format( s ) { return gsub( s, SLICE.call( arguments, 1 ) ); }

	function getTPL( id ) { return tpl[id] || N; }

	function gsub( s, o, pattern ) { return String( s ).replace( ( pattern || RE_GSUB ), function( m, p ) { return o[p] || ''; } ); }

	function has( o, k ) { return OP.hasOwnProperty.call( o, k ); }

	function is_fn( o )  { return typeof o == FUN; }
	function is_obj( o ) { return Templ8.type( o ) == OBJ; }
	function is_str( o ) { return typeof o == STR; }

	function mapc( a, fn, ctx ) {
		ctx || ( ctx = a );
		return a.reduce( function( res, o, i ) {
			var v = fn.call( ctx, o, i, a );
			ba.blank( v ) || res.push( v );
			return res;
		}, [] );
	}
	
	function not_empty( o ) {
		switch ( Templ8.type( o ) ) {
			case F   : return F;
			case NUM : return !isNaN( o );
			case STR : return o != '';
			case ARR : return !!o.length;
			case OBJ : for ( var k in o ) if ( k ) return T;
		}
		return F;
	}

	function objval( o ) {
		if ( o === U ) return U;
		var a = SLICE.call( arguments, 1 ), k;
		if ( a.length == 1 ) {
			if ( a[0] === U ) return U;
			if ( !~a[0].indexOf( '.' ) ) return o[a[0]];
			a = a[0].split( '.' );
		}
		while ( k = a.shift() ) {
			if ( !( k in o ) ) return U;
			o = o[k];
		}
		return o;
	}

	function tostr( o ) { return OP.toString.call( o ); }

	function type( o ) {
		if ( o === U || o === N ) return F;
		var t = tostr( o ).split( ' ' )[1].toLowerCase();
		t = t.substring( 0, t.length - 1 );
		return re_domiter.test( t ) ? HTMCOL : re_element.test( t ) ? HTMEL : re_global.test( t ) ? GLOBAL : t;
	}

/*** END:   Utility Functions ***/

/*** START: Classes used by compiled templates ***/

	function ContextStack( o, fallback ) {
		this[ck] = {}; this[cs] = [root];
		if ( fallback !== U ) {
			this.hasFallback = T;
			this.fallback    = fallback;
		}
		if ( ba.exists( o ) ) this.push( o );
	}
	ContextStack.prototype = {
		current : function() { return ( this[cs][0] || {} ).dict; },
		destroy : function() {
			this.destroyed = T;
			delete this[ck]; delete this[cs];
			return this;
		},
		get     : function( k ) {
			var c = this[ck], i = -1, d, o, s = this[cs], l = s.length, v;
			while ( ++i < l ) {
				o = s[i]; d = o.dict;
				if ( k in c && d === c[k].o ) return c[k].v;
				if ( ( v = objval( d, k ) ) !== U ) {
					c[k] = { o : d, v : v };
					o[ck].push( k );
					return c[k].v;
				}
			}
			return this.hasFallback ? this.fallback : U;
		},
		pop     : function() { return this[cs].shift(); },
		push   : function( v ) {
			var o = { dict : v }; o[ck] = [];
			this[cs].unshift( o );
			return this;
		}
	};

	function Iter( iter, parent, start, count ) {
		if ( !iter ) return this;
		start = start === U ? -1 : start - 2;
		count = count === U ?  0 : count;
		this.index  = start;
		this.index1 = start + 1;
		this.items  = ba.iterable( iter ) ? iter : N;
		this.type   = Templ8.type( iter );
		if ( this.type == OBJ ) {
			this.items    = Object.values( iter );
			this.keys     = Object.keys( iter );
			this.firstKey = this.keys[0];
			this.lastKey  = this.keys[this.keys.length - 1];
		}
		if ( this.items ) {
			this.count = count ? count : this.items.length;
			this.first = this.items[0];
			this.last  = this.items[this.count - 1];
		}
		if ( parent.items != U ) this.parent = parent;
	}

	Iter.prototype = {
		hasNext : function() {
			if ( this.stopped || isNaN( this.index ) || !this.items || ( ++this.index >= this.count ) ) return F;
			if ( this.index >= this.count - 1 ) this.isLast = T;
			this.current  = this.items[this.index];
			this.previous = this.items[this.index - 1] || U;
			this.next     = this.items[++this.index1]  || U;
			if ( this.type == OBJ ) {
				this.key         = this.keys[this.index];
				this.previousKey = this.keys[this.index - 1] || U;
				this.nextKey     = this.keys[this.index1]    || U;
			}
			return this;
		},
		stop : function() {
			this.stopped = T;
			return this;
		}
	};

	function Output( o ) { this.__data = Templ8.type( o ) == ARR ? o : []; }
	Output.prototype = {
		join : function() { return this.__data.join( '' ); },
		push : function( o ) { this.__data.push( stringify( o ) ); return this; }
	};

/*** END:   Classes used by compiled templates ***/

/*** START: create template methods ***/

	function aggregatetNonEmpty( res, str ) {
		!not_empty( str ) || res.push( str );
		return res;
	}

	function aggregateStatement( ctx, s ) {
		return s.reduce( function( res, v, i, parts ) {
			if ( i == 0 ) return wrapGetter( ctx, v );
			v = v.split( ':' );
			var args = '', fn = v.shift();
			!is_str( v[0] ) || ( args = ', ' + v[0].split( ',' ).map( function( o ) { return wrapGetter( this, o ); }, ctx ).join( ', ' ) );
			return format( tpl_statement, getFnParent( fn ), fn, wrapGetter( ctx, res ), args, fn_var.dict );
		}, '' );
	}

	function assembleParts( ctx, parts ) {
		var fn = [fn_start], part;

		while ( part = parts.shift() ) fn.push( emitTag( ctx, part, parts ) );

		fn.push( fn_end );

		return fn.join( '\r\n' );
	}

	function clean( str ) { return str.replace( re_format_delim, '' ).replace( re_new_line, '\n' ).replace( re_space, ' ' ).trim(); }

	function compileTemplate( ctx, fn ) {
		if ( ctx.debug && typeof console != UNDEF ) {
			console.info( ctx.id ); console.log( fn );
		}
		var func = new Function( 'root', fn_var.filter, fn_var.assert, fn_var.util, fn_var.dict, fn );
		return func.bind( ctx, root, copy( ctx.filters, Templ8.Filter.all(), T ), ba, bu );
	}

	function createTemplate( ctx ) {
		ctx.currentIterKeys = [];
		var fn = compileTemplate( ctx, assembleParts( ctx, splitStr( ctx.__tpl__ ) ) );
		delete ctx.currentIterKeys;
		return fn;
	}

	function emitTag( ctx, part, parts ) {
		var tag;
		if ( tag = Templ8.Tag.get( part ) ) {
			part = parts.shift();
			return tag.emit( internals, ctx, part, parts );
		}
		return wrapStr( format( '"{0}"', part.replace( re_esc, "\\$1" ) ) );
	}

 	function formatStatement( ctx, str ) {
		str = clean( str );
		return contains( str, '|' ) || contains( str, delim ) ? ( ' ' + str + delim ).replace( re_statement_split, function( m ) {
			return ba.blank( m ) || m == delim ? '' : aggregateStatement( ctx, clean( m ).split( '|' ) );
		} ) : wrapGetter( ctx, str );
	}

	function getFnParent( fn ) { return ( ba[fn] ? fn_var.assert : bu[fn] ? fn_var.util : fn_var.filter ); }

	function splitStr( str ) {
		return str.replace( re_split_tpl, split_replace )
				  .split( split_token )
				  .reduce( aggregatetNonEmpty, [] );
	}

	function stringify( o, str ) {
		switch( Templ8.type( o ) ) {
			case 'boolean' : case NUM : case STR : return String( o );
			case 'date'    : return o.toDateString();
			case ARR       : return mapc( o, stringify ).join( ', ' );
			case OBJ       : return ck in o
							? stringify( o.dict ) : ( ( str = o.toString() ) != '[object Object]' )
							? str : mapc( Object.values( o ), stringify ).join( ', ' );
			case HTMEL     : return o.textContent || o.text || o.innerText;
			case HTMCOL    : return mapc( SLICE.call( o ), function( el ) { return stringify( el ); } ).join( ', ' );
		}
		return '';
	}

	function usingIterKey( key ) { return this == key || ba.startsWith( this, key + '.' ); }
	function usingIterKeys( keys, o ) { return keys.length ? keys.some( function( k ) { return k.some( usingIterKey, o ); } ) : 0; }

	function wrapGetter( ctx, o ) {
		var k = ctx.currentIterKeys || []; o = clean( o );
		return ( contains( o, '.call(' )
			|| re_special_char.test( o )
			|| ( ba.startsWith( o, '"' ) && ba.endsWith( o, '"' ) )
			|| ( ba.startsWith( o, "'" ) && ba.endsWith( o, "'" ) )
			|| !isNaN( o ) )
		? o : ( ba.startsWith( o, '$_.' ) || ba.startsWith( o, 'iter.' ) || ( k.length && usingIterKeys( k, o ) ) || o in RESERVED )
		? o.replace( re_statement_fix, re_statement_replacer ) : format( '$C.get( "{0}" )', o );
	}

	function wrapStr( str ) { return format( '{0}.push( {1} );', fn_var.output, str.replace( /[\n\r]/gm, '\\n' ) ); }

// these will be passed to tags & statements for internal usage
	internals = {
		assembleparts   : assembleParts,   clean   : clean,      compiletpl : compileTemplate,
		createtpl       : createTemplate,  emittag : emitTag,    fnvar      : fn_var,
		formatstatement : formatStatement, get     : wrapGetter, util       : bu,
		wrap            : wrapStr
	};

/*** END:   create template methods ***/

/*** START: Templ8 constructor and prototype ***/

	function Templ8() {
		var a = SLICE.call( arguments ), 
			f = is_obj( a[a.length - 1] ) ? a.pop() : is_obj( a[0] ) ? a.shift() : N;

// take care of peeps who are too lazy or too ©ººL to use the "new" constructor...
		if ( !( this instanceof Templ8 ) ) return is_obj( f ) ? new Templ8( a.join( '' ), f ) : new Templ8( a.join( '' ) );
		
		!f || defaults.forEach( function( k ) {
			if ( k in f ) { this[k] = f[k]; delete f[k]; }
		}, this );

		this.filters = f || {};

		this.__tpl__ = a.join( '' );

		tpl[$id( this )] = this;

		if ( this.compiled ) {
			this.compiled = F;
			compile( this );
		}
	}

	function $id( ctx ) {
		ctx.id || ( ctx.id = format( tpl_id, ++id_count ) );
		return ctx.id;
	}

	function compile( ctx ) {
		if ( !ctx.compiled ) {
			ctx.compiled = T;
			ctx._parse = createTemplate( ctx );
		}
		return ctx;
	}

	function parse( dict ) {
		this.compiled || compile( this );
		return this._parse( dict );
	}

	Templ8.prototype = {
		compiled : F, debug : F, fallback : '',
		parse    : parse
	};



/*** END:   Templ8 constructor and prototype ***/

/*** START: Templ8 functionality packages ***/

	copy( Templ8, { // exposed for general usage
		copy : copy, escapeRE  : escapeRE,  format : format, get  : getTPL,
		gsub : gsub, stringify : stringify, tostr  : tostr,  type : type
	} );

	function Mgr( o ) {
		var cache = {};

		!is_obj( o ) || copy( cache, o );

		function add( id, fn, replace ) {
			( !replace && id in cache ) || ( cache[id] = fn );
//			o = cache;
		}

		this.all = function() { return copy( cache ); };
		this.add = function( o ) {
			switch( typeof o ) {
				case STR : add( o, arguments[1], F );            break;
				case OBJ : for ( var k in o ) add( k, o[k], F ); break;
			} return this;
		};
		this.get = function( id ) { return cache[id]; };
		this.replace = function( o ) {
			switch( typeof o ) {
				case STR : add( o, arguments[1], T );            break;
				case OBJ : for ( var k in o ) add( k, o[k], T ); break;
			} return this;
		};
	}

	Templ8.Assert    = new Mgr( ba );
	Templ8.Filter    = new Mgr( bf );
	Templ8.Statement = new Mgr;
	Templ8.Tag       = new function() {
		var KEYS   = 'emit end start'.split( ' ' ),
			ERRORS = {
				emit  : 'emit function',
				end   : 'end tag definition',
				start : 'start tag definition'
			},
			tag    = {};

		function Tag( config ) {
			KEYS.forEach( assert_exists, config );
			copy( this, config );
			tag[this.start] = this;
		}

		function assert_exists( k ) {
			if ( !( k in this ) ) { throw new TypeError( format( 'A Templ8 Tag requires an {0}', ERRORS[k] ) ); }
		}
		
		this.all = function() { return copy( tag ); };

		this.compileRegExp = function() {
			var end = [], start = [], t;
			for ( t in tag ) {
				end.push( escapeRE( tag[t].end.substring( 0, 1 ) ) );
				start.push( escapeRE( tag[t].start.substring( 1 ) ) );
			}
			return ( re_split_tpl = new RegExp( '(\\{[' + start.join( '' ) + '])\\s*(.+?)\\s*([' + end.join( '' ) + ']\\})', 'gm' ) );
		};

		this.create = function( o, dont_compile ) {
			new Tag( o ); dont_compile === T || this.compileRegExp();
			return this;
		};

		this.get = function( id ) { return tag[id]; };
	};

/*** END:   Templ8 functionality packages ***/
