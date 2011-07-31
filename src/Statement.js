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
