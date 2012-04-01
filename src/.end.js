
// if env === commonjs we want root to be global and we want to do it down here so we don't break anything up there
	typeof global == 'undefined' || ( root = global );
	Templ8.global =  root;
// expose Templ8
	( typeof module != 'undefined' && 'exports' in module ) ? ( module.exports = Templ8 ) : ( root.Templ8 = Templ8 );
// JavaScript Natives are exposed by default, as such we do not need to worry about adding them to module.exports
}( this );
