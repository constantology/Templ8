
( function( global ) {
	var ARR = 'array', FUN = 'function', HTMCOL = 'htmlcollection', HTMEL = 'htmlelement', NUM = 'number', OBJ = 'object', STR = 'string',
		FALSE = false, NULL = null, TRUE = true, UNDEF,
		RESERVED = {
			'$_' : TRUE,
			'__ASSERT__' : TRUE, '__CONTEXT__' : TRUE, '__FILTER_' : TRUE, '__OUTPUT__' : TRUE, '__UTIL__' : TRUE,
			'document' : TRUE, 'false' : TRUE, 'instanceof' : TRUE, 'null' : TRUE, 'true' : TRUE, 'typeof' : TRUE,
			'undefined' : TRUE, 'window' : TRUE
		},
		RE_GSUB  = /\{([^\}\s]+)\}/g,
		SLICE    = ( [] ).slice,
		ba = {
			blank      : function( o ) { return !not_empty( o ) || o.trim() == '' || !re_not_blank.test( o ); },
			contains   : contains,
			endsWith   : function( s, str ) {
				s = String( s );
				var n = s.length - str.length;
				return n >= 0 && s.lastIndexOf( str ) == n;
			},
			empty      : function( o ) { return !not_empty(o ); },
			equals     : function( o, v ) { return o == v },
			exists     : function( o ) { return typeof o == NUM ? !isNaN( o ) : ( o !== UNDEF && o !== NULL ); },
			is         : function( o, v ) { return o === v }, 
			isEven     : function( i ) { return !( parseInt( i, 10 ) & 1 ); },
			isOdd      : function( i ) { return !( parseInt( i, 10 ) & 1 ); },
			isTPL      : function( id ) { return !!( getTPL( format( tpl_sub, this.id, id ) ) || getTPL( id ) ); },
			iterable   : function( o ) { return re_iterable.test( TPL.type( o ) ); },
			notEmpty   : not_empty,
			startsWith : function( s, str ) { return String( s ).indexOf( str ) === 0; },
			type       : T
		},
		bf = {}, 
		bu = {
			context    : function( o, fb ) { return new ContextStack( o, fb ); },
			output     : function( o ) { return new Output( o ); },
			iter       : function( i, p, s, c ) { return new Iter( i, p, s, c  ); },
			parse      : function( o, id ) {
				id    = String( id ).trim();
				var t = getTPL( format( tpl_sub, this.id, id ) ) || getTPL( id );
				return t ? t.parse( o, this.filters ) : this.fallback;
			},
			stop       : function( iter ) { iter.stop(); }
		},
		ck                    = '__tpl_cs_cached_keys',
		cs                    = '__tpl_cs_stack',
		delim                 = '<~>',
		esc_chars             = /([\u0021\u0028\u0029\u002a\u002b\u002e\u003a\u003d\u003f\u005b\u005d\u005e\u007b\u007c\u007d\/\\])/g,
		esc_val               = "\\\$1",
		fn_var                = { assert : '__ASSERT__', dict : '__CONTEXT__', filter : '__FILTER__', output : '__OUTPUT__', util : '__UTIL__' },
		fn_end                = format( '$C.destroy(); return {0}.join( "" );\n ', fn_var.output ), 
		fn_start              = format( 'var $C = {0}.context( {1}, this.fallback ), $_ = $C.current(), iter = {0}.iter(), {2} = {0}.output(), UNDEF;', fn_var.util, fn_var.dict, fn_var.output ),
		id_count              = 999,
		internals,
		objkeys               = Object.keys || function( o ) {
			var k, v = [];
			for ( k in o ) { v.push( k ); }
			return v;
		},
		objvals               = Object.values || function( o ) {
			var k, v = [];
			for ( k in o ) { v.push( o[k] ); }
			return v;
		},
		re_domiter            = /htmcollection|nodelist/,
		re_esc                = /(['"])/g,
		re_element            = /^html\w+?element$/,
		re_format_delim       = new RegExp( delim, 'gm' ),
		re_iterable           = /array|htmlcollection|object|arguments|nodelist/,
		re_new_line           = /[\r\n]+/g,
		re_not_blank          = /\S/,
		re_rmbracket          = /\]$/,
		re_special_char       = /[\(\)\[\]\{\}\?\*\+\/<>%&=!-]/,
		re_statement_fix      = /\.(\d+)(\.?)/g,
		re_statement_replacer = '[\'$1\']$2',
		re_statement_split    = new RegExp( '\\s*([^\\|]+(?:\\|[^\\|]+?)){0,}' + delim, 'g' ),
		re_space              = /\s+/g,
		re_split_tpl,
		split_token           = '<__SPLIT__TEMPLATE__HERE__>',
		split_replace         = ['', '$1', '$2', ''].join( split_token ),
		tpl                   = {},
		tpl_id                = 'tpl-anon-{0}',
		tpl_statement         = '{0}["{1}"].call( this, {2}{3}, {4} )', 
		tpl_sub               = '{0}.{1}';

/*** START: Utility Functions ***/

	function T( o ) {
		if ( o === UNDEF || o === NULL ) { return FALSE; }
		var t = ( {} ).toString.call( o ).substring( 8 ).toLowerCase().replace( re_rmbracket, '' );
		if ( re_domiter.test( t ) ) { return HTMCOL; }
		if ( re_element.test( t ) ) { return HTMEL; }
		return t;
	}

	function bind( func, ctx ) {
		var args = SLICE.call( arguments, 2 );
		return function() { return func.apply( ctx || this, args.concat( SLICE.call( arguments ) ) ); };
	}

	function contains( o, k ) { return TPL.type( o.indexOf ) == FUN ? o.indexOf( k ) > -1 : k in o; }

	function copy( d, s, n ) {
		n = n === TRUE;
		s || ( s = d, d = {} );
		for ( var k in s ) { if ( !n || !( k in d ) ) { d[k] = s[k]; } }
		return d;
	}

	function escapeRE( s ) { return String( s ).replace( esc_chars, esc_val ); }

	function format( s ) { return gsub( s, SLICE.call( arguments, 1 ) ); }

	function getTPL( id ) { return tpl[id] || NULL; }

	function gsub( s, o, pattern ) { return String( s ).replace( ( pattern || RE_GSUB ), function( m, p ) { return o[p] || ''; } ); }

	function is_obj( o ) { return TPL.type( o ) == OBJ; }

	function mapc( a, fn, ctx ) {
		ctx || ( ctx = a );
		return a.reduce( function( res, o, i ) {
			var v = fn.call( ctx, o, i, a );
			ba.blank( v ) || res.push( v );
			return res;
		}, [] );
	}
	
	function not_empty( o ) {
		switch ( TPL.type( o ) ) {
			case FALSE    : return FALSE;
			case NUM : return !isNaN( o );
			case STR : return o != '';
			case ARR  : return !!o.length;
			case OBJ : for ( var k in o ) { if ( k ) { return TRUE; } }
		}
		return FALSE;
	}

	function objval( o ) {
		if ( o === UNDEF ) { return UNDEF; }
		var a = SLICE.call( arguments, 1 ), k;
		if ( a.length == 1 ) {
			if ( a[0] === UNDEF ) { return UNDEF; }
			if ( a[0].indexOf( '.' ) < 0 ) { return o[a[0]]; }
			a = a[0].split( '.' );
		}
		while ( k = a.shift() ) {
			if ( !( k in o ) ) { return UNDEF; }
			o = o[k];
		}
		return o;
	}

/*** END:   Utility Functions ***/

/*** START: Classes used by compiled templates ***/

	function ContextStack( o, fallback ) {
		this[ck] = {}; this[cs] = [global];
		if ( fallback !== UNDEF ) {
			this.hasFallback = TRUE;
			this.fallback    = fallback;
		}
		if ( ba.exists( o ) ) { this.push( o ); }
	}
	ContextStack.prototype = {
		current : function() { return this[cs][0].dict; },
		destroy : function() {
			this.destroyed = TRUE;
			delete this[ck]; delete this[cs];
			return this;
		},
		get     : function( k ) {
			var c = this[ck], i = -1, d, o, s = this[cs], l = s.length, v;
			while ( ++i < l ) {
				o = s[i]; d = o.dict;
				if ( k in c && d === c[k].o ) { return c[k].v; }
				if ( ( v = objval( d, k ) ) !== UNDEF ) {
					c[k] = { o : d, v : v };
					o[ck].push( k );
					return c[k].v;
				}
			}
			return this.hasFallback ? this.fallback : UNDEF;
		},
		pop     : function() {
			return this[cs].shift();
		},
		push   : function( v ) {
			var o = { dict : v };
			o[ck] = [];
			this[cs].unshift( o );
			return this;
		}
	};

	function Iter( iter, parent, start, count ) {
		if ( !iter ) { return this; }
		start = start === UNDEF ? -1 : start - 2;
		count = count === UNDEF ?  0 : count;
		this.index  = start;
		this.index1 = start + 1;
		this.items  = ba.iterable( iter ) ? iter : NULL;
		this.type   =  TPL.type( iter );
		if ( this.type == OBJ ) {
			this.items    = objvals( iter );
			this.keys     = objkeys( iter );
			this.firstKey = this.keys[0];
			this.lastKey  = this.keys[this.keys.length - 1];
		}
		if ( this.items ) {
			this.count = count ? count : this.items.length;
			this.first = this.items[0];
			this.last  = this.items[this.count - 1];
		}
		if ( parent.items != UNDEF ) {
			this.parent = parent;
		}
	}

	Iter.prototype = {
		hasNext : function() {
			if ( this.stopped || isNaN( this.index ) || !this.items ) { return FALSE; }
			if ( ++this.index >= this.count ) { return FALSE; }
			if ( this.index >= this.count - 1 ) { this.isLast = TRUE; }
			this.current  = this.items[this.index];
			this.previous = this.items[this.index - 1] || UNDEF;
			this.next     = this.items[++this.index1]  || UNDEF;
			if ( this.type == OBJ ) {
				this.key         = this.keys[this.index];
				this.previousKey = this.keys[this.index - 1] || UNDEF;
				this.nextKey     = this.keys[this.index1]    || UNDEF;
			}
			return this;
		},
		stop : function() {
			this.stopped = TRUE;
			return this;
		}
	};

	function Output( o ) { this.__data = TPL.type( o ) == ARR ? o : []; }
	Output.prototype = {
		join : function() { return this.__data.join( '' ); },
		push : function( o ) { this.__data.push( tostr( o ) ); return this; }
	};

/*** END:   Classes used by compiled templates ***/

/*** START: create template methods ***/

	function aggregatetNonEmpty( res, str ) {
		!not_empty( str ) || res.push( str );
		return res;
	}

	function aggregateStatement( ctx, s ) {
		return s.reduce( function( res, v, i, parts ) {
			if ( i == 0 ) { return wrapGetter( ctx, v ); }
			v = v.split( ':' );
			var args = '', fn = v.shift();
			if ( typeof v[0] == STR ) { args = ', ' + v[0].split( ',' ).map( function( o ) { return wrapGetter( this, o ); }, ctx ).join( ', ' ); }
			return format( tpl_statement, getFnParent( fn ), fn, wrapGetter( ctx, res ), args, fn_var.dict );
		}, '' );
	}

	function assembleParts( ctx, parts ) {
		var fn = [fn_start], part;

		while ( part = parts.shift() ) { fn.push( emitTag( ctx, part, parts ) ); }

		fn.push( fn_end );

		return fn.join( '\r\n' );
	}

	function clean( str ) { return str.replace( re_format_delim, '' ).replace( re_new_line, '\n' ).replace( re_space, ' ' ).trim(); }

	function compileTemplate( ctx, fn ) {
		if ( ctx.debug && global.console ) {
			console.info( ctx.id );
			console.log( fn );
		}
		var func = new Function( fn_var.filter, fn_var.assert, fn_var.util, fn_var.dict, fn );
		return bind( func, ctx, copy( ctx.filters, TPL.Filter.all(), TRUE ), ba, bu );
	}

	function createTemplate( ctx, str ) {
		ctx.currentIterKeys = [];
		var fn = compileTemplate( ctx, assembleParts( ctx, splitStr( str ) ) );
		delete ctx.currentIterKeys;
		return fn;
	}

	function emitTag( ctx, part, parts ) {
		var tag;
		if ( tag = TPL.Tag.get( part ) ) {
			part = parts.shift();
			return tag.emit( internals, ctx, part, parts );
		}
		return wrapStr( format( '"{0}"', part.replace( re_esc, "\\$1" ) ) );
	}

 	function formatStatement( ctx, str ) {
		str = clean( str );
		return contains( str, '|' ) || contains( str, delim ) ? ( ' ' + str + delim ).replace( re_statement_split, function( m ) {
			if ( ba.blank( m ) || m == delim ) { return ''; }
			var s = clean( m ).split( '|' );
			return aggregateStatement( ctx, s );
		} ) : wrapGetter( ctx, str );
	}

	function getFnParent( fn ) { return ( ba[fn] ? fn_var.assert : bu[fn] ? fn_var.util : fn_var.filter ); }

	function splitStr( str ) {
		var parts = str.replace( re_split_tpl, split_replace );
		parts = parts.split( split_token );
		parts = parts.reduce( aggregatetNonEmpty, [] );
		return parts;
	}

	function tostr( o ) {
		switch( TPL.type( o ) ) {
			case STR : case NUM : case 'boolean' : return String( o );
				break;
			case 'date' : return o.toDateString();
				break;
			case ARR : return mapc( o, tostr ).join( ', ' );
				break;
			case OBJ :
				if ( ck in o ) { return tostr( o.dict ); }
				var str = o.toString();
				if ( str != '[object Object]' ) { return str; }
				return mapc( objvals( o ), tostr ).join( ', ' );
			case HTMEL : return o.textContent;
				break;
			case HTMCOL : return mapc( SLICE.call( o ), function( el ) { return el.textContent; } ).join( ', ' );
				break;
		}
		return '';
	}

	function usingIterKey( key ) { return this == key || ba.startsWith( this, key + '.' ); }
	function usingIterKeys( keys, o ) { return keys.length ? keys.some( function( k ) { return k.some( usingIterKey, o ); } ) : 0; }

	function wrapGetter( ctx, o ) {
		o = clean( o ); var k = ctx.currentIterKeys || [];
		if ( contains( o, '.call(' )
			|| re_special_char.test( o )
			|| ( ba.startsWith( o, '"' ) && ba.endsWith( o, '"' ) )
			|| ( ba.startsWith( o, "'" ) && ba.endsWith( o, "'" ) )
			|| !isNaN( o ) ) { return o; }
		if ( ba.startsWith( o, '$_.' ) || ba.startsWith( o, 'iter.' ) || ( k.length && usingIterKeys( k, o ) )  || o in RESERVED )
			return o.replace( re_statement_fix, re_statement_replacer );
		return format( '$C.get( "{0}" )', o );
	}

	function wrapStr( str ) { return format( '{0}.push( {1} );', fn_var.output, str.replace( /[\n\r]/gm, '\\n' ) ); }

// these will be passed to tags & statements for internal usage
	internals = {
		assembleparts   : assembleParts,
		clean           : clean,
		compiletpl      : compileTemplate,
		createtpl       : createTemplate,
		emittag         : emitTag,
		fnvar           : fn_var,
		formatstatement : formatStatement,
		get             : wrapGetter, 
		util            : bu,
		wrap            : wrapStr
	};

/*** END:   create template methods ***/

/*** START: TPL constructor and prototype ***/

	function TPL() {
		var a = SLICE.call( arguments ), 
			f = is_obj( a[a.length - 1] ) ? a.pop() : is_obj( a[0] ) ? a.shift() : null;
		
		this.filters = f || {};
		
		!f || ['compiled', 'debug', 'fallback', 'id'].forEach( function( o ) {
			if ( !( o in f ) ) { return; }
			this[o] = f[o];
			delete f[o];
		}, this );

		this.__tpl = a.join( '' );

		tpl[$id( this )] = this;

		if ( this.compiled ) {
			this.compiled = FALSE;
			compile( this );
		}
	}

	function $id( ctx ) {
		if ( !ctx.id ) { ctx.id = format( tpl_id, ++id_count ); }
		return ctx.id;
	}

	function compile( ctx ) {
		if ( !ctx.compiled ) {
			ctx.compiled = TRUE;
			ctx._parse = createTemplate( ctx, ctx.__tpl );
		}
		return ctx;
	}

	function parse( dict ) {
		if ( !this.compiled ) { compile( this ); }
		return this._parse( dict );
	}

	TPL.prototype = {
		compiled       : FALSE,
		debug          : FALSE,
		fallback       : '',

		parse          : parse
	};

/*** END:   TPL constructor and prototype ***/

/*** START: TPL functionality packages ***/

	copy( TPL, { // exposed for general usage
		copy         : copy,
		escapeRE     : escapeRE,
		fnBind       : bind,
		format       : format,
		get          : getTPL,
		gsub         : gsub,
		objectKeys   : objkeys,
		objectValues : objvals,
		tostr        : tostr,
		type         : T
	} );

	function Mgr( o ) {
		var cache = {};

		if ( is_obj( o ) ) { copy( cache, o ); }

		function add( id, fn, replace ) {
			if ( replace || !( id in cache ) ) { cache[id] = fn; }
			o = cache;
		}

		this.all = function() { return copy( cache ); };
		this.add = function( o ) {
			switch( typeof o ) {
				case STR : add( o, arguments[1], FALSE );                break;
				case OBJ : for ( var k in o ) { add( k, o[k], FALSE ); } break;
			}
			return this;
		};
		this.get = function( id ) { return cache[id]; };
		this.replace = function( o ) {
			switch( typeof o ) {
				case STR : add( o, arguments[1], TRUE );                break;
				case OBJ : for ( var k in o ) { add( k, o[k], TRUE ); } break;
			}
			return this;
		};
	}

	TPL.Assert    = new Mgr( ba );
	TPL.Filter    = new Mgr( bf );
	TPL.Statement = new Mgr;
	TPL.Tag       = new function() {
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
		
		this.all           = function() { return copy( tag ); };

		this.compileRegExp = function() {
			var end = [], start = [], t;
			for ( t in tag ) {
				end.push( escapeRE( tag[t].end.substring( 0, 1 ) ) );
				start.push( escapeRE( tag[t].start.substring( 1 ) ) );
			}
			return ( re_split_tpl = new RegExp( '(\\{[' + start.join( '' ) + '])\\s*(.+?)\\s*([' + end.join( '' ) + ']\\})', 'gm' ) );
		}

		this.create        = function( o, dont_compile ) {
			new Tag( o );
			if ( dont_compile !== TRUE ) { this.compileRegExp(); }
			return this;
		}

		this.get           = function( id ) { return tag[id]; }
	};

/*** END:   TPL functionality packages ***/


/* Tag.js */
	var _tags = [ {
			start : '{{', end : '}}',
			emit  : function( internals, ctx, str, tpl_parts ) {
				if ( str == '' )
					throw new SyntaxError( 'Templ8 missing key in value declaration.' );
				var parts, statement, tag, val;
				if ( re_one_liner_test.test( str ) ) { // 1st re_one_liner_simple used to be re_one_liner, but fails in V8!!!
					parts = contains( str, '|' ) ? ( str.match( re_one_liner_simple ) || dummy_arr ).filter( not_empty ) : str.match( re_one_liner_simple );
				}

				if ( !parts || parts.length <= 2 ) { return internals.wrap( internals.formatstatement( ctx, str ) ); }
				parts.shift(); // the original string

				val = internals.formatstatement( ctx, parts.shift() );
				tag = getStatement( parts.shift().toLowerCase() );
				statement = parts.join( ' ' );

				if ( !tag || !statement ) {
					throw new SyntaxError( 'Templ8 missing tag or statement in one liner value declaration.' );
				}

				return tag( internals, ctx, statement, tpl_parts ) + internals.wrap( val ) + getStatement( 'endif' );
			}
		}, {
			start : '{%', end : '%}',
			emit  : function( internals, ctx, str, tpl_parts ) {
				if ( str == '' ) { throw new SyntaxError( 'Templ8 missing key in statement declaration.' ); }

				var parts, statement, tag;

				if ( !( tag = getStatement( str.toLowerCase() ) ) ) {
					parts = str.split( ' ' );
					tag = getStatement( parts.shift().toLowerCase() );

					if ( parts.length == 0 && typeof tag == STR ) { return tag; }

					statement = parts.join( ' ' );

					if ( !tag || !statement ) { throw new SyntaxError( 'Templ8 missing tag or statement in statement declaration.' ); }
				}

				if ( !tag ) { throw new SyntaxError( format( 'Templ8 tag: {0} does not exist.', tag ) ); }

				return typeof tag == FUN ? tag( internals, ctx, statement, tpl_parts ) : tag;
			}
		}, {
			start : '{[', end : ']}',
			emit  : function( internals, ctx, str, tpl_parts ) {
				str = str.replace( re_comma_spacing, '$1' ).split( 'for each' );
				var expr, expr_type, iter, keys,
					statement = internals.clean( str.shift() ),
					parts = internals.clean( str.pop() ).match( re_comprehension_split );

				str = [];
				parts.shift(); // original s(tr)in(g)
				keys = parts.shift();
				iter = parts.shift();

				if ( parts.length >= 2 ) {
					expr_type = parts.shift();
					expr = parts.shift();
				}

				str.push( getStatement( 'for' )( internals, ctx, ( ( not_empty( keys ) ? keys.match( re_keys, '$1' ).join( ',' ) + ' in ' : '' ) + iter ), tpl_parts ) );
				if ( expr ) {
					str.push( getStatement( expr_type || 'if' )( internals, ctx, expr, tpl_parts ) );
				}
				str.push( internals.wrap( statement.split( ' ' ).map( function( s ) { return internals.formatstatement( ctx, s ); } ).join( ' ' ) ) );
				if ( expr ) { str.push( getStatement( 'endif' ) ); }
				str.push( getStatement( 'endfor' )( internals, ctx ) );

				return str.join( '' );
			}
		}, {
			start : '{:', end : ':}',
			emit  : function( internals, ctx, str ) { return internals.formatstatement( ctx, str ) + ';'; }
		}, {
			start : '{#', end : '#}',
			emit  : function( internals, ctx, str ) {
				return ['\n\/*', str, '*\/\n'].join( ' ' );
			}
		} ],
		dummy_arr              = [],
		getStatement           = TPL.Statement.get,
		re_comma_spacing       = /\s*(,)\s*/g,
		re_comprehension_split = /^\(\s*(.*?)(?:\bin\b){0,1}(.*?)\s*\)\s*(if|unless){0,1}\s*(.*)$/i,
		re_keys                = /(\w+)/g,
//		re_one_liner           = /^(\$_|[^\|]+(?:\|[^\|]+?){0,}|"[^"]+"|[\w\.\[\]"]+)(?:\s+(if|unless)\s+(.*)){0,1}$/i,
		re_one_liner_simple    = /^(.*?)\s+(if|unless)\s+(.*)|$/i,
		re_one_liner_test      = /\s+(if|unless)\s+/i;

	_tags.forEach( function( tag ) { TPL.Tag.create( tag, TRUE ); } );

	TPL.Tag.compileRegExp();


/* Statement.js */
( function() {
	var _statements = {
		'for'      : function( internals, ctx, statement ) {
			var count, iter, keys,
				parts = internals.clean( statement ).match( re_for_split ),
				start, str = [],
				undef = 'UNDEF',
				vars  = internals.fnvar;

			if ( parts === NULL ) { iter = statement; }
			else {
				parts.shift();
				count = parts.pop()   || UNDEF;
				start = parts.pop()   || UNDEF;
				iter  = parts.pop()   || parts.pop();
				keys  = ( parts.pop() || '' ).match( re_keys );
			}

			iter = internals.formatstatement( ctx, iter );

			str.push( format( ['\n\rif ( {0}.iterable( {1} ) ) iter = {2}.iter( {1}, iter, {3}, {4} );',
									'while ( iter.hasNext() ) {',
										'$_ = iter.current;',
										'$C.push( iter.current );\n\r' ].join( '\n\r' ),
						vars.assert, iter, vars.util, ( start || undef ), ( count || undef ) ) );

			if ( keys && keys.length > 0 ) {
				ctx.currentIterKeys.unshift( keys );
				if ( keys.length < 2 ) {
					str.push( format( 'var {0} = iter.current;\n\r', keys[0] ) );
				}
				else if ( keys.length >= 2 ) {
					str.push( format( 'var {0} = iter.key || iter.index, {1} = iter.current;\n\r', keys[0], keys[1] ) );
				}
			}

			return str.join( '' );
		},
		'forempty' : '\n\r}\n\rif ( iter.count <= 0 || !iter.items )\n\r{\n\r',
		'endfor'   : function( internals, ctx ) {
			ctx.currentIterKeys.shift();
			return format( ['\n\r$C.pop();',
			                '}',
			                'if ( $C.current() === iter.current ) { $C.pop(); }',
			                'iter = iter.parent || {0}.iter();',
			                '$_ = iter.current || $C.current();\n\r'].join( '\n\r' ), internals.fnvar.util );
		},
		'if'       : function( internals, ctx, statement ) { return format( 'if ( {0} ) { ',         formatStatement( ctx, internals.formatstatement, statement ) ); },
		'elseif'   : function( internals, ctx, statement ) { return format( ' } else if ( {0} ) { ', formatStatement( ctx, internals.formatstatement, statement ) ); },
		'else'     : ' } else { ',
		'endif'    : ' }',
		'sub'      : function( internals, ctx, statement, tpl_parts ) {
			var end = 'endsub', i, id = statement.trim(), parts, sub_tpl;

			i = tpl_parts.indexOf( [end, id].join( ' ' ) );
			i > -1 || ( i = tpl_parts.indexOf( end ) );

			parts = tpl_parts.splice( 0, i + 1 );
			parts.splice( parts.length - 2, parts.length );

			id = format( '{0}.{1}', ctx.id, id );

			sub_tpl = new TPL( '', TPL.copy( { debug : ctx.debug, fallback : ctx.fallback, id : id }, ctx.filters ) );
// the parts have already been split, for efficiency we can skip a call to createTemplate() and the more costly splitStr()
			sub_tpl.currentIterKeys = [];
			sub_tpl.__tpl = parts.join( '' );
			sub_tpl._parse = internals.compiletpl( sub_tpl, internals.assembleparts( sub_tpl, parts ) );
			delete sub_tpl.currentIterKeys;
			sub_tpl.compiled = TRUE;

			return '';
		},
		'unless' : function( internals, ctx, statement ) { return format( 'if ( !( {0} ) ) { ', formatStatement( ctx, internals.formatstatement, statement ) ); }
	},
	re_for_split = /^(\[[^,]+,\s*[^\]]+\]|[^\s]+)(?:\s+in\s+([^\s\[]+)){0,1}\s*(?:\[?(\d+)\.+(\d*)]*\]?){0,1}/i,
	re_keys      = /(\w+)/g;

	function formatStatement( ctx, fmt, stmt ) {
		return stmt.split( ' ' ).map( function( s ) { return fmt( ctx, s ); } ).join( ' ' );
	}

	TPL.Statement.add( _statements );
	TPL.Statement.add( 'elsif', _statements.elseif );
}() );


/* Filter.js */
	TPL.Filter.add( {
//		bold           : function( str ) { return format( '<strong>{0}</strong>', TPL.tostr( str ) ); },
		capitalize     : function( str ) {
			str = TPL.tostr( str );
			return str.charAt( 0 ).toUpperCase() + str.substring( 1 ).toLowerCase();
		},
		crop           : function( str, i ) {
			str = TPL.tostr( str );
			i = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i / 2 ) + '...' + str.substring( str.length - ( i / 2 ) ) : str;
		},
		def            : function( str, def ) { return ba.blank( str ) ? def : str; },
		first          : function( o ) {
			switch ( TPL.type( o ) ) {
				case ARR : return o[0];
				case STR : return o.charAt( 0 );
			}
		},
//		italics        : function( str ) { return format( '<em>{0}</em>', TPL.tostr( str ) ); },
		last           : function( o ) {
			switch ( TPL.type( o ) ) {
				case ARR : return o[o.length-1];
				case STR : return o.charAt( o.length - 1 );
			}
		},
//		linebreaks     : function( str ) { return TPL.tostr( str ).replace( /[\r\n]/gm, '<br />\n' ); },
//		link           : function( url, str ) {
//			str = typeof str == 'string' ? str : url;
//			return str.link( ( !!~url.indexOf( '@' ) ? 'mailto:' : '' ) + url );
//		},
//		log            : function() {
//			console.log( SLICE.call( arguments ) );
//			return '';
//		},
		lowercase      : function( str ) { return TPL.tostr( str ).toLowerCase(); },
//		paragraph      : function( str ) { return TPL.tostr( str ).replace( /([^\r\n]+)/gm, '<p>$1</p>' ); },
		prefix         : function( str1, str2 ) { return str2 + str1; },
//		stripe         : function( i ) { return parseInt( i, 10 ) & 1 ? 'stripe-odd' : 'stripe-even'; },
		suffix         : function( str1, str2 ) { return str1 + str2; },
		truncate       : function( str, i ) {
			str = TPL.tostr( str );
			i = parseInt( i, 10 ) || 50;
			return str.length > i ? str.substring( 0, i ) + '...' : str;
		},
		uppercase      : function( str ) { return TPL.tostr( str ).toUpperCase(); }//, 
//		wrap           : function( str, start, end ) { return start + str + ( end || start ); }
	} );

window.Templ8 = TPL;
}( window ) );