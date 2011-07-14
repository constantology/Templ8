#TODO:

- documentation is not yet complete
- add unit tests (already have tests: just wanting to port them from my own framework to an existing one like JSTestDriver or something).

# Templ8

Templ8 as you can probably guess is a JavaScript template engine, with a Django'ish style of syntax.

It's fast, light weight (5kb gzipped & minified) and unlike most other JavaScript template engines: **Templ8 does not use the JavaScript `with` statement** . This actually makes Templ8 parse faster than it would if it did use the `with` statement!

Templ8 does not restrict you to generating HTML. All outputs are strings so if you want to generate HTML, CSS, JavaScript or whatever, the choice is yours...

## Usage
Templ8 is avaiable as a Node JS module as well as a browser micro-framework.

### Node

#### Installation
```
   npm install Templ8
```
#### Requiring
```javascript
   var Templ8 = require( 'Templ8' );
```

### Browser

You have 2 options.

1. `Templ8.client.js` is the version optimised for modern browsers (i.e. browsers that implement JavaScript version 1.6).
2. `Templ8.shimmed.js` contains shims to enable backwards compatibility with older browsers -- only an extra 0.5kb (min + gzip).

**NOTE:** The shimmed version will still use JavaScript 1.6 features where available.

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
	<td><strong>first</strong></td><td>The first item in the Array/ Object. Note: you cannot guarantee iteration order in an Object.</td>
</tr><tr>
	<td><strong>index</strong></td><td>The zero based index of the curent iteration.</td>
</tr><tr>
	<td><strong>index1</strong></td><td>The one based index of thecurrent iteration.</td>
</tr><tr>
	<td><strong>last</strong></td><td>The last item in the Array/ Object.</td>
</tr><tr>
	<td><strong>next</strong></td><td>The next item in the iteration, or undefined if we're at the last item.</td>
</tr><tr>
	<td><strong>parent</strong></td><td>If you are in a nested loop and want to call the parent iter, you can access it via this property.</td>
</tr><tr>
	<td><strong>previous</strong></td><td>The previous item in the iteration, or undefined if we're at the first item.</td>
</tr>
</table>

It has the following extra properties available for **Objects**:
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>firstKey</strong></td><td>The key of the first item in the Object.</td>
</tr><tr>
	<td><strong>lastKey</strong></td><td>The key of the last item in the Object.</td>
</tr><tr>
	<td><strong>key</strong></td><td>The key of the current item being iterated over in the Object.</td>
</tr><tr>
	<td><strong>nextKey</strong></td><td>The next key in the iteration, or undefined if we're at the last item.</td>
</tr><tr>
	<td><strong>previousKey</strong></td><td>The previous key in the iteration, or undefined if we're at the first item.</td>
</tr>
</table>

It also has the following two methods:
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>hasNext</strong></td><td>returns true if there is a value after the current iteration to iterate over. Otherwise it will return false.</td>
</tr><tr>
	<td><strong>stop</strong></td><td>will stop the iterating, once it finishes it's current iteration.</td>
</tr>
</table>

---
&nbsp;

#### Templ8 internal variables

Along with the above Templ8 has some internal variables accessible for the more advanced user, should they require access to them.

##### $C or \_\_CONTEXT\_\_

Templ8 **does not use the JavaScript `with` statement**. It implements its own version of a `with` statement using an internal class called **ContextStack**.

It has five methods (**you should NOT** call these if you DO NOT know what you're doing):
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>current</strong></td><td>returns the current context Object</td>
</tr><tr>
	<td><strong>destroy</strong></td><td>destroys the ContextStack.</td>
</tr><tr>
	<td><strong>get</strong></td><td>attempts to return the value of a dictionary Object, if it is in the ContextStack, otherwise it will return the fallback value or undefined.</td>
</tr><tr>
	<td><strong>pop</strong></td><td>removes the most recently added dictionary Object from the ContextStack.</td>
</tr><tr>
 	<td><strong>push</strong></td><td>adds a dictionary Object to the ContextStack.</td>
</tr>
</table>

##### \_\_OUTPUT\_\_

This is where all parsed template output is stored. It is an instance of an internal class call **Output**.

It has two methods:
<table border="0" cellpadding="0" cellspacing="0">
<tr>
	<td><strong>join</strong></td><td>returns the output of the Templ8 instance.</td>
</tr><tr>
	<td><strong>push</strong></td><td>adds a String representation of the passed parameter to the Templ8 instance's output.</td>
</tr>
</table>

##### \_\_ASSERT\_\_

This is a reference to Templ8.Assertions.

##### \_\_FORMAT\_\_

This is a reference to Templ8.Filters.

##### \_\_UTIL\_\_

This is a reference to the internal utility functions used by Templ8.

---
&nbsp;

### Tags

---
&nbsp;

### Statements

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

```  html
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
            '{{item}}',
        '{% forempty %}',
            'No items',
        '{% endfor %}' 
    );
```

#### *sub/ endsub* templates

```javascript
    var tpl = new Templ8(
        '{% sub sub_template_name %}',
            '{{$_}}',
        '{% endsub %}' 
    );
```

---
&nbsp;

### Tag **{[]}** (Array comprehensions or one line for loops)

```javascript
    var tpl = new Templ8( '{[ v|parse"k" for each ( [k,v] in items ) if ( k|isTPL ) ]}' );
```

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

## License

(The MIT License)

Copyright &copy; 2011 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
