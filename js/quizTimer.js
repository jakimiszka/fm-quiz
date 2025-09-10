import { displayResults, updateTitleAndQuiestion, updateOptions, setBackgroundSize } from './script.js';

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
                const nextQuestionIndex = dataStore.nextQuestion();
                const question = dataStore.getQuestion(nextQuestionIndex);
                const quizScore = dataStore.answers.length
                if (nextQuestionIndex >= dataStore.question_amount) {
                    displayResults(quizScore);
                } else {
                    updateTitleAndQuiestion(question.question, nextQuestionIndex + 1);
                    updateOptions(question.options);
                }
            }
            this.inputTimer.value = this.size;
            setBackgroundSize(this.inputTimer);
            console.log(this.size);
        }, 100);    
    }

    stopTimer() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}




// let timer = null;
// let size = 0;

// function startTimer() {
//   if (timer !== null) {
//     clearInterval(timer);
//   }
//   size = 0;
//   timer = setInterval(() => {
//     size = size + 1;
//     if (size > 100) {
//       clearInterval(timer);
//       size = 0;
//       const nextQuestionIndex = dataStore.nextQuestion();
//       const question = dataStore.getQuestion(nextQuestionIndex);
//       if (nextQuestionIndex >= dataStore.question_amount) {
//         console.log('quiz completed - ur score is ' + dataStore.answers.length);
//         displayResults(dataStore.answers.length);
//       } else {
//         updateTitleAndQuiestion(question.question, nextQuestionIndex + 1);
//         updateOptions(question.options);
//       }
//     }
//     inputTimer.value = size;
//     setBackgroundSize(inputTimer);
//     console.log(size);
//   }, 100);
// }

// function stopTimer() {
//   if (timer !== null) {
//     clearInterval(timer);
//     timer = null;
//   }
// }

export default QuizTimer;