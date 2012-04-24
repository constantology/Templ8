!function(m8) {
    "use strict";
    var U, RESERVED = "__ASSERT__ __CONTEXT__ __FILTER_ __OUTPUT__ __UTIL__ $_ document false global instanceof null true typeof undefined window".split(" ").reduce(function(o, k) {
        o[k] = true;
        return o;
    }, m8.obj()), RE_GSUB = /\$?\{([^\}\s]+)\}/g, ba = {
        blank : function(o) {
            return m8.empty(o) || is_str(o) && !o.trim() || !re_not_blank.test(o);
        },
        contains : contains,
        endsWith : function(s, str) {
            s = String(s);
            var n = s.length - str.length;
            return n >= 0 && s.lastIndexOf(str) == n;
        },
        empty : m8.empty,
        equals : function(o, v) {
            return o == v;
        },
        exists : m8.exists,
        is : function(o, v) {
            return o === v;
        },
        isEven : function(i) {
            return !(parseInt(i, 10) & 1);
        },
        isOdd : function(i) {
            return !(parseInt(i, 10) & 1);
        },
        isTPL : function(id) {
            return !!(getTPL(format(tpl_sub, this.id, id)) || getTPL(id));
        },
        iterable : function(o) {
            return re_iterable.test(m8.type(o));
        },
        notEmpty : not_empty,
        startsWith : function(s, str) {
            return String(s).indexOf(str) === 0;
        }
    }, bf = {}, bu = {
        context : function(o, fb) {
            return new ContextStack(o, fb);
        },
        output : function(o) {
            return new Output(o);
        },
        iter : function(i, p, s, c) {
            return new Iter(i, p, s, c);
        },
        objectify : function(v, k) {
            var o = {};
            o[k] = v;
            return o;
        },
        parse : function(o, id, mixins) {
            id = String(id).trim();
            var t = getTPL(format(tpl_sub, this.id, id)) || getTPL(id);
            if (is_obj(o) && mixins !== this.__dict__) {
                switch (m8.type(mixins)) {
                  case "object":
                  case "nullobject":
                    break;
                  case false:
                    mixins = {};
                    break;
                  default:
                    mixins = {
                        __MIXINS__ : mixins
                    };
                }
                o = m8.copy(mixins, o, true);
            }
            return t ? t.parse(o) : this.fallback;
        },
        stop : function(iter) {
            iter.stop();
        },
        type : function(o) {
            return m8.type(o);
        }
    }, ck = "__tpl_cs_cached_keys", cs = "__tpl_cs_stack", defaults = [ "compiled", "debug", "fallback", "id" ], delim = "<~>", esc_chars = /([-\*\+\?\.\|\^\$\/\\\(\)[\]\{\}])/g, esc_val = "\\$1", fn_var = {
        assert : "__ASSERT__",
        dict : "__CONTEXT__",
        filter : "__FILTER__",
        output : "__OUTPUT__",
        util : "__UTIL__"
    }, fn_end = format('$C.destroy(); return {0}.join( "" );\n ', fn_var.output), fn_start = format("var $C = {0}.context( {1}, this.fallback ), $_ = $C.current(), iter = {0}.iter(), {2} = {0}.output(), U;", fn_var.util, fn_var.dict, fn_var.output), id_count = 999, internals, re_esc = /(['"])/g, re_format_delim = new RegExp(delim, "gm"), re_iterable = /array|htmlcollection|object|arguments|nodelist/, re_new_line = /[\r\n]+/g, re_not_blank = /\S/, re_special_char = /[\(\)\[\]\{\}\?\*\+\/<>%&=!-]/, re_statement_fix = /\.(\d+)(\.?)/g, re_statement_replacer = "['$1']$2", re_statement_split = new RegExp("\\s*([^\\|]+(?:\\|[^\\|]+?)){0,}" + delim, "g"), re_space = /\s+/g, re_split_tpl, split_token = "<__SPLIT__TEMPLATE__HERE__>", split_replace = [ "", "$1", "$2", "" ].join(split_token), tpl = {}, tpl_id = "t8-anon-{0}", tpl_statement = '{0}["{1}"].call( this, {2}{3}, {4} )', tpl_sub = "{0}.{1}";
    function contains(o, k) {
        return m8.nativeType(o.indexOf) == "function" ? !!~o.indexOf(k) : k in o;
    }
    function escapeRE(s) {
        return String(s).replace(esc_chars, esc_val);
    }
    function format(s) {
        return gsub(s, Array.coerce(arguments, 1));
    }
    function getTPL(id) {
        return tpl[id] || null;
    }
    function gsub(s, o, pattern) {
        return String(s).replace(pattern || RE_GSUB, function(m, p) {
            return o[p] || "";
        });
    }
    function is_fn(o) {
        return typeof o == "function";
    }
    function is_obj(o) {
        return m8.nativeType(o) == "object";
    }
    function is_str(o) {
        return typeof o == "string";
    }
    function mapc(a, fn, ctx) {
        ctx || (ctx = a);
        return a.reduce(function(res, o, i) {
            var v = fn.call(ctx, o, i, a);
            ba.blank(v) || res.push(v);
            return res;
        }, []);
    }
    function not_empty(o) {
        return !m8.empty(o);
    }
    function ContextStack(o, fallback) {
        this[ck] = {};
        this[cs] = [ m8.global ];
        if (fallback !== U) {
            this.hasFallback = true;
            this.fallback = fallback;
        }
        if (ba.exists(o)) this.push(o);
    }
    ContextStack.prototype = {
        current : function() {
            return (this[cs][0] || {}).dict;
        },
        destroy : function() {
            this.destroyed = true;
            delete this[ck];
            delete this[cs];
            return this;
        },
        get : function(k) {
            var c = this[ck], i = -1, d, o, s = this[cs], l = s.length, v;
            while (++i < l) {
                o = s[i];
                d = o.dict;
                if (k in c && d === c[k].o) return c[k].v;
                if ((v = Object.value(d, k)) !== U) {
                    c[k] = {
                        o : d,
                        v : v
                    };
                    o[ck].push(k);
                    return c[k].v;
                }
            }
            return this.hasFallback ? this.fallback : U;
        },
        pop : function() {
            return this[cs].shift();
        },
        push : function(v) {
            var o = {
                dict : v
            };
            o[ck] = [];
            this[cs].unshift(o);
            return this;
        }
    };
    function Iter(iter, parent, start, count) {
        if (!iter) return this;
        start = start === U ? -1 : start - 2;
        count = count === U ? 0 : count;
        this.index = start;
        this.index1 = start + 1;
        this.items = ba.iterable(iter) ? iter : null;
        this.type = m8.nativeType(iter);
        if (this.type == "object") {
            this.items = Object.values(iter);
            this.keys = Object.keys(iter);
            this.firstKey = this.keys[0];
            this.lastKey = this.keys[this.keys.length - 1];
        }
        if (this.items) {
            this.count = count ? count : this.items.length;
            this.first = this.items[0];
            this.last = this.items[this.count - 1];
        }
        if (parent.items != U) this.parent = parent;
    }
    Iter.prototype = {
        hasNext : function() {
            if (this.stopped || isNaN(this.index) || !this.items || ++this.index >= this.count) return false;
            if (this.index >= this.count - 1) this.isLast = true;
            this.current = this.items[this.index];
            this.previous = this.items[this.index - 1] || U;
            this.next = this.items[++this.index1] || U;
            if (this.type == "object") {
                this.key = this.keys[this.index];
                this.previousKey = this.keys[this.index - 1] || U;
                this.nextKey = this.keys[this.index1] || U;
            }
            return this;
        },
        stop : function() {
            this.stopped = true;
            return this;
        }
    };
    function Output(o) {
        this.__data = m8.nativeType(o) == "array" ? o : [];
    }
    Output.prototype = {
        join : function() {
            return this.__data.join("");
        },
        push : function(o) {
            this.__data.push(stringify(o));
            return this;
        }
    };
    function aggregatetNonEmpty(res, str) {
        !not_empty(str) || res.push(str);
        return res;
    }
    function aggregateStatement(ctx, s) {
        return s.reduce(function(res, v, i, parts) {
            if (i == 0) return wrapGetter(ctx, v);
            var args = "", fn, j = v.indexOf(":");
            if (!!~j) {
                fn = v.substring(0, j);
                args = v.substring(j + 1);
            } else fn = v;
            !args || (args = ", " + args.split(",").map(function(o) {
                return wrapGetter(this, o);
            }, ctx).join(", "));
            return format(tpl_statement, getFnParent(fn), fn, wrapGetter(ctx, res), args, fn_var.dict);
        }, "");
    }
    function assembleParts(ctx, parts) {
        var fn = [ fn_start ], part;
        while (part = parts.shift()) fn.push(emitTag(ctx, part, parts));
        fn.push(fn_end);
        return fn.join("\r\n");
    }
    function clean(str) {
        return str.replace(re_format_delim, "").replace(re_new_line, "\n").replace(re_space, " ").trim();
    }
    function compileTemplate(ctx, fn) {
        if (ctx.debug && typeof console != "undefined") {
            console.info("Templ8: ", ctx.id, ", source: ");
            console.log(fn);
        }
        var func = new Function("root", fn_var.filter, fn_var.assert, fn_var.util, fn_var.dict, fn);
        return func.bind(ctx, m8.global, m8.copy(ctx.filters, Templ8.Filter.all(), true), ba, bu);
    }
    function createTemplate(ctx) {
        ctx.currentIterKeys = [];
        var fn = compileTemplate(ctx, assembleParts(ctx, splitStr(ctx.__tpl__)));
        delete ctx.currentIterKeys;
        return fn;
    }
    function emitTag(ctx, part, parts) {
        var tag;
        if (tag = Templ8.Tag.get(part)) {
            part = parts.shift();
            return tag.emit(internals, ctx, part, parts);
        }
        return wrapStr(format('"{0}"', part.replace(re_esc, "\\$1")));
    }
    function formatStatement(ctx, str) {
        str = clean(str);
        switch (str) {
          case "AND":
            return " && ";
          case "OR":
            return " || ";
        }
        return contains(str, "|") || contains(str, delim) ? (" " + str + delim).replace(re_statement_split, function(m) {
            return ba.blank(m) || m == delim ? "" : aggregateStatement(ctx, clean(m).split("|"));
        }) : wrapGetter(ctx, str);
    }
    function getFnParent(fn) {
        return ba[fn] ? fn_var.assert : bu[fn] ? fn_var.util : fn_var.filter;
    }
    function splitStr(str) {
        return str.replace(re_split_tpl, split_replace).split(split_token).reduce(aggregatetNonEmpty, []);
    }
    function stringify(o, str) {
        switch (m8.type(o)) {
          case "boolean":
          case "number":
          case "string":
            return String(o);
          case "date":
            return o.toDateString();
          case "array":
            return mapc(o, stringify).join(", ");
          case "nullobject":
          case "object":
            return ck in o ? stringify(o.dict) : (str = o.toString()) != "[object Object]" ? str : mapc(Object.values(o), stringify).join(", ");
          case "htmlelement":
            return o.textContent || o.text || o.innerText;
          case "htmlcollection":
            return mapc(Array.coerce(o), function(el) {
                return stringify(el);
            }).join(", ");
        }
        return "";
    }
    function usingIterKey(key) {
        return this == key || ba.startsWith(this, key + ".");
    }
    function usingIterKeys(keys, o) {
        return keys.length ? keys.some(function(k) {
            return k.some(usingIterKey, o);
        }) : 0;
    }
    function wrapGetter(ctx, o) {
        var k = ctx.currentIterKeys || [];
        o = clean(o);
        return contains(o, ".call(") || re_special_char.test(o) || ba.startsWith(o, '"') && ba.endsWith(o, '"') || ba.startsWith(o, "'") && ba.endsWith(o, "'") || !isNaN(o) ? o : ba.startsWith(o, "$_.") || ba.startsWith(o, "iter.") || k.length && usingIterKeys(k, o) || o in RESERVED ? o.replace(re_statement_fix, re_statement_replacer) : format('$C.get( "{0}" )', o);
    }
    function wrapStr(str) {
        return format("{0}.push( {1} );", fn_var.output, str.replace(/[\n\r]/gm, "\\n"));
    }
    internals = {
        assembleparts : assembleParts,
        clean : clean,
        compiletpl : compileTemplate,
        createtpl : createTemplate,
        emittag : emitTag,
        fnvar : fn_var,
        formatstatement : formatStatement,
        get : wrapGetter,
        util : bu,
        wrap : wrapStr
    };
    function Templ8() {
        var a = Array.coerce(arguments), f = is_obj(a[a.length - 1]) ? a.pop() : is_obj(a[0]) ? a.shift() : null;
        if (!(this instanceof Templ8)) return is_obj(f) ? new Templ8(a.join(""), f) : new Templ8(a.join(""));
        !f || defaults.forEach(function(k) {
            if (k in f) {
                this[k] = f[k];
                delete f[k];
            }
        }, this);
        this.filters = f || {};
        this.__tpl__ = a.join("");
        tpl[$id(this)] = this;
        if (this.compiled) {
            this.compiled = false;
            compile(this);
        }
    }
    function $id(ctx) {
        ctx.id || (ctx.id = format(tpl_id, ++id_count));
        return ctx.id;
    }
    function compile(ctx) {
        if (!ctx.compiled) {
            ctx.compiled = true;
            ctx._parse = createTemplate(ctx);
        }
        return ctx;
    }
    function parse(dict) {
        this.compiled || compile(this);
        this.__dict__ = dict;
        var s = this._parse(dict);
        delete this.__dict__;
        return s;
    }
    Templ8.prototype = {
        compiled : false,
        debug : false,
        fallback : "",
        parse : parse
    };
    m8.defs(Templ8, {
        escapeRE : escapeRE,
        format : format,
        get : getTPL,
        gsub : gsub,
        stringify : stringify
    }, "r");
    function Mgr(o) {
        var cache = {};
        !is_obj(o) || m8.copy(cache, o);
        function _add(id, fn, replace) {
            !replace && id in cache || (cache[id] = fn);
        }
        function add(replace, o) {
            switch (typeof o) {
              case "string":
                _add(o, arguments[2], replace);
                break;
              case "object":
                for (var k in o) _add(k, o[k], replace);
                break;
            }
            return this;
        }
        this.all = function() {
            return m8.copy(cache);
        };
        this.add = function() {
            return add.call(this, false, arguments[0], arguments[1]);
        };
        this.get = function(id) {
            return cache[id];
        };
        this.replace = function() {
            return add.call(this, true, arguments[0], arguments[1]);
        };
    }
    Templ8.Assert = new Mgr(ba);
    Templ8.Filter = new Mgr(bf);
    Templ8.Statement = new Mgr;
    Templ8.Tag = new function() {
        var KEYS = "emit end start".split(" "), ERRORS = {
            emit : "emit function",
            end : "end tag definition",
            start : "start tag definition"
        }, tag = {};
        function Tag(config) {
            KEYS.forEach(assert_exists, config);
            m8.copy(this, config);
            tag[this.start] = this;
        }
        function assert_exists(k) {
            if (!(k in this)) {
                throw new TypeError(format("A Templ8 Tag requires an {0}", ERRORS[k]));
            }
        }
        this.all = function() {
            return m8.copy(tag);
        };
        this.compileRegExp = function() {
            var end = [], start = [], t;
            for (t in tag) {
                end.push(escapeRE(tag[t].end.substring(0, 1)));
                start.push(escapeRE(tag[t].start.substring(1)));
            }
            return re_split_tpl = new RegExp("(\\{[" + start.join("") + "])\\s*(.+?)\\s*([" + end.join("") + "]\\})", "gm");
        };
        this.create = function(o, dont_compile) {
            new Tag(o);
            dont_compile === true || this.compileRegExp();
            return this;
        };
        this.get = function(id) {
            return tag[id];
        };
    };
    var _tags = [ {
        start : "{{",
        end : "}}",
        emit : function(internals, ctx, str, tpl_parts) {
            var parts, statement, tag, val;
            if (str == "") throw new SyntaxError("Templ8 missing key in value declaration.");
            !re_one_liner_test.test(str) || (parts = contains(str, "|") ? (str.match(re_one_liner_simple) || dummy_arr).filter(not_empty) : str.match(re_one_liner_simple));
            if (!parts || parts.length <= 2) return internals.wrap(internals.formatstatement(ctx, str));
            parts.shift();
            val = internals.formatstatement(ctx, parts.shift());
            tag = getStatement(parts.shift().toLowerCase());
            statement = parts.join(" ");
            if (!tag || !statement) throw new SyntaxError("Templ8 missing tag or statement in one liner value declaration.");
            return tag(internals, ctx, statement, tpl_parts) + internals.wrap(val) + getStatement("endif");
        }
    }, {
        start : "{%",
        end : "%}",
        emit : function(internals, ctx, str, tpl_parts) {
            if (str == "") throw new SyntaxError("Templ8 missing key in statement declaration.");
            var parts, statement, tag;
            if (!(tag = getStatement(str.toLowerCase()))) {
                parts = str.split(" ");
                tag = getStatement(parts.shift().toLowerCase());
                if (parts.length == 0 && is_str(tag)) return tag;
                statement = parts.join(" ");
                if (!tag || !statement) throw new SyntaxError("Templ8 missing tag or statement in statement declaration.");
            }
            if (!tag) throw new SyntaxError(format("Templ8 tag: {0} does not exist.", tag));
            return is_fn(tag) ? tag(internals, ctx, statement, tpl_parts) : tag;
        }
    }, {
        start : "{[",
        end : "]}",
        emit : function(internals, ctx, str, tpl_parts) {
            str = str.replace(re_comma_spacing, "$1").split("for each");
            var expr, expr_type, iter, keys, statement = internals.clean(str.shift()), parts = internals.clean(str.pop()).match(re_comprehension_split);
            str = [];
            parts.shift();
            keys = parts.shift();
            iter = parts.shift();
            if (parts.length >= 2) {
                expr_type = parts.shift();
                expr = parts.shift();
            }
            str.push(getStatement("for")(internals, ctx, (not_empty(keys) ? keys.match(re_keys, "$1").join(",") + " in " : "") + iter, tpl_parts));
            !expr || str.push(getStatement(expr_type || "if")(internals, ctx, expr, tpl_parts));
            str.push(internals.wrap(statement.split(" ").map(function(s) {
                return internals.formatstatement(ctx, s);
            }).join(" ")));
            !expr || str.push(getStatement("endif"));
            str.push(getStatement("endfor")(internals, ctx));
            return str.join("");
        }
    }, {
        start : "{:",
        end : ":}",
        emit : function(internals, ctx, str) {
            return internals.formatstatement(ctx, str) + ";";
        }
    }, {
        start : "{#",
        end : "#}",
        emit : function(internals, ctx, str) {
            return [ "\n/*", str, "*/\n" ].join(" ");
        }
    } ], dummy_arr = [], getStatement = Templ8.Statement.get, re_comma_spacing = /\s*(,)\s*/g, re_comprehension_split = /^\(\s*(.*?)(?:\bin\b){0,1}(.*?)\s*\)\s*(if|unless){0,1}\s*(.*)$/i, re_keys = /(\w+)/g, re_one_liner_simple = /^(.*?)\s+(if|unless)\s+(.*)|$/i, re_one_liner_test = /\s+(if|unless)\s+/i;
    _tags.forEach(function(tag) {
        Templ8.Tag.create(tag, true);
    });
    Templ8.Tag.compileRegExp();
    (function() {
        var _statements = {
            "for" : function(internals, ctx, statement) {
                var count, iter, keys, parts = internals.clean(statement).match(re_for_split), start, str = [], undef = "U", vars = internals.fnvar;
                if (parts === null) {
                    iter = statement;
                } else {
                    parts.shift();
                    count = parts.pop() || U;
                    start = parts.pop() || U;
                    iter = parts.pop() || parts.pop();
                    keys = (parts.pop() || "").match(re_keys);
                }
                iter = internals.formatstatement(ctx, iter);
                str.push(format([ "\n\rif ( {0}.iterable( {1} ) ) iter = {2}.iter( {1}, iter, {3}, {4} );", "while ( iter.hasNext() ) {", "$_ = iter.current;", "$C.push( iter.current );\n\r" ].join("\n\r"), vars.assert, iter, vars.util, start || undef, count || undef));
                if (keys && keys.length > 0) {
                    ctx.currentIterKeys.unshift(keys);
                    if (keys.length < 2) str.push(format("var {0} = iter.current;\n\r", keys[0])); else if (keys.length >= 2) str.push(format("var {0} = iter.key || iter.index, {1} = iter.current;\n\r", keys[0], keys[1]));
                }
                return str.join("");
            },
            forempty : "\n\r}\n\rif ( iter.count <= 0 || !iter.items )\n\r{\n\r",
            endfor : function(internals, ctx) {
                ctx.currentIterKeys.shift();
                return format([ "\n\r$C.pop();", "}", "if ( $C.current() === iter.current ) { $C.pop(); }", "iter = iter.parent || {0}.iter();", "$_ = iter.current || $C.current();\n\r" ].join("\n\r"), internals.fnvar.util);
            },
            "if" : function(internals, ctx, statement) {
                return format("if ( {0} ) { ", formatStatement(ctx, internals.formatstatement, statement));
            },
            elseif : function(internals, ctx, statement) {
                return format(" } else if ( {0} ) { ", formatStatement(ctx, internals.formatstatement, statement));
            },
            "else" : " } else { ",
            endif : " }",
            sub : function(internals, ctx, statement, tpl_parts) {
                var end = "endsub", i, id = statement.trim(), parts, sub_tpl;
                i = tpl_parts.indexOf([ end, id ].join(" "));
                i > -1 || (i = tpl_parts.indexOf(end));
                parts = tpl_parts.splice(0, i + 1);
                parts.splice(parts.length - 2, parts.length);
                id = format("{0}.{1}", ctx.id, id);
                sub_tpl = new Templ8("", m8.copy({
                    debug : ctx.debug,
                    fallback : ctx.fallback,
                    id : id
                }, ctx.filters));
                sub_tpl.currentIterKeys = [];
                sub_tpl.__tpl__ = parts.join("");
                sub_tpl._parse = internals.compiletpl(sub_tpl, internals.assembleparts(sub_tpl, parts));
                delete sub_tpl.currentIterKeys;
                sub_tpl.compiled = true;
                return "";
            },
            unless : function(internals, ctx, statement) {
                return format("if ( !( {0} ) ) { ", formatStatement(ctx, internals.formatstatement, statement));
            }
        }, re_for_split = /^(\[[^,]+,\s*[^\]]+\]|[^\s]+)(?:\s+in\s+([^\s\[]+)){0,1}\s*(?:\[?(\d+)\.+(\d*)]*\]?){0,1}/i, re_keys = /(\w+)/g;
        function formatStatement(ctx, fmt, stmt) {
            return stmt.split(" ").map(function(s) {
                return fmt(ctx, s);
            }).join(" ");
        }
        Templ8.Statement.add(_statements);
        Templ8.Statement.add("elsif", _statements.elseif);
    })();
    Templ8.Filter.add({
        capitalize : function(str) {
            str = Templ8.stringify(str);
            return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
        },
        count : function(o) {
            return m8.len(o) || 0;
        },
        crop : function(str, i) {
            str = Templ8.stringify(str);
            i = parseInt(i, 10) || 50;
            return str.length > i ? str.substring(0, i / 2) + "..." + str.substring(str.length - i / 2) : str;
        },
        def : function(str, def) {
            return ba.blank(str) ? def : str;
        },
        first : function(o) {
            switch (m8.nativeType(o)) {
              case "array":
                return o[0];
              case "string":
                return o.charAt(0);
            }
        },
        join : function(o, s) {
            return m8.got(o, "join") && typeof o.join == "function" ? o.join(s) : o;
        },
        last : function(o) {
            switch (m8.nativeType(o)) {
              case "array":
                return o[o.length - 1];
              case "string":
                return o.charAt(o.length - 1);
            }
        },
        lowercase : function(str) {
            return Templ8.stringify(str).toLowerCase();
        },
        prefix : function(str1, str2) {
            return str2 + str1;
        },
        suffix : function(str1, str2) {
            return str1 + str2;
        },
        truncate : function(str, i) {
            str = Templ8.stringify(str);
            i = parseInt(i, 10) || 50;
            return str.length > i ? str.substring(0, i) + "..." : str;
        },
        uppercase : function(str) {
            return Templ8.stringify(str).toUpperCase();
        },
        wrap : function(str, start, end) {
            return start + str + (end || start);
        }
    });
    m8.def(Templ8, "m8", m8.describe({
        value : m8
    }, "r"));
    m8.ENV != "commonjs" ? m8.def(m8.global, "Templ8", m8.describe({
        value : Templ8
    }, "r")) : module.exports = Templ8;
}(typeof m8 != "undefined" ? m8 : typeof require != "undefined" ? require("m8") : null);