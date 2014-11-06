/*
 * grunt-if
 * https://github.com/tylerbeck/grunt-if
 *
 * Copyright (c) 2014 Tyler Beck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {

    var q = require( 'q' );
    var exec = require('child_process').exec;

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask( 'if', 'Conditionally run tasks', function() {

        var done = this.async();
        var task = this;

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options( {
            test: [ function(){ return true; } ] , // execute test functions
            config: undefined, //test config value
            executable: undefined //test if cli executable exists
        } );

        function runTests(){

            var deferred = q.defer();
            var tests = [];

            //normalize and add test functions
            if ( options.test ){
                options.test = [].concat( options.test );
                options.test.forEach( function( test ){

                    if (typeof test === 'function'){
                        tests.push( function(){
                            var d = q.defer();

                            var result = test();
                            if ( q.isPromise( result ) ){
                                result.then( function( val ){
                                    if (!val){
                                        d.reject('test failed');
                                    }
                                    else{
                                        d.resolve();
                                    }
                                }, d.reject );
                            }
                            else{
                                if ( !result ){
                                    d.reject('test failed');
                                }
                                else{
                                    d.resolve();
                                }
                            }

                            return d.promise;
                        });
                    }

                });
            }

            //normalize and add executable test functions
            if ( options.executable ) {
                options.executable = [].concat( options.executable );
                options.executable.forEach( function( executable ) {

                    if ( typeof executable === 'string' ) {

                        tests.push( function(){
                            var d = q.defer();
                            exec('type '+executable+' 2>/dev/null || { echo >&2 "'+executable+' not found!"; }',
                                    function (error, stdout, stderr) {
                                        if ( error !== null ) {
                                            d.reject( error );
                                        }
                                        else if ( stderr !== "" ){
                                            d.reject( stderr );
                                        }
                                        else {
                                            d.resolve();
                                        }
                                    });

                            return d.promise;
                        });
                    }

                } );
            }

            //run test functions
            tests.reduce( q.when, q() )
                    .then( function(){
                        deferred.resolve( true );
                    } )
                    .fail( function( error ){
                        deferred.reject( error );
                    });


            return deferred.promise;
        }

        runTests().then(
                function(){
                    grunt.log.writeln('[if] tests evaluated true');
                    var tasks = task.data.ifTrue ? [].concat( task.data.ifTrue ) : [];
                    grunt.task.run( tasks );
                },
                function( error ){
                    grunt.log.writeln('[if] tests evaluated false: '+error);
                    var tasks = task.data.ifFalse ? [].concat( task.data.ifFalse ) : [];
                    grunt.task.run( tasks );
                }
        ).finally( done );


    } );

};
