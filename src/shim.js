     typeof document == 'undefined'
||   util.tostr( document.createElement( 'div' ) ) == '[object HTMLDivElement]'
|| ( __Class__.type = function() {
	var U, re_global = /global|window/;
	return function type( o ) {
		if ( o === U || o === null ) return !1;
		var t = util.tostr( o ).split( ' ' )[1].toLowerCase();
			t = t.substring( 0, t.length - 1 );
		switch ( t ) {
			case 'object'   :
				if ( util.global.attachEvent ) {              // handle IE coz it can has stupidz
					return o.nodeName && o.nodeType == 1
						 ? 'htmlelement'    : !isNaN( o.length ) && is_fn( o.item )
						 ? 'htmlcollection' : o === util.global.document
						 ? 'htmldocument'   : o === util.global
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
