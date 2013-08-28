var steps = [];
var currentStep = 0;
var thisStep;
var thisSubStep;
var canProceed = false;
var SPEEDYMODE = false;
var ANIMATE_SPEED = 1500;
if (SPEEDYMODE) {
    ANIMATE_SPEED = ANIMATE_SPEED / 10;
}
var ANIMATE_SPEED_OUT = ANIMATE_SPEED / 5;

$(document).ready(function () {

    var q;

    q = createQuestion('Choose your RACE');
    q.addAnswerWithSub('Human', 'What kind of HUMAN?', ['Desert Nomad', 'Ice Barbarian', 'Empire Citizen']);
    q.addAnswerWithSub('Elf', 'What kind of ELF?', ['Dark Drow', 'Sylvan Elf', 'Sea Elf', 'High Elf']);
    q.addAnswerWithSub('Dwarf', 'What kind of DWARF?', ['Dark Duergar', 'Mountain Dwarf', 'Mechanical Dwarf']);
    steps.push(q);

    q = createQuestion('Choose your SEX');
    q.addAnswerWithSub('Human', 'What kind of HUMAN?', ['Desert Nomad', 'Ice Barbarian', 'Empire Citizen']);
    q.addAnswerWithSub('Elf', 'What kind of ELF?', ['Dark Drow', 'Sylvan Elf', 'Sea Elf', 'High Elf']);
    q.addAnswerWithSub('Dwarf', 'What kind of DWARF?', ['Dark Duergar', 'Mountain Dwarf', 'Mechanical Dwarf']);
    steps.push(q);

    chainIn(['.header h1', '.header h4', '.intro-title', '.intro-features', '.intro-button']);

    $('#btnstart').click(function () {
        //$('.intro').fadeOut(300, function () {
        chainOut(['.intro-button', '.intro-features', '.intro-title']);
        setTimeout(function () {
            $('.intro').hide();
            setTransition('.header', ANIMATE_SPEED);
            $('.header').addClass('docked');

            initStep(currentStep);

            setTimeout(function () {
                chainIn(['.header-right', '.progress-completed', '.step-basic', '.next-step']);
            }, 1000);
        }, ANIMATE_SPEED_OUT * 3);

    });

    $('#next-section-button').click(function () {
        event.preventDefault();

        if (canProceed) {
            canProceed = false;
            
            $('.next-section-holder').removeClass('fading-in');
            setTransition('.your-answer-holder', ANIMATE_SPEED);
            $('.your-answer-holder').addClass('saving');
            
            setTimeout(function () {
                setTransition('.your-answer-holder', 0);
                $('.your-answer-holder').removeClass('fading-in').removeClass('saving');
            }, ANIMATE_SPEED);
        }
        
        return false;
    });

    

    $('.step-basic, .step-basic-sub').on('click', 'a', function (e) {
        var thisText = this.text;
        var thisAnswer;

        var isMainQuestion = $(this).parent().parent().hasClass('step-basic');
        if (isMainQuestion) {
            $.each(thisStep.answers, function (index, value) {
                if (value.answer === thisText) {
                    thisAnswer = value;
                    return false;
                }
            });
        } else {
            $.each(thisSubStep.answers, function (index, value) {
                if (value.answer === thisText) {
                    thisAnswer = value;
                    return false;
                }
            });
        }
        
        console.log('clicked on', thisAnswer);

        if (thisAnswer.subQuestion !== undefined) {
            console.log("subquestion: ", thisAnswer.subQuestion);
            initSubStep(thisAnswer.subQuestion);
        } else {
            console.log("subquestion answered");
            checkAnswer(thisAnswer);
            
        }

    });

});

var createQuestion = function (question) {
    return { question: question, answers: [], addAnswersArray: addAnswersArray, addAnswerWithSub: addAnswerWithSub };
}

var createAnswer = function (forQuestion, answer, subQuestion) {
    var thisAnswer = { forQuestion: forQuestion, answer: answer, subQuestion: subQuestion };
    forQuestion.answers.push(thisAnswer);
    return thisAnswer;
}

var addAnswerWithSub = function (answer, subQuestion, subQuestionAnswersArray) {
    var q = this;
    var sub = createQuestion(subQuestion);
    sub.addAnswersArray(subQuestionAnswersArray);
    createAnswer(q, answer, sub);
}

var addAnswersArray = function (answers) {
    var q = this;
    $.each(answers, function (index, value) {
        createAnswer(q, value);
    });
}

var resetAnswer = function () {
    canProceed = false;
    chainOut(['.next-section-holder', '.your-answer-holder']);
    $('.your-answer-holder').removeClass('saving');
    //$('.next-section-holder').fadeOut(300);
    //$('.your-answer-holder').fadeOut(300).removeClass('saving');
}

var checkAnswer = function (thisAnswer) {
    //console.log(thisAnswer.answer);
    $('.your-answer-holder h3').html("You chose <b>" + thisAnswer.answer + "</b>");
    chainIn(['.your-answer-holder', '.next-section-holder']);
    canProceed = true;
}

var initStep = function (stepNo) {
    thisStep = steps[stepNo];
    //console.log(thisStep);

    resetAnswer();
    $('.step-basic h2').html(thisStep.question);
    $('.step-basic .btn-group').html("");
    $.each(thisStep.answers, function (index, value) {
        $('.step-basic .btn-group').append('<a class="btn btn-custom">' + value.answer + '</a>');
    });
    
}

var initSubStep = function (question) {
    thisSubStep = question;

    resetAnswer();
    chainOut(['.step-basic-sub']);
    setTimeout(function () {
        $('.step-basic-sub h3').html(question.question);
        $('.step-basic-sub .btn-group').html("");
        $.each(question.answers, function (index, value) {
            $('.step-basic-sub .btn-group').append('<a class="btn btn-custom">' + value.answer + '</a>');
        });

        chainIn(['.step-basic-sub']);
    }, ANIMATE_SPEED_OUT);

}

var chainIn = function (toAnimate, ix, fadeIn) {
    if (typeof ix === 'undefined') {
        ix = 0;
    }
    if (typeof fadeIn === 'undefined') {
        fadeIn = true;
    }
    var thisAnimateSpeed = ANIMATE_SPEED;
    if (!fadeIn) {
        thisAnimateSpeed = ANIMATE_SPEED_OUT;
    }

    var thisElement = toAnimate[ix];
    if (thisElement && typeof thisElement === 'string') {
        setTransition(thisElement, thisAnimateSpeed);
        if (fadeIn) {
            $(thisElement).addClass('fading-in');
        } else {
            $(thisElement).removeClass('fading-in');
        }
        setTimeout(function () {
            //$(thisElement).hide();
            //$(thisElement).removeClass('fading-in');
            chainIn(toAnimate, ix + 1, fadeIn);
        }, thisAnimateSpeed);
    }
};

var chainOut = function (toAnimate) {
    chainIn(toAnimate, 0, false);
}

var setTransition = function (element, animationSpeed) {
    $(element).css('-webkit-transition', 'all ' + animationSpeed + 'ms ease');
    $(element).css('-moz-transition', 'all ' + animationSpeed + 'ms ease');
    $(element).css('-ms-transition', 'all ' + animationSpeed + 'ms ease');
    $(element).css('-o-transition', 'all ' + animationSpeed + 'ms ease');
    $(element).css('transition', 'all ' + animationSpeed + 'ms ease');
}



