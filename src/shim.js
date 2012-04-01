     typeof document == 'undefined'
||   Templ8.tostr( document.createElement( 'div' ) ) == '[object HTMLDivElement]'
|| ( Templ8.type = function() {
	var U; return function type( o ) {
		if ( o === U || o === null ) return !1;
		var t = Templ8.tostr.call( o ).split( ' ' )[1].toLowerCase();
			t = t.substring( 0, t.length - 1 );
		switch ( t ) {
			case 'object'   :
				if ( root.attachEvent ) {              // handle IE coz it can has stupidz
					return o.nodeName && o.nodeType == 1
						 ? 'htmlelement'    : !isNaN( o.length ) && is_fn( o.item )
						 ? 'htmlcollection' : o === root.document
						 ? 'htmldocument'   : o === root
						 ? 'global'         : t;
				}
				return t;
			case 'nodelist' : return 'htmlcollection'; // normalise: webkit returns nodelist, FF returns htmlcollection
			default         :                          // this will be something like htmlwindowelement, htmldocumentelement, ..., htmldivelement
				if ( !!~t.indexOf( 'html' ) ) return !!~t.indexOf( 'htmldocument' ) ? 'htmldocument' : re_global.test( t ) ? 'global' : 'htmlelement';
		}
		return t;
	};
}() );
