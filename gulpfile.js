'use strict';
var gulp = require('gulp');
var slim = require('gulp-slim');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var please = require('gulp-pleeease');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');

var SRC_ROOT = 'src';
var DIST_ROOT = 'dist';

var options = {
  styles: {
    sass: {
      errLogToConsole: true
    },
    please: {
      minifier: false,
      autoprefixer: {
        browsers: [
          'last 4 version',
          'ie 8',
          'iOS 4',
          'Android 2.3'
        ]
      }
    }
  },
  scripts: {},
  server: {
    browserSync: {
      server: {
        baseDir: DIST_ROOT
      },
      notify: false,
      open: true
    }
  }
};

function buildMarkups(isWatch) {
  function build() {
    console.log('build: markups');
    return gulp.src('src/index.slim')
      .pipe(plumber())
      .pipe(slim())
      .pipe(gulp.dest(DIST_ROOT))
      .pipe(browserSync.reload({ stream: true }));
  }

  if (isWatch) {
    return function() {
      build();
      gulp.watch('src/index.slim', build);
    };
  } else {
    return function() {
      build();
    };
  }
}

function buildStyles(isWatch) {
  function build() {
    console.log('build: styles');
    return gulp.src('src/index.scss')
      .pipe(plumber())
      .pipe(sass(options.styles.sass))
      .pipe(please(options.styles.please))
      .pipe(gulp.dest(DIST_ROOT))
      .pipe(browserSync.reload({ stream: true }));
  }

  if (isWatch) {
    return function() {
      build();
      gulp.watch('src/**/*.scss', build);
    };
  } else {
    return function() {
      build();
    };
  }
}

function buildScripts(isWatch) {
  function build() {
    console.log('build: scripts');
    return gulp.src('src/**/*.coffee')
      .pipe(plumber())
      .pipe(coffee())
      .pipe(gulp.dest(DIST_ROOT))
      .pipe(browserSync.reload({ stream: true }));
  }

  if (isWatch) {
    return function() {
      build();
      gulp.watch('src/**/*.coffee', build);
    };
  } else {
    return function() {
      build();
    };
  }
}

function buildImages() {
  return gulp.src(['src/**/*.{png,jpg,gif}'])
    .pipe(plumber())
    .pipe(gulp.dest(DIST_ROOT));
}

function buildFiles() {
  return gulp.src(['src/**/*.{csv,json}'])
    .pipe(gulp.dest(DIST_ROOT));
}

function runServer() {
  return browserSync.init(null, options.server.browserSync);
}

// tasks
gulp.task('build:markups', buildMarkups(false));
gulp.task('watch:markups', buildMarkups(true));
gulp.task('build:styles', buildStyles(false));
gulp.task('watch:styles', buildStyles(true));
gulp.task('build:scripts', buildScripts(false));
gulp.task('watch:scripts', buildScripts(true));
gulp.task('build:images', buildImages);
gulp.task('build:files', buildFiles);
gulp.task('build', ['build:markups', 'build:styles', 'build:scripts', 'build:images', 'build:files']);
gulp.task('watch', ['watch:markups', 'watch:styles', 'watch:scripts', 'build:images', 'build:files']);
gulp.task('server', runServer);
gulp.task('develop', ['server', 'watch']);
