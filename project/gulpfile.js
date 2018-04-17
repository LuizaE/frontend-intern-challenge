//load plugins
var gulp             = require('gulp'),
    compass          = require('gulp-compass'),
    minifycss        = require('gulp-minify-css'),
    uglify           = require('gulp-uglify'),
    rename           = require('gulp-rename'),
    concat           = require('gulp-concat'),
    livereload       = require('gulp-livereload');


var origSrc = gulp.src;

gulp.src = function () {
    return fixPipe(origSrc.apply(this, arguments));
};

function fixPipe(stream) {
    var origPipe = stream.pipe;
    stream.pipe = function (dest) {
        arguments[0] = dest.on('error', function (error) {
            var nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach(function (nextStream) {
                    nextStream.emit('error', error);
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        var nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}

gulp.task('compass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(compass({
            css: 'src/css',
            sass: 'src/sass',
            image: 'src/img'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .on('error', function (error) {
            console.error('' + error);
        });
});


//scripts frontend
gulp.task('javascript', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('application.js'))
        // .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*.{gif,jpg,png,svg}')
      .pipe(gulp.dest('dist/img'));
});

gulp.task('html', function() {
  return gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));
});

//watch
gulp.task('live', function() {
    livereload.listen();

    //watch index.html file
    gulp.watch('src/index.html', ['html']);

    //watch .scss files
    gulp.watch('src/sass/**/*.scss', ['compass']);

    //watch .js files for frontend
    gulp.watch('src/js/**/*.js', ['javascript']);

    //watch images files
    gulp.watch('src/img/**/*.{gif,jpg,png,svg}', ['images']);
});

// Rodando a tarefa padrão
gulp.task('default', ['live']);