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
