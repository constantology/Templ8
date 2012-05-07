	var U, RESERVED = '__ASSERT__ __CONTEXT__ __FILTER_ __OUTPUT__ __UTIL__ $_ document false global instanceof null true typeof undefined window'.split( ' ' ).reduce( function( o, k ) {
			o[k] = true; return o;
		}, m8.obj() ),
		RE_GSUB     = /\$?\{([^\}\s]+)\}/g,
		ba          = {
			blank      : function( o ) { return m8.empty( o ) || ( typeof o == 'string' && !o.trim() ); },
			contains   : contains,
			endsWith   : function( s, str ) {
				s = String( s );
				var n = s.length - str.length;
				return n >= 0 && s.lastIndexOf( str ) == n;
			},
			empty      : m8.empty,
			equals     : function( o, v )   { return o == v },
			exists     : m8.exists,
			is         : function( o, v )   { return o === v },
			isEven     : function( i )      { return  !( parseInt( i, 10 ) & 1 ); },
			isOdd      : function( i )      { return  !( parseInt( i, 10 ) & 1 ); },
			isTPL      : function( id )     { return !!( getTPL( format( tpl_sub, this.id, id ) ) || getTPL( id ) ); },
			iterable   : function( o )      { return m8.iter( o ); },
			notEmpty   : not_empty,
			startsWith : function( s, str ) { return String( s ).indexOf( str ) === 0; }
		},
		bf = {}, bu = {
			context    : function( o, fb )      { return new ContextStack( o, fb ); },
			output     : function( o )          { return new Output( o ); },
			objectify  : function( v, k )       { var o = {}; o[k] = v; return o; },
			parse      : function( o, id, mixins ) {
				id    = String( id ).trim();
				var t = getTPL( format( tpl_sub, this.id, id ) ) || getTPL( id );

				if ( is_obj( o ) && mixins !== this.__dict__ ) {
					switch( m8.nativeType( mixins ) ) {
						case 'object' :                                 break;
						case 'null'   : case 'undefined' : mixins = {}; break;
						default       : mixins = { __MIXINS__ : mixins };
					}
					o = m8.copy( mixins, o, true );
				}

				return t ? t.parse( o ) : this.fallback;
			},
			stop       : function( iter ) { iter.stop(); },
			stringify  : stringify,
			type       : function( o )    { return m8.type( o ); }
		},
		cache_key = '__tpl_cs_cached_keys',                  cache_stack = '__tpl_cs_stack',
		defaults  = ['compiled', 'debug', 'fallback', 'id'], delim       = '<~>',
		esc_chars = /([-\*\+\?\.\|\^\$\/\\\(\)[\]\{\}])/g,   esc_val     = '\\$1',

		fn_var    = { assert : '__ASSERT__', dict : '__CONTEXT__', filter : '__FILTER__', output : '__OUTPUT__', util : '__UTIL__' },
		fn_end    = format( '$C.destroy(); return {0};\n ', fn_var.output ),
		fn_start  = '\n"use strict";\n' + format( 'var $C = new ContextStack( {0}, this.fallback ), $_ = $C.current(), iter = new Iter( null ), {1} = "", U;', fn_var.dict, fn_var.output ),

		id_count  = 999, internals, logger = 'console', // <= gets around jsLint

		re_br              = /[\n\r]/gm,
		re_esc             = /(['"])/g,                       re_format_delim       = new RegExp( delim, 'gm' ),
		re_new_line        = /[\r\n]+/g,                      re_space              = /\s+/g,
		re_special_char    = /[\(\)\[\]\{\}\?\*\+\/<>%&=!-]/, re_split_tpl,
		re_statement_fix   = /\.(\d+)(\.?)/g,                 re_statement_replacer = '[\'$1\']$2',
		re_statement_split = new RegExp( '\\s*([^\\|]+(?:\\|[^\\|]+?)){0,}' + delim, 'g' ),

		split_token        = '<__SPLIT__TEMPL8__HERE__>',     split_replace         = ['', '$1', '$2', ''].join( split_token ),

		tpl = {}, tpl_id = 't8-anon-{0}', tpl_statement = '{0}["{1}"].call( this, {2}{3}, {4} )', tpl_sub = '{0}.{1}';

/*** START: Utility Functions ***/
	function contains( o, k ) { return ( typeof o.indexOf == 'function' && !!~o.indexOf( k ) ) || m8.got( o, k ) ; }

	function escapeRE( s ) { return String( s ).replace( esc_chars, esc_val ); }

	function format( s ) { return gsub( s, Array.coerce( arguments, 1 ) ); }

	function getTPL( id ) { return tpl[id] || null; }

	function gsub( s, o, pattern ) { return String( s ).replace( ( pattern || RE_GSUB ), function( m, p ) { return o[p] || ''; } ); }

	function is_obj( o ) { return typeof o == 'object' && ( o.constructor === Object || o.constructor === U ); }

	function mapc( a, fn, ctx ) {
		fn || ( fn = m8 ); ctx || ( ctx = a );
		var i = -1, l = a.length, res = [], v;
		while ( ++i < l ) {
			v = fn.call( ctx, a[i], i, a );
			switch ( v ) {
				case null : case U : break;
				default   : switch ( typeof v ) {
					case 'string' : v.trim() === '' || res.push( v ); break;
					case 'number' : isNaN( v )      || res.push( v ); break;
					default       : ( !m8.iter( v ) || m8.len( v ) ) || res.push( v ); break;
				}
			}
		}
		return res;
	}
	
	function not_empty( o ) { return !m8.empty( o ); }
/*** END:   Utility Functions ***/

/*** START: Classes used by compiled templates ***/
	function ContextStack( dict, fallback ) {
		this[cache_stack] = [];
		this.push( m8.global );
		if ( fallback !== U ) {
			this.hasFallback = true;
			this.fallback    = fallback;
		}
		!m8.exists( dict ) || this.push( dict );
	}
	ContextStack.prototype = {
		current : function ContextStack_current() { return this.top.dict; },
		destroy : function ContextStack_destroy() {
			this.destroyed = true;
			delete this[cache_key]; delete this[cache_stack];
			return this;
		},
		get     : function ContextStack_get( key ) {
			var ctx, stack = this[cache_stack], l = stack.length, val;
			while ( l-- ) {
				ctx = stack[l];
				if ( key in ctx.cache ) return ctx.cache[key];
				if ( ( val = Object.value( ctx.dict, key ) ) !== U )
					return ctx.cache[key] = val;
			}
			return this.hasFallback ? this.fallback : U;
		},
		pop     : function ContextStack_pop() {
			var dict = this[cache_stack].pop().dict;
			this.top = this[cache_stack][this[cache_stack].length - 1];
			return dict;
		},
		push    : function ContextStack_push( dict ) {
			this[cache_stack].push( this.top = { cache : {}, dict : dict } );
			return this;
		}
	};

	function Iter( iter, parent, start, count ) {
		var keys, len;
		if ( iter === null || !m8.iter( iter ) ) return this.stop();

		this._ = iter  = Object( iter );
		         keys  = Object.keys( iter );
		if ( !( len    = keys.length ) ) return this.stop();

		m8.nativeType( iter ) == 'object' || ( keys = keys.map( Number ) );
		this.empty     = false;

		this.count     = isNaN( count ) ? len : count < 0 ? len + count : count > len ? len : count;
		this.index     = start === U ? -1 : start - 2;
		this.index1    = this.index + 1;

		this.firstKey  = keys[0];
		this.first     = iter[this.firstKey];

		this.lastIndex = this.count - 1;
		this.lastKey   = keys[this.lastIndex];
		this.last      = iter[this.lastKey];

		this.keys      = keys;

		!( parent instanceof Iter ) || ( this.parent = parent );
	}

	Iter.prototype = {
		empty   : true,

		hasNext : function Iter_hasNext() {
			if ( this.stopped || this.empty ) return false;

			++this.index < this.lastIndex || ( this.stop().isLast = true );

			this.key         = this.keys[this.index];
			this.nextKey     = this.keys[++this.index1]  || U;
			this.previousKey = this.keys[this.index - 1] || U;

			this.current     = this._[this.key];
			this.next        = this._[this.nextKey]      || U;
			this.previous    = this._[this.previousKey]  || U;

			return this;
		},
		stop    : function Iter_stop() {
			this.stopped = true;
			return this;
		}
	};

/*** END:   Classes used by compiled templates ***/

/*** START: create template methods ***/

	function aggregatetNonEmpty( res, str ) {
		m8.empty( str ) || res.push( str );
		return res;
	}

	function aggregateStatement( ctx, s ) {
		return s.reduce( function( res, v, i, parts ) {
			if ( i == 0 ) return wrapGetter( ctx, v );
			var args = '', fn, j = v.indexOf( ':' );
			if ( !!~j ) {
				fn   = v.substring( 0,  j );
				args = v.substring( j + 1 );
			}
			else fn = v;
			!args || ( args = ', ' + args.split( ',' ).map( function( o ) { return wrapGetter( this, o ); }, ctx ).join( ', ' ) );
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
		if ( ctx.debug && typeof m8.global[logger] != 'undefined' ) {
			m8.global[logger].info( 'Templ8: ', ctx.id, ', source: ' ); m8.global[logger].log( fn );
		}
		var func = new Function( 'root', 'ContextStack', 'Iter', fn_var.filter, fn_var.assert, fn_var.util, fn_var.dict, fn );
		return func.bind( ctx, m8.global, ContextStack, Iter, m8.copy( ctx.filters, Templ8.Filter.all(), true ), ba, bu );
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
		switch ( str ) {
			case 'AND' : return ' && ';
			case 'OR'  : return ' || ';
		}
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
		switch ( typeof o ) {
			case 'boolean' : case 'number' : case 'string' : return String( o );
			default        : switch ( m8.nativeType( o ) ) {
				case 'date'   : return o.toDateString();
				case 'array'  : return mapc( o, stringify ).join( ', ' );
				case 'object' : return cache_key in o
							  ? stringify( o.dict ) : ( ( str = o.toString() ) != '[object Object]' )
							  ? str : mapc( Object.values( o ), stringify ).join( ', ' );
				default       : switch ( m8.type( o ) ) { // todo: should this return outerHTML instead? might be nicer
					case 'htmlelement'    : return o.textContent || o.text || o.innerText;
					case 'htmlcollection' : return mapc( Array.coerce( o ), function( el ) { return stringify( el ); } ).join( ', ' );
				}
			}
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

	function wrapStr( str ) { return format( '{0} += {1};', fn_var.output, str.replace( re_br, '\\n' ) ); }

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
		var a = Array.coerce( arguments ),
			f = is_obj( a[a.length - 1] ) ? a.pop() : is_obj( a[0] ) ? a.shift() : null;

// take care of peeps who are too lazy or too ©ººL to use the "new" constructor...
		if ( !( this instanceof Templ8 ) ) return is_obj( f ) ? new Templ8( a.join( '' ), f ) : new Templ8( a.join( '' ) );
		
		!f || defaults.forEach( function( k ) {
			if ( k in f ) { this[k] = f[k]; delete f[k]; }
		}, this );

		this.filters = f || {};

		this.__tpl__ = a.join( '' );

		tpl[$id( this )] = this;

		if ( this.compiled ) {
			this.compiled = false;
			compile( this );
		}
	}

	function $id( ctx ) {
		ctx.id || ( ctx.id = format( tpl_id, ++id_count ) );
		return ctx.id;
	}

	function compile( ctx ) {
		if ( !ctx.compiled ) {
			ctx.compiled = true;
			ctx._parse = createTemplate( ctx );
		}
		return ctx;
	}

	function parse( dict ) {
		this.compiled || compile( this );
		this.__dict__ = dict;
		var s = this._parse( dict );
		delete this.__dict__;
		return s;
	}

	Templ8.prototype = {
		compiled : false, debug : false, fallback : '',
		parse    : parse
	};
/*** END:   Templ8 constructor and prototype ***/

/*** START: Templ8 functionality packages ***/
// exposed for general usage
	m8.defs( Templ8, {             // store a reference to m8 in Templ8 so we can do fun stuff in commonjs
		m8       : { value : m8 }, // modules without having to re-request m8 as well as Templ8 each time.
		escapeRE : escapeRE,  format    : format,    get : getTPL,
		gsub     : gsub,      stringify : stringify
	}, 'r' );

	function Mgr( o ) {
		var cache = {};

		!is_obj( o ) || m8.copy( cache, o );

		function _add( id, fn, replace ) { ( !replace && id in cache ) || ( cache[id] = fn ); }
		function  add( replace, o ) {
			switch( typeof o ) {
				case 'string' : _add( o, arguments[2], replace );            break;
				case 'object' : for ( var k in o ) _add( k, o[k], replace ); break;
			} return this;
		}

		this.all     = function()     { return m8.copy( cache ); };
		this.add     = function()     { return add.call( this, false, arguments[0], arguments[1] ); };
		this.get     = function( id ) { return cache[id]; };
		this.replace = function()     { return add.call( this, true, arguments[0], arguments[1] ); };
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
			m8.copy( this, config );
			tag[this.start] = this;
		}

		function assert_exists( k ) { if ( !( k in this ) ) { throw new TypeError( format( 'A Templ8 Tag requires an {0}', ERRORS[k] ) ); } }
		
		this.all = function() { return m8.copy( tag ); };

		this.compileRegExp = function() {
			var end = [], start = [], t;
			for ( t in tag ) {
				end.push( escapeRE( tag[t].end.substring( 0, 1 ) ) );
				start.push( escapeRE( tag[t].start.substring( 1 ) ) );
			}
			return ( re_split_tpl = new RegExp( '(\\{[' + start.join( '' ) + '])\\s*(.+?)\\s*([' + end.join( '' ) + ']\\})', 'gm' ) );
		};

		this.create = function( o, dont_compile ) {
			new Tag( o ); dont_compile === true || this.compileRegExp();
			return this;
		};

		this.get = function( id ) { return tag[id]; };
	};

/*** END:   Templ8 functionality packages ***/
