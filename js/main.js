var ANIMATE_SPEED = 1500;
var SPEEDYMODE = true;
if (SPEEDYMODE) {
    ANIMATE_SPEED = ANIMATE_SPEED / 10;
}
var ANIMATE_SPEED_OUT = ANIMATE_SPEED / 5;

var steps = [];
var currentStep = 0;
var thisStep;
var thisSubStep;
var canProceed = false;
var percentageComplete = 0;
var totalSteps = 0;

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

    totalSteps = steps.length;

    chainIn(['.header h1', '.header h4', '.intro-title', '.intro-features', '.intro-button']);

    $('#btnstart').click(function () {
        chainOut(['.intro-button', '.intro-features', '.intro-title']);
        setTimeout(function () {
            $('.intro').hide();
            $('.steps-holder').show();
            setTransition('.header', ANIMATE_SPEED);
            $('.header').addClass('docked');

            setTimeout(function () {
                chainIn(['.header-right', '.progress-completed', '.next-step']);
                setTimeout(function () {
                    initStep(currentStep);
                }, ANIMATE_SPEED * 2);
            }, ANIMATE_SPEED);
        }, ANIMATE_SPEED_OUT * 3);

    });

    $('#next-section-button').click(function () {
        event.preventDefault();

        if (canProceed) {
            canProceed = false;
            
            $('.next-section-holder').removeClass('fading-in');
            setTransition('.your-answer-holder', ANIMATE_SPEED);
            $('.your-answer-holder').addClass('saving');
            chainOut(['.step-basic-sub', '.step-basic', '.progress-completed .text']);
            currentStep++;
            percentageComplete = currentStep / totalSteps;
            setTransition('.progress-completed .bar', ANIMATE_SPEED);
            $('.progress-completed .bar').css('width', percentageComplete * 100 + '%');
            
            setTimeout(function () {
                setTransition('.your-answer-holder', 0);
                $('.your-answer-holder').removeClass('fading-in').removeClass('saving');

                initStep(currentStep);
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
        
        //console.log('clicked on', thisAnswer);
        if (thisAnswer.subQuestion !== undefined) {
            //console.log("subquestion: ", thisAnswer.subQuestion);
            setTransition('.step-basic', ANIMATE_SPEED_OUT);
            $(this).closest('.step-basic').addClass('docked');
            initSubStep(thisAnswer.subQuestion);
        } else {
            //console.log("subquestion answered");
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
}

var checkAnswer = function (thisAnswer) {
    //console.log(thisAnswer.answer);
    $('.your-answer-holder h3').html("You chose <b>" + thisAnswer.answer + "</b>");
    chainIn(['.your-answer-holder', '.next-section-holder']);
    canProceed = true;
}

var initStep = function (stepNo) {
    if (stepNo < steps.length) {
        thisStep = steps[stepNo];
        //console.log(thisStep);

        $('.progress-completed .section-number').text('Section ' + (stepNo + 1) + ' - ');
        $('.progress-completed .percentage-complete').text('Complete ' + (percentageComplete * 100) + '%');
        chainIn(['.progress-completed .text']);

        resetAnswer();
        $('.step-basic').removeClass('docked');
        $('.step-basic h2').html(thisStep.question);
        $('.step-basic .btn-group').html("");
        $.each(thisStep.answers, function (index, value) {
            $('.step-basic .btn-group').append('<a class="btn btn-custom">' + value.answer + '</a>');
        });

        chainIn(['.step-basic']);
    } else {
        $('.progress-completed .section-number').text('');
        $('.progress-completed .percentage-complete').text('Complete ' + (percentageComplete * 100) + '%');
        chainIn(['.progress-completed .text']);
    }
}

var initSubStep = function (question) {
    thisSubStep = question;

    resetAnswer();
    chainOut(['.step-basic-sub']);
    setTimeout(function () {
        $('.step-basic-sub h2').html(question.question);
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



