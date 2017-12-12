var browserify = require('browserify'),
    gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserSync = require('browser-sync');
	babelify    = require('babelify');
	livereload  = require('gulp-livereload');
	uglify = require('gulp-uglify');
	$ = require( 'gulp-load-plugins' )( {lazy: true} );


gulp.task( 'styles', function () {
	return gulp
		.src( './src/sass/**/*.scss' )
		.pipe( $.sass().on( 'error', $.sass.logError ) )
		.pipe( $.autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) )
		.pipe( $.cleanCss() )
		.pipe( gulp.dest( 'public/css' ) )
		.pipe( browserSync.reload( {stream: true} ) );
} );

gulp.task('scripts', function () {
    return browserify({entries: './src/js/script.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('script.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload());
});

gulp.task( 'images', function () {
	return gulp
		.src( 'src/images/**' )
		.pipe( $.changed( 'images' ) )
		.pipe( $.imagemin( {
			progressive: true,
			interlaced: true
		} ) )
		.pipe( gulp.dest( 'public/images' ) )
		.pipe( $.size( {title: 'images'} ) );
} );

gulp.task('fonts', function() {
    return gulp
		.src( 'src/fonts/**' )
		.pipe(gulp.dest('public/fonts'));
});

gulp.task( 'html', function () {
	return gulp
		.src( './src/**/*.html' )
		.pipe( gulp.dest( 'public/' ) )
} );

gulp.task( 'browser-sync', ['styles', 'scripts'], function () {
	browserSync( {
		server: {
			baseDir: "./public/",
			injectChanges: true // this is new
		}
	} );
} );

gulp.task( 'deploy', function () {
	return gulp
		.src( './public/**/*' )
		.pipe( ghPages() );
} );

gulp.task( 'watch', function () {
	// Watch .html files
	gulp.watch( 'src/**/*.html', ['html', browserSync.reload] );
	gulp.watch( "public/*.html" ).on( 'change', browserSync.reload );
	// Watch .sass files
	gulp.watch( 'src/sass/**/*.scss', ['styles', browserSync.reload] );
	// Watch .js files
	livereload.listen();
	gulp.watch( 'src/js/*.js', ['scripts', browserSync.reload] );
	// Watch image files
	gulp.watch( 'src/images/**/*', ['images', browserSync.reload] );
	// Watch fonts files
	gulp.watch( 'src/fonts/**/*', ['fonts', browserSync.reload] );
} );

gulp.task( 'default', function () {
	gulp.start(
		'styles',
		'scripts',
		'images',
		'fonts',
		'html',
		'browser-sync',
		'watch'
	);
} );



