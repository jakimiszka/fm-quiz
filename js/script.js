const toggle = document.querySelector('input[type="checkbox"]');
const btns = document.querySelectorAll('.btn');
// title
const title = document.querySelector('.main-card__header--title');
const category_icon = document.querySelectorAll('.category_icon');
const category_title = document.querySelectorAll('.category_title');
// categories page
const title_card = document.querySelector('.main-card__main--wrapper');
const question_card = document.querySelector('.main-card__main--topics');
// quiz templates
const question = document.querySelector('.template-question');
const options = document.querySelector('.template-quiz');
//quiz question and number
const quiz_question = document.querySelector('.template-question--question');
const qestion_number = document.querySelector('.question_number');
// quiz answers
const answer_btns = document.querySelectorAll('.answer_btn');
const answer_content = document.querySelectorAll('.answer_content');
// answer icons
// const answer_icons = document.querySelector('.answer_icon');
// submit asnwer
const submit_btn = document.querySelector('.submit_btn');
// results
const results_title = document.querySelector('.template-results-title');
const results_score = document.querySelector('.template-results-score');
// score
const score_number = document.querySelector('.score--number');
// restart
const restart_btn = document.querySelector('.restart_btn');
// correct / wrong icon
const correct_icon_path = '../assets/images/icon-correct.svg';
const wrong_icon_path = '../assets/images/icon-error.svg';

// DATA STORE
import DataStore from './dataStore.js';
const dataStore = new DataStore();

function displayQuiz(){
    title_card.style.display = 'none';
    question_card.style.display = 'none';
    question.style.display = 'flex';
    options.style.display = 'flex';
    // TODO: logic to display quiz or categories
}

function displayResults(score){
    question.style.display = 'none';
    options.style.display = 'none';
    results_title.style.display = 'flex';
    results_score.style.display = 'flex';
    const quiz = dataStore.getCategoryQuestions(dataStore.getCategory());
    console.log(quiz);
    updateHeader(quiz.icon, quiz.title);
    score_number.textContent = score;
}

function updateHeader(imgPath, category){
    for(let i=0; i<category_icon.length; i++){
      category_icon[i].src = imgPath;
      category_title[i].textContent = category;
    }
    title.style.display = 'inline-flex';
}

function updateTitleAndQuiestion(question, number){
    quiz_question.textContent = question;
    qestion_number.textContent = number;
}

function updateOptions(options){
    resetOptions()
    answer_content.forEach((btn, index) => {
        btn.textContent = options[index];
    })
}

function resetOptions(){
    answer_btns.forEach(btn => {
        btn.classList.remove('selected');
        btn.classList.remove('correct');
        btn.classList.remove('wrong');
        const icon = btn.querySelector('.answer_icon');
        const answer_option = btn.querySelector('.asnwer_option');
        answer_option.classList.remove('correct_option');
        answer_option.classList.remove('wrong_option');
        icon.src = '';
        icon.style.display = 'none';
    });
}

// QUIZ CETEGORY
btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = dataStore.setCategory(btn.dataset.category);
        const quiz = dataStore.getCategoryQuestions(category);
        const question_index = dataStore.getCounter();
        dataStore.setQuestionAmount(quiz.questions.length);
        const question = dataStore.getQuestion(question_index);

        updateHeader(quiz.icon, quiz.title);
        updateTitleAndQuiestion(question.question, question_index + 1);
        updateOptions(question.options);

        displayQuiz();
    })
});

// PICK ANSWER
answer_btns.forEach(btn => {
    btn.addEventListener('click', (e)=>{
        btn.classList.toggle('selected');
        answer_btns.forEach(btn => {
            if(btn !== e.currentTarget){
                btn.classList.remove('selected');
            }
        });
    });
});

// DARK - LIGHT MODE
toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  console.log(theme);
  document.body.setAttribute('data-theme', theme);
});

restart_btn.addEventListener('click', ()=>{
    //reset everything
    dataStore.resetCounter();
    dataStore.answers = [];
    results_title.style.display = 'none';
    results_score.style.display = 'none';
    title_card.style.display = 'flex';
    question_card.style.display = 'flex';
    title.style.display = 'none';
});

// improve with first arg
function handleCorrectAnswer(optionBtn, isSelected, isCorrect){
    const selectedBtn = isSelected ? document.querySelector('.answer_btn.selected') : optionBtn;
    const answer_option = selectedBtn.querySelector('.asnwer_option');
    const answerIcon = selectedBtn.querySelector('.answer_icon');

    if(isCorrect){
        // show correct answer
        answerIcon.src = '../assets/images/icon-correct.svg';
        selectedBtn.classList.add('correct');
        answer_option.classList.add('correct_option');
        answerIcon.style.display = 'block';
    }else{
        // show wrong answer
        answerIcon.src = '../assets/images/icon-error.svg';
        selectedBtn.classList.add('wrong');
        answer_option.classList.add('wrong_option');
        answerIcon.style.display = 'block';
    }
}

submit_btn.addEventListener('click', ()=>{
    const question = dataStore.getQuestion(dataStore.getCounter());
    const questionAnswer = question.answer;
    const quiz_counter = dataStore.getCounter();
    const answerContent = document.querySelector('.selected > .answer_content').textContent;

    if(quiz_counter >= dataStore.question_amount - 1){
        console.log('quiz completed - ur score is ' + dataStore.answers.length);
        displayResults(dataStore.answers.length);
    }else{
        if(answerContent !== questionAnswer){
            handleCorrectAnswer(null ,true, false);

             // find good answer and highlight it
             answer_btns.forEach(option => {
                const answerContent = option.querySelector('.answer_content').textContent;
                if(answerContent === questionAnswer){
                    handleCorrectAnswer(option, false, true);
                }
            });
        }else{
            dataStore.saveAnswer(true);
            handleCorrectAnswer(null, true, true);
        }

        //TODO: freeze options during timeout
        setTimeout(() => {
            const question_index = dataStore.nextQuestion();
            const question = dataStore.getQuestion(question_index)
            updateTitleAndQuiestion(question.question, question_index + 1);
            updateOptions(question.options);
        }, 2000);
        
    }
});

