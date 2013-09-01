var ANIMATE_SPEED = 1500;
var ROLLBACK_MODIFIER = 5;
var SPEEDYMODE = true;
if (SPEEDYMODE) {
    ANIMATE_SPEED = ANIMATE_SPEED / 10;
}
var ANIMATE_SPEED_OUT = ANIMATE_SPEED / 5;

var steps = [];
var answers = [];
var currentStep = 0;
var thisStep;
var thisSubStep;
var lastQuestionTitle;
var lastAnswer;
var canProceed = false;
var isFinished = false;
var percentageComplete = 0;
var totalSteps = 0;

$(document).ready(function () {

    var q;

    q = createQuestion('RACE');
    q.addAnswerWithSub('Human', 'What kind of HUMAN?', ['Desert Nomad', 'Ice Barbarian', 'Empire Citizen', 'Jungle Tribesman', 'Plainswalker']);
    q.addAnswerWithSub('Elf', 'What kind of ELF?', ['Dark Drow', 'Sylvan Elf', 'Sea Elf', 'High Elf', 'Cosplay Elf']);
    q.addAnswerWithSub('Dwarf', 'What kind of DWARF?', ['Dark Duergar', 'Mountain Dwarf', 'Mechanical Dwarf', 'Stereotypical Dwarf']);
    q.addAnswerWithSub('Gnome', 'What kind of GNOME?', ['Jungle Gnome', 'Sea Gnome', 'Giant Gnome', 'Chaos Gnome', 'Garden Gnome']);
    q.addAnswerWithSub('Halfling', 'What kind of HALFLING?', ['Hairfoot Halfling', 'Stout Halfling', 'Tallfellow Halfling', 'Half-Halfling']);
    q.addAnswerWithSub('Half-Orc', 'What kind of HALF-ORC?', ['Hairy Half-Orc', 'Ugly Half-Orc', 'Smelly Half-Orc']);
    q.addAnswerWithSub('Lycanthrope', 'What kind of LYCANTHROPE?', ['Werewolf', 'Werebear', 'Weretiger', 'Wereboar', 'Wererat', 'Wereshark']);
    q.addAnswerWithSub('Golem', 'What kind of GOLEM?', ['Flesh Golem', 'Stone Golem', 'Iron Golem', 'Clay Golem', 'Brass Golem', 'Poop Golem']);
    q.addAnswerWithSub('Demon', 'What kind of DEMON?', ['Succubus', 'Vrock', 'Quasit', 'Nalfeshnee', 'Dretch', 'Balor']);
    steps.push(q);

    q = createQuestion('SEX');
    q.addAnswersArray(['Male', 'Female', 'It\'s Complicated']);
    steps.push(q);

    q = createQuestion('CLASS');
    q.addAnswerWithSub('Fighter', 'What kind of FIGHTER?', ['Warrior', 'Paladin', 'Thug', 'Barbarian', 'Ranger', 'Monk', 'Cavalier', 'Blackguard']);
    q.addAnswerWithSub('Magician', 'What kind of MAGICIAN?', ['Wizard', 'Illusionist', 'Necromancer', 'Abjurer', 'Sorcerer', 'Sourcerer', 'Emomancer', 'Mathemagician']);
    q.addAnswerWithSub('Priest', 'What kind of PRIEST?', ['Cleric', 'Druid', 'Warpriest', 'Witch']);
    q.addAnswerWithSub('Rogue', 'What kind of Rogue?', ['Thief', 'Assassin', 'Bard', 'Swashbuckler', 'Cat Burglar', 'Scout', 'Rouge']);
    steps.push(q);

    q = createQuestion('NAME');
    q.type = 'textbox';
    steps.push(q);

    q = createQuestion('ALIGNMENT');
    q.addAnswersArray(['Lawful Good', 'Chaotic Good', 'Neutral', 'Lawful Evil', 'Chaotic Evil']);
    steps.push(q);

    //roll for stats here

    /*
    q = createQuestion('Choose your BIRTH SIGN');
    q.addAnswerWithSub('Omen', 'What kind of OMEN?', ['Thunder', 'Ice', 'Empire', 'Jungle', 'Plainswalker']);
    q.addAnswerWithSub('Starsign', 'What kind of FIGHTER?', ['Desert', 'Ice', 'Empire', 'Jungle', 'Plainswalker']);
    q.addAnswerWithSub('Fighter', 'What kind of FIGHTER?', ['Desert', 'Ice', 'Empire', 'Jungle', 'Plainswalker']);
    steps.push(q);
    */

    q = createQuestion('PERSONALITY');
    q.addAnswersArray(['Optimistic', 'Unscrupulous', 'Spontaneous', 'Cautious', 'Stubborn', 'Agreeable', 'Reserved', 'Gruff']);
    steps.push(q);

    q = createQuestion('MOTIVATION');
    q.addAnswersArray(['Honor', 'Wealth', 'Service', 'Hedonism', 'Enslavement', 'Geas', 'Power', 'Education', 'Liberation']);
    steps.push(q);

    q = createQuestion('SENSE OF HUMOUR');
    q.addAnswersArray(['Crude', 'Dry', 'Slapstick', 'Cynical', 'Pranks', 'Mean-Spirited', 'None']);
    steps.push(q);

    /*
    q = createQuestion('Choose your CLASS');
    q.addAnswerWithSub('Fighter', 'What kind of FIGHTER?', ['Desert', 'Ice', 'Empire', 'Jungle', 'Plainswalker']);
    steps.push(q);
    */

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
                }, ANIMATE_SPEED * 3);
            }, ANIMATE_SPEED);
        }, ANIMATE_SPEED_OUT * 3);
    });
    //$('#btnstart').click();

    $('#give-up-button').click(function (e) {
        e.preventDefault();

        if (!isFinished) {
            showEndGame();
        }

        return false;
    });

    $('#next-section-button').click(function (e) {
        e.preventDefault();

        if (canProceed) {
            canProceed = false;

            //random chance of rollback
            var chance = parseInt(Math.random() * (totalSteps + ROLLBACK_MODIFIER));
            console.log('chance: ' + chance + ' < currentStep: ' + currentStep + ' ?');

            if (chance < currentStep) {
                rollbackToStep(chance);
            } else {
                answers.push(lastAnswer);
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

    $('.step-basic .text-holder input[type=text]').on('input change keydown', function () {
        if ($(this).val().length > 0) {
            checkAnswer({ answer: $(this).val() }); 
        }
    });

});

var createQuestion = function (question) {
    return { question: question, answers: [], type: 'multiple-choice', addAnswersArray: addAnswersArray, addAnswer: addAnswer, addAnswerWithSub: addAnswerWithSub };
}

var createAnswer = function (forQuestion, answer, subQuestion) {
    var thisAnswer = { forQuestion: forQuestion, answer: answer, subQuestion: subQuestion };
    forQuestion.answers.push(thisAnswer);
    return thisAnswer;
}

var addAnswer = function (answer) {
    var q = this;
    createAnswer(q, answer);
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
    lastAnswer = { question: lastQuestionTitle, answer: thisAnswer.answer };

    $('.your-answer-holder h3').html("You chose <b>" + thisAnswer.answer + "</b>");
    chainIn(['.your-answer-holder', '.next-section-holder']);
    canProceed = true;
}

var rollbackToStep = function (newStep) {
    chainOut(['.your-answer-holder', '.step-basic-sub', '.step-basic', '.next-section-holder', '.progress-completed .text']);
    setTimeout(function () {
        $('.errors h3').text('Sorry, you can\'t have ' + lastAnswer.question + ':' + lastAnswer.answer + ' with ' + answers[newStep].question + ':' + answers[newStep].answer + '. Rolling back.');
        chainIn(['.errors']); 
        setTimeout(function () {
            chainOut(['.errors']);
            answers.splice(newStep, answers.length);
            currentStep = newStep;
            percentageComplete = currentStep / totalSteps;
            $('.progress-completed .bar').css('width', percentageComplete * 100 + '%');
            initStep(currentStep);
        }, ANIMATE_SPEED * 5); 
    }, ANIMATE_SPEED_OUT * 3);
}

var initStep = function (stepNo) {
    if (stepNo < steps.length) {
        thisStep = steps[stepNo];
        thisSubStep = null;
        //console.log(thisStep);

        $('.progress-completed .section-number').text('Section ' + (stepNo + 1) + ' - ');
        $('.progress-completed .percentage-complete').text('Complete ' + (percentageComplete * 100).toFixed(2) + '%');

        resetAnswer();
        lastQuestionTitle = thisStep.question;
        $('.step-basic').removeClass('docked');
        $('.step-basic h2').html('Choose your ' + thisStep.question);
        $('.step-basic .btn-group').html("");
        $('.step-basic .btn-group').hide();
        $.each(thisStep.answers, function (index, value) {
            $('.step-basic .btn-group').show();
            $('.step-basic .btn-group').append('<a class="btn btn-custom">' + value.answer + '</a>');
        });
        $('.step-basic .text-holder').hide();
        $('.step-basic .text-holder input').val('');
        if (thisStep.type === 'textbox') {
            $('.step-basic .text-holder').show();
        }

        chainIn(['.progress-completed .text', '.step-basic']);
    } else {
        $('.progress-completed .section-number').text('');
        $('.progress-completed .percentage-complete').text('Complete ' + (percentageComplete * 100) + '%');
        chainIn(['.progress-completed .text']);
        showEndGame();
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

var showEndGame = function () {
    isFinished = true;
    chainOut(['.step-basic-sub', '.step-basic', '.next-step']);
    $('.game-over h3 b').text((percentageComplete * 100).toFixed(2) + '%');
    chainIn(['.game-over']);
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
    $(element).css('-webkit-transition', 'all ' + animationSpeed + 'ms ease, opacity ' + animationSpeed + 'ms ease-out ' + animationSpeed / 4 + 'ms');
    //$(element).css('-moz-transition', 'all ' + animationSpeed + 'ms ease, opacity ' + animationSpeed + 'ms ease-out ' + animationSpeed / 4 + 'ms');
    $(element).css('-moz-transition', 'all ' + animationSpeed + 'ms ease'); //workaround for FF
    $(element).css('-ms-transition', 'all ' + animationSpeed + 'ms ease, opacity ' + animationSpeed + 'ms ease-out ' + animationSpeed / 4 + 'ms');
    $(element).css('-o-transition', 'all ' + animationSpeed + 'ms ease, opacity ' + animationSpeed + 'ms ease-out ' + animationSpeed / 4 + 'ms');
    $(element).css('transition', 'all ' + animationSpeed + 'ms ease, opacity ' + animationSpeed + 'ms ease-out ' + animationSpeed / 4 + 'ms');
}



