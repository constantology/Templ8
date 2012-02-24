
// if env === nodejs we want root to be global and we want to do it down here so we don't break anything up there
	typeof global == UNDEF || ( root = global );
// expose thud for use in commonjs modules
	if ( typeof module != UNDEF && 'exports' in module ) module.exports = Templ8;
	else root.Templ8 = Templ8;
// JavaScript Natives are exposed by default, as such we do not need to worry about adding them to module.exports
}( this );
