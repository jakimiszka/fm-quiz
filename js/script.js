import DataStore from "./dataStore.js";
import QuizTimer from "./quizTimer.js";

const toggle = document.querySelector('input[type="checkbox"]');
const btns = document.querySelectorAll(".btn");
const title = document.querySelector(".main-card__header--title");
const category_icon = document.querySelectorAll(".category_icon");
const category_title = document.querySelectorAll(".category_title");
const title_card = document.querySelector(".main-card__main--wrapper");
const question_card = document.querySelector(".main-card__main--topics");
const question = document.querySelector(".template-question");
const options = document.querySelector(".template-quiz");
const quiz_question = document.querySelector(".template-question--question");
const qestion_number = document.querySelector(".question_number");
const answer_btns = document.querySelectorAll(".answer_btn");
const answer_content = document.querySelectorAll(".answer_content");
const submit_btn = document.querySelector(".submit_btn");
const results_title = document.querySelector(".template-results-title");
const results_score = document.querySelector(".template-results-score");
const score_number = document.querySelector(".score--number");
const restart_btn = document.querySelector(".restart_btn");
const submitValidation = document.querySelector(".submitValidation");
const inputTimer = document.querySelector("input[type='range']");

const dataStore = new DataStore();
let quizTimer = new QuizTimer(inputTimer, dataStore);

function displayQuiz() {
  title_card.style.display = "none";
  question_card.style.display = "none";
  question.style.display = "flex";
  options.style.display = "flex";
}

function displayResults(score) {
  question.style.display = "none";
  options.style.display = "none";
  results_title.style.display = "flex";
  results_score.style.display = "flex";
  const quiz = dataStore.getCategoryQuestions(dataStore.getCategory());
  updateHeader(quiz.icon, quiz.title);
  score_number.textContent = score;
}

function updateHeader(imgPath, category) {
  for (let i = 0; i < category_icon.length; i++) {
    category_icon[i].src = imgPath;
    category_title[i].textContent = category;
  }
  title.style.display = "inline-flex";
}

// UPDATE QUESTION AND OPTIONS
function updateQuiz(question, number, options) {
  quiz_question.textContent = question;
  qestion_number.textContent = number;
  resetOptions();
  answer_content.forEach((btn, index) => {
    btn.textContent = options[index];
  });
  quizTimer.startTimer();
}

// RESET OPTIONS
function resetOptions() {
  answer_btns.forEach((btn) => {
    btn.classList.remove("selected");
    btn.classList.remove("correct");
    btn.classList.remove("wrong");
    const icon = btn.querySelector(".answer_icon");
    const answer_option = btn.querySelector(".asnwer_option");
    answer_option.classList.remove("correct_option");
    answer_option.classList.remove("wrong_option");
    icon.src = "";
    icon.style.display = "none";
  });
}

// QUIZ CETEGORY
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = dataStore.setCategory(btn.dataset.category);
    const quiz = dataStore.getCategoryQuestions(category);
    const question_index = dataStore.getCounter();
    dataStore.setQuestionAmount(quiz.questions.length);
    const question = dataStore.getQuestion(question_index);

    updateHeader(quiz.icon, quiz.title);
    updateQuiz(question.question, question_index + 1, question.options);
    displayQuiz();
  });
});

// PICK ANSWER
answer_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    submit_btn.disabled = false;
    btn.classList.toggle("selected");
    submitValidation.style.display = "none";
    answer_btns.forEach((btn) => {
      if (btn !== e.currentTarget) {
        btn.classList.remove("selected");
      }
    });
  });
});

// DARK - LIGHT MODE
toggle.addEventListener("change", () => {
  const theme = toggle.checked ? "dark" : "light";
  document.body.setAttribute("data-theme", theme);
});

// PLAY AGAIN
restart_btn.addEventListener("click", () => {
  dataStore.resetCounter();
  dataStore.answers = [];
  results_title.style.display = "none";
  results_score.style.display = "none";
  title_card.style.display = "flex";
  question_card.style.display = "flex";
  title.style.display = "none";
});

// HANDLE CORRECT - WRONG ANSWER
function handleCorrectAnswer(optionBtn, isCorrect) {
  const answer_option = optionBtn.querySelector(".asnwer_option");
  const answerIcon = optionBtn.querySelector(".answer_icon");
  if (isCorrect) {
    answerIcon.src = "../assets/images/icon-correct.svg";
    optionBtn.classList.add("correct");
    answer_option.classList.add("correct_option");
    answerIcon.style.display = "block";
  } else {
    answerIcon.src = "../assets/images/icon-error.svg";
    optionBtn.classList.add("wrong");
    answer_option.classList.add("wrong_option");
    answerIcon.style.display = "block";
  }
}

// SUBMIT ANSWER
submit_btn.addEventListener("click", (e) => {
  submit_btn.disabled = true;
  const question = dataStore.getQuestion(dataStore.getCounter());
  const questionAnswer = question.answer;
  const quiz_counter = dataStore.getCounter();

  let selectedOption = null;
  const options = document.querySelectorAll(".answer_btn");
  options.forEach((option) => {
    if (option.classList.contains("selected")) {
      selectedOption = option;
    }
  });
  const answerContent = !!selectedOption 
        ? selectedOption.querySelector(".answer_content").textContent 
        : null;

  if (selectedOption == null) {
    submitValidation.style.display = "flex";
    return;
  } else {
    quizTimer.stopTimer();
    if (answerContent === questionAnswer) {
      dataStore.saveAnswer(true);
      handleCorrectAnswer(selectedOption, true);
    } else {
      handleCorrectAnswer(selectedOption, false);
      options.forEach((option) => {
        const optionContent = option.querySelector(".answer_content").textContent;
        if (optionContent === questionAnswer) {
          handleCorrectAnswer(option, true);
        }
      });
    }
    // TODO: any info to user that next question is going to be loaded?
    setTimeout(() => {
      const question_index = dataStore.nextQuestion();
      const question = dataStore.getQuestion(question_index);
      if (quiz_counter >= dataStore.question_amount - 1) {
        displayResults(dataStore.answers.length);
      } else {
        updateQuiz(question.question, question_index + 1, question.options);
      }
      submit_btn.disabled = false;
    }, 2000);
  }
});

export { displayResults, updateQuiz };