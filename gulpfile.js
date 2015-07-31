var gulp = require("gulp")
var jade = require("gulp-jade")
var concat = require("gulp-concat")
var csso = require("gulp-csso")
var rename = require("gulp-rename")
var uglify = require("gulp-uglify")
var jshint = require("gulp-jshint")
var karma = require('gulp-karma')

gulp.task("test", function(){
  var testFiles = [
    "./app/**/*.js",
    "./test/**/*.js"
  ]
  gulp.src(testFiles)
  .pipe(karma({
    configFile: "karma.conf.js",
    action: "watch"
  }))
})

gulp.task("lint", function(){
  gulp.src("./app/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task("concat-js", ["lint"], function(){
  gulp.src("./app/**/*.js")
    .pipe(concat("index.js"))
    .pipe(gulp.dest("./build/app"))
    .pipe(rename("index.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./build/app"))   
})

gulp.task("compile-index-jade", function(){
  gulp.src("./index.jade")
    .pipe(jade({
      pretty:true
    }))
    .on("error", console.log)
    .pipe(gulp.dest("./build"))
})

gulp.task("compile-views-jade", function(){
  gulp.src("./app/**/*.jade")
  .pipe(jade({
    pretty:true
  }))
  .on("error", console.log)
  .pipe(gulp.dest("./build/app/views"))
})

gulp.task("concat-css", function(){
  gulp.src("./assets/css/**/*.css")
    .pipe(concat("index.css"))
    .pipe(gulp.dest("./build/assets/css"))
    .pipe(rename("index.min.css"))
    .pipe(csso())
    .pipe(gulp.dest("./build/assets/css"))
})

gulp.task("copy-libs", function(){
  gulp.src("./assets/libs/**/*")
    .pipe(gulp.dest("./build/assets/libs"))
})

gulp.task("watch", function(){
  gulp.watch("./app/**/*.jade", function(){
    gulp.run("compile-views-jade")
  })

  gulp.watch("./index.jade", function(){
    gulp.run("compile-index-jade")
  })

  gulp.watch("./assets/css/**/*.css", function(){
    gulp.run("concat-css")
  })

  gulp.watch("./app/**/*.js", function(){
    gulp.run("concat-js")
  })
})

gulp.task("default", ["test", "lint", "concat-js", "compile-views-jade", 
  "compile-index-jade", "concat-css", "copy-libs", "watch"])
