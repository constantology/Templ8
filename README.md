# Templ8.js [![build status](https://secure.travis-ci.org/constantology/Templ8.png)](http://travis-ci.org/constantology/Templ8)

Templ8 as you can probably guess is a JavaScript template engine, with a Django'ish style of syntax.

It's fast, light weight and unlike a lot of other JavaScript template engines: **Templ8 does not use the JavaScript `with` statement**. This actually makes Templ8 parse templates faster than it would if it did use the `with` statement!

Templ8 does not restrict you to generating HTML. All outputs are strings so if you want to generate HTML, CSS, JavaScript or whatever, the choice is yours...

#TODO:

- documentation is not yet complete

## Dependencies

Templ8.js only has one dependency [m8.js](/constantology/m8).

**NOTE:**
If you are using Templ8 within a commonjs module, you don't need to require m8 before requiring Templ8 as this is done internally and a reference to **m8** is available as: `Templ8.m8`.

```javascript

   var Templ8 = require( 'Templ8' ),
       m8     = Templ8.m8; // <= reference to m8

// if running in a sandboxed environment remember to:
   m8.x( Object, Array, Boolean, Function, String ); // and/ or any other Types that require extending.

```

See [m8: Extending into the future](/constantology/m8) for more information on working with sandboxed modules.

## Support

Tested to work with nodejs, FF4+, Safari 5+, Chrome 7+, IE9+. Should technically work in any browser that supports [ecma 5]( http://kangax.github.com/es5-compat-table/) without throwing any JavaScript errors.

## API

If all you want to do is swap out values you can use one of the following two smaller template functions.

#### &lt;static&gt; Templ8.format( template`:String`, param1`:String`[, param2`:String`, ..., paramN`:String`] )`:String`

This function takes a minimum of two parameters. The first is the template you want perform substitutions over.

The template should use zero based tokens, e.g. `{0}`, `{1}` ... `{N}` that increment for each argument passed to the function.

e.g.

```javascript
    Templ8.format( 'Hello {0}! Nice {1} we\'re having.', 'world', 'day' );
```

returns: *Hello world! Nice day we're having.*

---
&nbsp;
#### &lt;static&gt; Templ8.gsub( template`:String`, dict`:Object`[, pattern`:RegExp`] )`:String`

gsub works similarly to format only it takes an Object with the values you want to substitute, instead of a sequence of parameters. Actually format calls gsub internally.

e.g.

```javascript
    Templ8.gsub( 'Hello {name}! Nice {time} we\'re having.', { name : 'world', time : 'day' } );
```

returns: *Hello world! Nice day we're having.*

The default pattern for substitutions is `/\{([^\}]+)\}/g`. However, you can supply a third argument to *gsub* which is your own custom pattern to use instead of the default.

If you want to do fancy stuff, you'll want to use the Templ8 constructor.

---
&nbsp;
#### new Templ8( template`:String`, options`:Object` )

The Templ8 constructor actually takes an arbitrary number of String arguments which form the template body.

The last argument to the Templ8 can -- optionally -- be a configuration Object which defines any custom Filters you want to use for this Templ8 and any sub Templates it contains.

It also accepts the following four parameters (needless to say that these cannot be used as Filter names):

<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>compiled</strong></td><td>If this is set to <code>true</code> then the Templ8 will be compiled straight away, otherwise it will wait until the first time you call it's <code>parse()</code> method to compile. <strong>Default</strong> is <code>false</code>.</td>
</tr><tr>
	<td><strong>debug</strong></td><td>Useful for debugging. Set this to <code>true</code> to have the Templ8 method body logged to the console. <strong>Default</strong> is <code>false</code>.</td>
</tr><tr>
	<td><strong>fallback</strong></td><td>This is the String to use as a fallback value in case any values are not present when parsing a Templ8 instance. <strong>Default</strong> is <code>""</code>, Empty String.</td>
</tr><tr>
	<td><strong>id</strong></td><td>The ID of your Templ8. This is handy (and mandatory) if you want to use a Templ8 from within another Templ8. Otherwise an anonymous ID will be generated for your Templ8.</td>
</tr>
</table>

---
&nbsp;

### Templ8 instance methods

To keep it simple, a Templ8 instance only contains one method.

#### parse( dictionary`:Object` )`:String`

This method accepts one parameter: an Object of values you want to substitute and returns a String of the parsed Templ8.

Any tokens in the Templ8 that do not have a dictionary value will use the `fallback` value described above,

---
&nbsp;

### Templ8 variables

#### basic global variables

##### $_

This is based on perl's `$_` and is a reference to the the current dictionary value being parsed.

For instance if you are in a loop, rather than access the value using `iter.current` you could also access it via `$_`.

e.g. instead of this:

```javascript
    {[ iter.current|parse:'sub_template' for each ( items ) ]}
```

or this:

```javascript
    {[ item|parse:'sub_template' for each ( item in items ) ]}
```

you could do this:

```javascript
    {[ $_|parse:'sub_template' for each ( items ) ]}
```

##### iter

This is the current iterator being parsed. It is an instance of an internal class called **Iter**. Iter instances are created internally, when you use a `{% for %}` loop or an Array Comprehension `{[ for each ]}` tag you should not need to create one yourself.

It has the following properties available for both **Arrays** and **Objects**:
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>count</strong></td><td>the total number of all items in the Array or Object</td>
</tr><tr>
	<td><strong>current</strong></td><td>The current item being iterated over.</td>
</tr><tr>
	<td><strong>empty</strong></td><td>Whether or not the item to iterate over is empty – has no items. Note: if the item is not iterable, this will never be true.</td>
</tr><tr>
	<td><strong>first</strong></td><td>The first item in the Array/ Object. Note: you cannot guarantee iteration order in an Object.</td>
</tr><tr>
	<td><strong>firstKey</strong></td><td>The first key in the Array/ Object.</td>
</tr><tr>
	<td><strong>index</strong></td><td>The zero based index of the current iteration.</td>
</tr><tr>
	<td><strong>index1</strong></td><td>The one based index of the current iteration.</td>
</tr><tr>
	<td><strong>key</strong></td><td>The key of the current item being iterated over in the Array/ Object. For Arrays this will be the same as <code>index</code>.</td>
  </tr><tr>
	<td><strong>last</strong></td><td>The last item in the Array/ Object.</td>
</tr><tr>
	<td><strong>lastIndex</strong></td><td>The zero based index of the last item in the Array/ Object.</td>
</tr><tr>
	<td><strong>lastKey</strong></td><td>The key of the last item in the Array/ Object.</td>
</tr><tr>
	<td><strong>next</strong></td><td>The next item in the iteration, or undefined if we're at the last item.</td>
</tr><tr>
	<td><strong>nextKey</strong></td><td>The next key in the iteration, or undefined if we're at the last item.</td>
</tr><tr>
	<td><strong>parent</strong></td><td>If you are in a nested loop and want to call the parent iter, you can access it via this property.</td>
</tr><tr>
	<td><strong>prev</strong></td><td>The previous item in the iteration, or undefined if we're at the first item.</td>
</tr><tr>
	<td><strong>prevKey</strong></td><td>The previous key in the iteration, or undefined if we're at the first item.</td>
</tr><tr>
	<td><strong>stopped</strong></td><td>Whether or not the iteration has been stopped..</td>
</tr><tr>
	<td><strong>val</strong></td><td>The same as <code>current</code>.</td>
</tr>
</table>

It also has the following two methods:
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>hasNext</strong></td><td>returns <code>false</code> if there is no value after the current iteration to iterate over. Otherwise it will return the <code>Iter</code> instance (this).</td>
</tr><tr>
	<td><strong>stop</strong></td><td>will stop the <code>Iter</code> instance from iterating after the current iteration has completed.</td>
</tr>
</table>

---
&nbsp;

#### Templ8 internal variables

Along with the above Templ8 has some internal variables accessible for the more advanced user, should they require access to them.

##### $C:ContextStack

Templ8 **does not use the JavaScript `with` statement**. It implements its own version of a `with` statement using an internal class called **ContextStack**.

It has five methods (**you should NOT** call these if you DO NOT know what you're doing):
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>current</strong></td><td>returns the current context Object</td>
</tr><tr>
	<td><strong>get</strong></td><td>attempts to return the value of a dictionary Object, if it is in the ContextStack, otherwise it will return the fallback value or undefined.</td>
</tr><tr>
	<td><strong>pop</strong></td><td>removes the most recently added dictionary Object from the ContextStack.</td>
</tr><tr>
 	<td><strong>push</strong></td><td>adds a dictionary Object to the ContextStack.</td>
</tr>
</table>

##### \_\_OUTPUT\_\_:String

This is where all parsed template output is stored.

##### \_\_ASSERT\_\_:Function{}

This is a reference to Templ8.Assertions.

##### \_\_FILTER\_\_:Function{}

This is a reference to Templ8.Filters.

##### \_\_UTIL\_\_:Function{}

This is a reference to the internal utility functions used by Templ8.

---
&nbsp;

### Tags & Statements

#### **Tag: {{}}** - Interpolation

This tag is used for interpolating dictionary values with their respective template tokens. At it simplest a tag which will be replaced by a dictionary value `foo` would look something like this:

```javascript
    var tpl = new Templ8( '{{foo}}' );
    tpl.parse( { foo : 'bar' } ); // returns: bar
```

##### Accessing nested values

If your dictionary contains nested objects you can easily access nested values like you would in regular JavaScript.

```javascript
    var tpl = new Templ8( '{{some.nested.value}}' );
    tpl.parse( { some : { nested : { value : 'foo' } } } ); // returns: foo
```

You can also similarly access values from Array's in the same way:

```javascript
    var tpl = new Templ8( '{{some.nested.1.value}}' );
    tpl.parse( { some : { nested : [{ value : 'lorem' },{ value : 'ipsum' },{ value : 'dolor' }] } } ); // returns: ispum
```

##### Filtering

This is all well and good, but at some point we will want to manipulate the values in our dictionary Objects in some way or another.

Templ8 provides a very simple and powerful method for doing so based on Django's pipe syntax for filtering values.

It is probably most easily illustrated with an example showing the pipe syntax converted to JavaScript. So:

```javascript
    {{value|truncate:30|bold|wrap:"(", ")"|paragraph}}
```

Would translate to something like this:

```javascript
	value = truncate( value, 30 );
	value = bold( value );
	value = wrap( value, '(', ')' );
	value = paragraph( value );
	
	// or 
	
	paragraph( wrap( bold( truncate( value, 30 ) ), '(', ')' ) );
```

The most important thing to note is that the first value passed to the filter is always the value being parsed by the template, the arguments passed to each filter will always come after the value being parsed.

##### One line statements

As well as standard template conditionals, Templ8 introduces one line statements, because, hey it's JavaScript and we like to keep things concise. 

If you only want to parse a value if a certain condition is met, rather than writing block if tags around it, you can include it in your interpolation tag like so:

```javascript
    {{value if value|exists}}
```

Which translates to something like this:

```javascript
    if ( exists( value ) ) { __OUTPUT__ += value; }
```

Notice how you can use the same pipe syntax for conditionals. Templ8's internals work out whether your method is an assertion or a filter and reference the appropriate method.

You can also use ordinary JavaScript conditions if you want to, as well as an **unless** statement; and filtering is still ok too. 

A more complex example would be:

```javascript
    {{value|truncate:30|bold|wrap:"(", ")"|paragraph unless value == null}}
```

Translating to something like:

```javascript
    if ( !( value == null ) ) { 
       paragraph( wrap( bold( truncate( value, 30 ) ), '(', ')' ) ); 
    }
```

#### **Tag: {%%}** - Evaluation

This tag is used in conjunction with the above tag to give you access to more powerful conditional statements, iteration and sub templates.

##### if/ unless/ elseif/ else/ endif Statements

Just like regular JavaScript Templ8 features conditional statements. It also introduces the `unless` statement based off Perl.

Every open `if`/ `unless` statement must end with an `endif` statement -- with any number of`elseif`s in between; an optional `else` is also allowed just before `endif`.

The reason for the `endif` statement is that Templ8 does not use braces to encapsulate block statements, so it requires a flag to let the parser know when to close a block.

**Note: `elseif` should be written as one word, no spaces. It can also be written as `elsif`, again, based off Perl.**

An example would be:

```javascript
    {% if value == 'foo' %}
        <h1>{{value|bold}}</h1>
    {% elseif value == 'bar' %}
        <h2>{{value|italics}}</h2>
    {% else %}
        {{value}}
    {% endif %}
```

Translating to:

```javascript
    if ( value == 'foo' ) { 
        '<h1>' + bold( value ) + '</h1>';
    }
    else if ( value == 'bar' ) {
        '<h2>' + italics( value ) + '</h2>';
    }
    else { value; }
````

##### for/ forempty/ endfor Statements
The `for` statement allows you to iterate over Arrays as well as Objects. There are a number of options available with the `for` statement.

Just like the `if` statement the `for` statement must end with an `endfor` statement to tell the parser that the statement block is ending.

You can also include a `forempty` statement which will be used in the case where an Array/ Object is either empty or the item you are trying to iterate over is not iterable, e.g. a Number or Date. `forempty` is not mandatory.

The `iter` variable mentioned above is the standard way to access any and all properties you require while iterating over an Array/ Object.

You can also use `$_` to access the current value being iterated over.

However you can also assign your own variable names to the `for`. e.g.

```javascript
    {% for item in items %}
        {{item}}
    {% forempty %}
        No items
    {% endfor %}
```

Will assign the current value being iterated over to the variable `item`, which is accessible as demonstrated.

```javascript
    {% for [key, value] in items %}
        {{key}}. {{value}}
    {% endfor %}
```

Will assign the current value being iterated over to the variable `value`. If you are iterating over an Array then the variable `key` will be the zero based index of the the current item being iterated over. If you are iterating over an Object then the variable `key` will be the the key name of the current item being iterted over.

If you want to limit the number of items you are iterating over you can do so by using brackets to specify the range of items to iterate over.

```javascript
    {% for item in items [..10] %}
        {{item}}
    {% endfor %}
```

Will iterate over items 0 to 10, so the first 11 items in the Array/ Object.

```javascript
    {% for item in items [5..10] %}
        {{item}}
    {% endfor %}
```

Will iterate over items 5 to 10.

```javascript
    {% for item in items [5..] %}
        {{item}}
    {% endfor %}
```

Will iterate over all items starting from the 6th item in the Array/ Object.

If you are nesting `for` statements you can access the parent `iter` Object by using the syntax `iter.parent` this will maintain state no matter how deep you nest.

##### sub/ endsub templates
TODO

#### **Tag: {[]}** - Array Comprehensions
TODO

#### **Tag: {::}** - Executing Arbitrary JavaScript
TODO

#### **Tag: {##}** - Comments
TODO

#### Adding your own Tags and/ or Statements
TODO

---
&nbsp;
## Examples (by tag)

### **Tag: {{}}**

#### Replacing values

```javascript
    var tpl = new Templ8( '{{value}}' );

    tpl.parse( { value : 'github.com' } ); // returns: *github.com*
```

##### Filtering values

```javascript
    var tpl = new Templ8( '{{value|truncate:30|bold|link:"http://github.com"}}' );

    tpl.parse( { value : 'github.com is great for sharing your code with other people.' } ); 
```

returns the String:

```html
	<a href="http://github.com"><strong>github.com is great for sharin...</strong></a>
```

##### One line *if* statement

```javascript
    var tpl = new Templ8( '{{value if value|notEmpty}}' );
    
    tpl.parse( { value : 'github.com' } ); // returns: *github.com*

    tpl.parse( {} );                       // returns: empty String ( "" )
```

##### One line *unless* statement

```javascript
   var tpl = new Templ8( '{{value unless value|equals:"foo"}}' );

    tpl.parse( { value : 'github.com' } ); // returns: *github.com*

    tpl.parse( { value : 'foo' } );        // returns: empty String ( "" )
```

---
&nbsp;

### Tag **{%%}**

#### conditions: *if|unless/ elseif/ else/ endif*

```javascript
    var tpl = new Templ8(
        '{% if value == "foo" || value == "bar" %}',
            '{{value}}',
        '{% elseif value != "lorem ipsum" %}',
            '{{value|bold}}',
        '{% elseif value|notEmpty %}',
            '{{value|italics}}',
        '{% else %}',
            'No value',
        '{% endif %}'
    );

    tpl.parse( { value : 'foo' } );            // returns: foo

    tpl.parse( { value : 'lorem ipsum' } );    // returns: <strong>lorem ipsum</strong>

    tpl.parse( { value : 'dolor sit amet' } ); // returns: <em>dolor sit amet</em>

    tpl.parse( {} );                           // returns: No Value
```

#### iterating: *for/ forempty/ endfor*

```javascript
    var tpl = new Templ8(
	    '{% for item in items %}',
            '<p>{{item}}</p>',
        '{% forempty %}',
            '<p><strong>No items</strong></p>',
        '{% endfor %}' 
    );

    tpl.parse( { items : ['one', 'two', 'three'] } );               // returns: <p>one</p><p>two</p><p>three</p>

    tpl.parse( { items : { "one" : 1, "two" : 2, "three" : 3 } } ); // returns: <p>1</p><p>2</p><p>3</p>

    tpl.parse( {} );                                                // returns: <p><strong>No items</strong></p>
    
    tpl.parse( { items : foo } );                                   // returns: <p><strong>No items</strong></p>
```

#### *sub/ endsub* templates

```javascript
    var tpl = new Templ8(
        '{% sub list_item %}', '<li>{{$_}}</li>', '{% endsub %}', 
        '<ul>{[ item|parse:"list_item" for each ( item in items ) ]}</ul>'
    );

	tpl.parse( { items : ['one', 'two', 'three'] } );
```

returns the String:

```html
	<ul><li>one</li><li>two</li><li>three</li></ul>
```

---
&nbsp;

### Tag **{[]}** (Array comprehensions or one line for loops)

```javascript
    var tpl_foo = new Templ8( { id : 'foo' }, '<em>{{val}}</em>' ), 
        tpl_bar = new Templ8( { id : 'bar' }, '<strong>{{val}}</strong>' ), 
        tpl     = new Templ8( '{[ v|parse:k|paragraph for each ( [k,v] in items ) if ( k|isTPL ) ]}' );

    tpl.parse( {
        foo  : { val : 'foo' }, 	
        bar  : { val : 'bar' }, 
        greg : { val : 'not gonna happen' }
    } );
```

returns the String:

```html
	<p><em>foo</em></p><p><strong>bar</strong></p>
```

as **greg** does not exist as a template (poor greg), the value is not rendered...

---
&nbsp;

### Tag **{::}**
Allows you to execute arbitrary JavaScript.

```javascript
    var tpl = new Templ8( '{: aribtrarily.executing.nasty.code.isFun(); :}' );
```

---
&nbsp;

### Tag **{##}**
Allows you to add comments in your template.

```javascript
    var tpl = new Templ8( '{# doing something complex and describing it is sensible, but not probable #}' );
```

## File size

- Templ8.js ≅ 7.7kb (gzipped)
- Templ8.min.js ≅ 5.1kb (minzipped)

## License

(The MIT License)

Copyright &copy; 2011 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
