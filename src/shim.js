	Templ8.type = function( o ) {
		if ( o === U || o === N ) return F;

		var HTMDOC = 'htmldocument',
			t = tostr.call( o ).split( ' ' )[1].toLowerCase();

		t = t.substring( 0, t.length - 1 );

		switch ( t ) {
			case OBJ      :
				if ( root.attachEvent ) { // handle IE coz it can has stupidz
					return o.nodeName && o.nodeType == 1
						 ? HTMEL  : !isNaN( o.length ) && is_fn( o.item )
						 ? HTMCOL : o === root.document
						 ? HTMDOC : o === root
						 ? GLOBAL : t;
				}
				return t;
			case NODELIST : return HTMLCOL; // normalise: webkit returns nodelist, FF returns htmlcollection
			default       : // this will be something like htmlwindowelement, htmldocumentelement, ..., htmldivelement
				if ( !!~t.indexOf( 'html' ) ) return !!~t.indexOf( HTMDOC ) ? HTMDOC : re_global.test( t ) ? GLOBAL : HTMEL;
		}

		return t;
	};
