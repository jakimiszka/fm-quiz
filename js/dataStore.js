class DataStore{
    constructor(){
        this.data = null;
        this.category = '';
        this.questions = [];
        this.answers = [];
        this.quiz_counter = 0;
        this.question_amount = 0;
        this.init();
    }

    init(){
        fetch('https://jakimiszka.github.io/fm-quiz/data.json')
        .then(response => response.json())
        .then(data => {
            this.data = data;
            console.log('DataStore initialized');
        })
        .catch(error => console.error(error));
    }

    getData(){
        return this.data;
    }

    setCategory(category){
        this.category = category;
        return this.category;
    }

    getCategory(){
        return this.category;
    }

    getCategoryQuestions(category){
        return this.data.quizzes.filter(quiz => quiz.title === category)[0];
    }

    getQuestion(index){
        return this.getCategoryQuestions(this.category).questions[index];
    }

    setQuestionAmount(amount){
        this.question_amount = amount;
    }

    getCounter(){
        return this.quiz_counter;
    }

    nextQuestion(){
        if(this.quiz_counter < this.question_amount){
            this.quiz_counter++;
        }else{
            this.resetCounter();
        }
        return this.quiz_counter;
    }

    resetCounter(){
        this.quiz_counter = 0;
    }

    saveAnswer(answer){
        this.answers.push(answer);
    }
}

export default DataStore;