# grunt-if

> Conditionally run tasks

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-if --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-if');
```

## The "if" task

### Overview
In your project's Gruntfile, add a section named `if` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    if: {
        your_target: {
            // Target-specific file lists and/or options go here.
            options: {
                // execute test function(s)
                test: function(){ return true; },

                //test if cli executable exists
                executable: 'foo'
            },
            //array of tasks to execute if all tests pass
            ifTrue: [ 'taskIfTrue' ],

            //array of tasks to execute if any test fails
            ifFalse: ['taskIfFalse']
        }
    }
});
```

### Options

#### options.test
Type: `Function | Array of Functions`
Default value: `[]`

A function or an array of functions that must all evaluate (or resolve) to a truthy value.
If a function returns a Q style promise, the test passes if the resolved value is truthy.  The test will fail if the promise is rejected or the resolved value is falsey.

#### options.executable
Type: `String | Array of Strings`
Default value: `[]`

If set, tests will be performed to determine whether the specified command line executable(s) exist.


### Usage Examples

#### Test Function - returns value
In this example, `ifTrue` tasks are executed if the test method returns true.

```js
grunt.initConfig({
    if: {
        default: {
            options: {
                test: function(){ return Date.now() % 2; }
            },
            ifTrue: [ 'taskIfTrue' ]
            ifFalse: [ 'taskIfFalse' ]
        }
    }
});
```

#### Test Function - returns promise
In this example, `ifTrue` tasks are executed if the test method resolves to true after the delay.

```js
grunt.initConfig({
    if: {
        default: {
            options: {
                test: function(){
                    var d = q.defer();
                    setTimeout( function(){
                        d.resolve( Date.now() % 2  === 1 );
                    }, 2000 );
                    return d.promise;
                }
            },
            ifTrue: [ 'taskIfTrue' ]
            ifFalse: [ 'taskIfFalse' ]
        }
    }
});
```

#### Test Executable
In this example, `ifTrue` tasks are executed if the fontforge executable is available.

```js
grunt.initConfig({
    if: {
        default: {
            options: {
                executable: 'fontforge'
            },
            ifTrue: [ 'taskIfTrue' ]
            ifFalse: [ 'taskIfFalse' ]
        }
    }
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
