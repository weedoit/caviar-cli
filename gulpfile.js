var gulp, ts, watch;

gulp = require('gulp');
ts = require('gulp-typescript');
watch = require('gulp-watch');

gulp.task('build', function () {
    return gulp.src([
        'src/commands/*.ts',
        'src/command.ts',
        'src/parser.ts',
        'src/main.ts',
    ]).pipe(ts({
        module: 'commonjs',
        out: 'caviar-cli.js'
    })).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*.ts'], ['build']);
});

gulp.task('default', ['build', 'watch']);