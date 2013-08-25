$(document).ready(function () {
    chainIn(['.header h1', '.header h4', '.intro-title', '.intro-features', '.intro-button'], 0);

    $('#btnstart').click(function () {
        $('.intro').hide(300);
        //$('.progress-completed').show(300);
        //$('.creation-1').show(300);
        chainIn(['.progress-completed', '.creation-1'], 0);
    });
});

var chainIn = function (toAnimate, ix) {
    if (toAnimate[ix]) {
        $(toAnimate[ix]).fadeIn(1500, function () { chainIn(toAnimate, ix + 1) });
    }
};

