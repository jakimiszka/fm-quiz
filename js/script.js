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

let quiz_counter = 0;
let points = 0;
let answers = [];

const DataStore = {
  data: null,
  questions: [],

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

  getCategoryQuestions(category){
    return this.data.quizzes.filter(quiz => quiz.title === category)[0];
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

function updateQuiz(question, number){
    quiz_question.textContent = question;
    qestion_number.textContent = number;
}

function updateAnswers(options){
    answer_btns.forEach((btn, index) => {
        btn.textContent = options[index];
    })
}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        const quiz = DataStore.getCategoryQuestions(category);
        const question = quiz.questions[quiz_counter];
        console.log(question);

        updateTitle(quiz.icon, quiz.title);
        updateQuiz(question.question, Number(quiz_counter)+1);
        updateAnswers(question.options);

        displayQuiz();
        quiz_counter++;
    })
})

answer_btns.forEach(btn => {
    btn.addEventListener('click', (e)=>{
        let answer = {
            number: Number(qestion_number.textContent),
            answer: e.target.textContent
        }
        answers.push(answer);
        // display next question
    });
});

toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  console.log(theme);
  document.body.setAttribute('data-theme', theme);
});


