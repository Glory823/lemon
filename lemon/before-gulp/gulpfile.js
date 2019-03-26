const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webserver = require('gulp-webserver');


//压缩CSS
gulp.task("devCss", () => {
    return gulp.src("./src/css/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest("./src/css/"))
})

//压缩HTML
gulp.task("devHtml", () => {
    return gulp.src("./src/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./build/"))
})

//编译js文件，合并js，并且压缩
gulp.task("devJs", () => {
    return gulp.src("./src/js/libs/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./src/js/"))
})

//开发  启动web服务  并且提供自动刷新功能
gulp.task("webserver", () => {
    return gulp.src("./src")
        .pipe(webserver({
            port: 2020,
            livereload: true,
            host: "localhost",
            proxies: [
                { source: "/api/login", target: "http://localhost:3000/api/login" },
                { source: "/api/register", target: "http://localhost:3000/api/register" },
				{ source: "/api/billFind", target: "http://localhost:3000/api/billFind" },
				{ source: "/api/billRemove", target: "http://localhost:3000/api/billRemove" }
            ]
        }))

})


gulp.task("watch", () => {
    gulp.watch("./src/css/scss/*.scss", gulp.series("devCss"));
})

gulp.task("default", gulp.series("webserver", "watch"));