var steps = [];
var currentStep = 0;
var thisStep;
var thisSubStep;

$(document).ready(function () {

    var q;

    q = createQuestion('Choose your RACE');
    q.addAnswerWithSub('Human', 'What kind of HUMAN?', ['Desert Nomad', 'Ice Barbarian', 'Empire Citizen']);
    q.addAnswerWithSub('Elf', 'What kind of ELF?', ['Dark Drow', 'Sylvan Elf', 'Sea Elf', 'High Elf']);
    q.addAnswerWithSub('Dwarf', 'What kind of DWARF?', ['Dark Duergar', 'Mountain Dwarf', 'Mechanical Dwarf']);

    steps.push(q);

    chainIn(['.header h1', '.header h4', '.intro-title', '.intro-features', '.intro-button']);

    $('#btnstart').click(function () {
        $('.intro').fadeOut(300, function () {
            $('.header').addClass('docked');

            initStep(currentStep);

            setTimeout(function () {
                chainIn(['.header-right', '.progress-completed', '.step-basic', '.next-step']);
            }, 1000);
        });

    });

    $('#next-section-button').click(function () {
        event.preventDefault();
        if (!$(this).hasClass('disabled')) {
            console.log('next section');
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
            $('#next-section-button').removeClass('disabled');
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

var initStep = function (stepNo) {
    thisStep = steps[stepNo];
    console.log(thisStep);

    $('#next-section-button').addClass('disabled');
    $('.step-basic h2').html(thisStep.question);
    $('.step-basic .btn-group').html("");
    $.each(thisStep.answers, function (index, value) {
        $('.step-basic .btn-group').append('<a class="btn btn-custom">' + value.answer + '</a>');
    });
    
}

var initSubStep = function (question) {
    thisSubStep = question;
    console.log(question);

    $('#next-section-button').addClass('disabled');
    $('.step-basic-sub').fadeOut(300, function () {
        $('.step-basic-sub h3').html(question.question);
        $('.step-basic-sub .btn-group').html("");
        $.each(question.answers, function (index, value) {
            $('.step-basic-sub .btn-group').append('<a class="btn btn-custom">' + value.answer + '</a>');
        });

        chainIn(['.step-basic-sub']);
    });

}

var chainIn = function (toAnimate, ix) {
    var animateSpeed = 1500;

    if (typeof ix === 'undefined') {
        ix = 0;
    }

    if (toAnimate[ix]) {
        if (typeof toAnimate[ix] === 'string') {
            $(toAnimate[ix]).fadeIn(animateSpeed, function () { chainIn(toAnimate, ix + 1) });
        } 
    }
};



