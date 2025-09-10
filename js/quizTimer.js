import { displayResults, updateQuiz } from './script.js';

class QuizTimer{
    constructor(inputTimer, dataStore){
        this.timer = null;
        this.size = 0;
        this.inputTimer = inputTimer;
        this.dataStore = dataStore;
    }

    startTimer() {
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
        this.size = 0;
        this.timer = setInterval(() => {
            this.size = this.size + 1;
            if (this.size > 100) {
                clearInterval(this.timer);
                this.size = 0;
                const nextQuestionIndex = this.dataStore.nextQuestion();
                const question = this.dataStore.getQuestion(nextQuestionIndex);
                const quizScore = this.dataStore.answers.length
                if (nextQuestionIndex >= this.dataStore.question_amount) {
                    displayResults(quizScore);
                } else {
                    updateQuiz(question.question, nextQuestionIndex + 1, question.options);
                }
            }
            this.inputTimer.value = this.size;
            setBackgroundSize(this.inputTimer);
        }, 100);    
    }

    stopTimer() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// TIMER UTILS
function setBackgroundSize(input) {
  input.style.setProperty("--background-size", `${getBackgroundSize(input)}%`);
}
function getBackgroundSize(input) {
  const min = +input.min || 0;
  const max = +input.max || 100;
  const value = +input.value;

  const size = (value - min) / (max - min) * 100;

  return size;
}

export default QuizTimer;