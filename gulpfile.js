// REQUIRED
var gulp    = require( 'gulp' );
var gutil   = require( 'gulp-util' );
var coffee  = require( 'gulp-coffee' );
var concat  = require( 'gulp-concat' );
var gif     = require( 'gulp-if' );
var uglify  = require( 'gulp-uglify' );
var userDir = require( './user-settings.json' ).userDir;

// VARIABLES
var env, csIn, csOut, jsIn;
// DEFAULTS
if( userDir===undefined ){ userDir='build'; }
env = 'dev';

// SOURCES
csIn = ['src/*.coffee'];
jsIn = [
    'src/block_first.js',
    'build/staging/!(app)*.js',
    'build/staging/app.js',
    'src/block_last.js'
];
// DESTINATIONS
csOut = 'build/staging';

/*=== COFFEESCRIPT ===*/
gulp.task( 'coffee', function(){
    gulp.src( csIn )
        .pipe( coffee({ bare: true }) )
            .on( 'error', gutil.log )
        .pipe( gulp.dest( csOut ) );
} );
/*=== JAVASCRIPT ===*/
gulp.task( 'js', function(){
    gulp.src( jsIn )
        .pipe( gif( env==='release',concat('MAM_Plus.user.js'),concat('MAM_Plus_dev.user.js') ) )
            .on( 'error', gutil.log )
        .pipe( gif( env==='release',uglify({ preserveComments: 'license' }) ) )
            .on( 'error', gutil.log )
        .pipe( gulp.dest( 'build/'+env ) )
        .pipe( gulp.dest( userDir+'/MAM_Plus' ) );
} );
/*=== SET RELEASE ===*/
gulp.task( 'setRelease', function(){
    env='release';
} );
/*=== CHECK ENV ===*/
gulp.task( 'checkEnv', function(){
    console.log('ENV='+env);
} );
/*=== WATCH ===*/
gulp.task( 'watch', function(){
    gulp.watch( csIn,['coffee'] );
    gulp.watch( jsIn,['js'] );
} );

/*=== DEFAULT ===*/
gulp.task( 'default', ['checkEnv','coffee','js','watch'] );
/*=== RELEASE ===*/
gulp.task( 'release', ['setRelease','default'] );
