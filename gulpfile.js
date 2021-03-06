const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    csscomb = require('gulp-csscomb'),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    gulpsync = require('gulp-sync')(gulp);

//ordenar Reglas sass con csscomb
gulp.task('sortsass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(csscomb())
        .pipe(gulp.dest('./src'));
});

gulp.task('sass', gulpsync.sync(['sortsass']), () => {
    return gulp.src('./src/*.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('pug', () => {
    return gulp.src('./src/*.pug')
        .pipe(pug({
            'pretty': true,
            'compileDebug': true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('serve', gulpsync.sync(['sass', 'pug']), () => {
    browserSync.init({
        server: './dist'
    });

    gulp.watch('./src/**/*.scss', gulpsync.sync(['sass']));
    gulp.watch('./src/*.pug', ['pug']);
    gulp.watch('./src/**/*.pug', ['pug']);
    gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);