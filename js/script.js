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

const DataStore = {
  data: null,
  questions: [],
  category: '',
  answers: [],
  quiz_counter: 0,
  question_amount: 0,

  init() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        this.data = data;
    })
    .catch(error => console.error(error));
  },

  getData() {
    return this.data;
  },
  setCategory(category){
    this.category = category;
    return this.category;
  },
  getCategory(){
    return this.category;
  },
  getCategoryQuestions(category){
    return this.data.quizzes.filter(quiz => quiz.title === category)[0];
  },
  getQuestion(index){
    return this.getCategoryQuestions(this.category).questions[index];
  },
  setQuestionAmount(amount){
    this.question_amount = amount;
  },

  getCounter(){
    return this.quiz_counter;
  },
  nextQuestion(){
    if(this.quiz_counter <= this.question_amount){
        this.quiz_counter++;
    }else{
        this.resetCounter();
    }
    return this.quiz_counter;
  },
  resetCounter(){
    this.quiz_counter = 0;
  },
  saveAnswer(answer){
    this.answers.push(answer);
  }
};

DataStore.init();

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
    const quiz = DataStore.getCategoryQuestions(DataStore.getCategory());
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
        const category = DataStore.setCategory(btn.dataset.category);
        const quiz = DataStore.getCategoryQuestions(category);
        const question_index = DataStore.getCounter();
        DataStore.setQuestionAmount(quiz.questions.length);
        const question = DataStore.getQuestion(question_index);

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
    DataStore.resetCounter();
    DataStore.answers = [];
    results_title.style.display = 'none';
    results_score.style.display = 'none';
    title_card.style.display = 'flex';
    question_card.style.display = 'flex';
    title.style.display = 'none';
});

submit_btn.addEventListener('click', ()=>{
    const question = DataStore.getQuestion(DataStore.getCounter());
    const questionAnswer = question.answer;
    const quiz_counter = DataStore.getCounter();
    const answer_option = document.querySelector('.selected > .asnwer_option');
    const selectedBtn = document.querySelector('.answer_btn.selected');
    const answerContent = document.querySelector('.selected > .answer_content').textContent;
    const answerIcon = document.querySelector('.selected > .answer_icon');

    if(quiz_counter >= DataStore.question_amount - 1){
        console.log('quiz completed - ur score is ' + DataStore.answers.length);
        displayResults(DataStore.answers.length);
    }else{
        if(answerContent !== questionAnswer){
            answerIcon.src = '../assets/images/icon-error.svg';
            selectedBtn.classList.add('wrong');
            console.log(answerIcon);
            answer_option.classList.add('wrong_option');
            answerIcon.style.display = 'block';

             answer_btns.forEach((option, index) => {
                const answerContent = option.querySelector('.answer_content').textContent;
                if(answerContent === questionAnswer){
                    const correctBtn = option.querySelector('.asnwer_option');
                    console.log('1',correctBtn);
                    const correctIcon = option.querySelector('.answer_icon');
                    console.log('2',correctIcon);
                    correctIcon.src = '../assets/images/icon-correct.svg';
                    correctBtn.classList.add('correct_option');
                    option.classList.add('correct');
                    correctIcon.style.display = 'block';
                }
            });
        }else{
            answerIcon.src = '../assets/images/icon-correct.svg';
            selectedBtn.classList.add('correct');
            DataStore.saveAnswer(true);
            answer_option.classList.add('correct_option');
            answerIcon.style.display = 'block';
        }

        setTimeout(() => {
            const question_index = DataStore.nextQuestion();
            const question = DataStore.getQuestion(question_index)
            updateTitleAndQuiestion(question.question, question_index + 1);
            updateOptions(question.options);
        }, 2000);
        
    }
});

