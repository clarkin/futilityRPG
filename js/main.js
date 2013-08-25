$(document).ready(function () {

    chainIn(['.header h1', '.header h4', '.intro-title', '.intro-features', '.intro-button']);

    $('#btnstart').click(function () {
        $('.intro').fadeOut(300, function () {
            $('.header').addClass('docked');
            setTimeout(function () {
                chainIn(['.header-right', '.progress-completed', '.step-race', '.next-step']);
            }, 1000);
        });

    });

    $('.step-race a').click(function () {
        console.log('clicked');
        chainIn(['.step-subrace']);
    });
});

var chainIn = function (toAnimate, ix) {
    if (typeof ix === 'undefined') {
        ix = 0;
    }

    if (toAnimate[ix]) {
        if (typeof toAnimate[ix] === 'string') {
            $(toAnimate[ix]).fadeIn(1500, function () { chainIn(toAnimate, ix + 1) });
        } 
    }
};



