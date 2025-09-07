const toggle = document.querySelector('input[type="checkbox"]');
const btns = document.querySelectorAll('.btn');
// title
const title = document.querySelector('.main-card__header--title');
const category_icon = document.querySelector('.category_icon');
const category_title = document.querySelector('.category_title');
// home page
const title_card = document.querySelector('.main-card__main--wrapper');
const question_card = document.querySelector('.main-card__main--topics');
// quiz templates
const question = document.querySelector('.template-qestion');
const options = document.querySelector('.template-quiz');
//quiz question and number
const quiz_question = document.querySelector('.quiz_question');
const qestion_number = document.querySelector('.question_number');
// quiz answers
const answer_btns = document.querySelectorAll('.answer_btn');

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

// args: category, title, questions
function displayQuiz(){
    title_card.style.display = 'none';
    question_card.style.display = 'none';
    question.style.display = 'flex';
    options.style.display = 'flex';
}

function updateTitle(imgPath, category){
    category_icon.src = imgPath;
    category_title.textContent = category;
    title.style.display = 'inline-flex';
}

function updateTitleAndQuiestion(question, number){
    quiz_question.textContent = question;
    qestion_number.textContent = number;
}

function updateOptions(options){
    answer_btns.forEach((btn, index) => {
        btn.textContent = options[index];
    })
}

function storeAnswer(question_index, answer){
    answers.push({
        index: question_index,
        answer: answer
    });
}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = DataStore.setCategory(btn.dataset.category);
        const quiz = DataStore.getCategoryQuestions(category);
        const question_index = DataStore.getCounter();
        DataStore.setQuestionAmount(quiz.questions.length);
        const question = quiz.questions[question_index];
        console.log(question);

        updateTitle(quiz.icon, quiz.title);
        updateTitleAndQuiestion(question.question, question_index + 1);
        updateOptions(question.options);

        displayQuiz();
    })
})

answer_btns.forEach(btn => {
    btn.addEventListener('click', (e)=>{
        const quiz_counter = DataStore.getCounter();
        if(quiz_counter >= DataStore.question_amount - 1){
            console.log('quiz completed - ur score is ' + DataStore.answers.length);
            //TODO: summerize score
        }else{
            const answer = {
                index: quiz_counter,
                answer: e.target.textContent
            }
            DataStore.saveAnswer(answer);
            //TODO: check answer && accumulate scores
            const question_index = DataStore.nextQuestion();
            const question = DataStore.getQuestion(question_index)
            updateTitleAndQuiestion(question.question, question_index + 1);
            updateOptions(question.options);
        }
    });
});

toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  console.log(theme);
  document.body.setAttribute('data-theme', theme);
});


