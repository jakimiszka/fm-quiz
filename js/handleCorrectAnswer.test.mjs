import {handleCorrectAnswer} from './script.js';

describe('handleCorrectAnswer function', () => {
  let optionBtn;
  let answer_option;
  let answerIcon;

  beforeEach(() => {
    optionBtn = document.createElement('button');
    optionBtn.innerHTML = `
      <div class="asnwer_option">A</div>
      <div class="answer_content">Answer content</div>
      <img class="answer_icon" src="" alt="anwer icon">
    `;
    document.body.appendChild(optionBtn);

    answer_option = optionBtn.querySelector('.asnwer_option');
    answerIcon = optionBtn.querySelector('.answer_icon');
  });

  afterEach(() => {
    document.body.removeChild(optionBtn);
  });

  it('should add correct class to option button when answer is correct', () => {
    handleCorrectAnswer(optionBtn, true);
    expect(optionBtn.classList.contains('correct')).toBe(true);
  });

  it('should add correct class to answer option when answer is correct', () => {
    handleCorrectAnswer(optionBtn, true);
    expect(answer_option.classList.contains('correct_option')).toBe(true);
  });

  it('should set answer icon src to correct icon when answer is correct', () => {
    handleCorrectAnswer(optionBtn, true);
    expect(answerIcon.src).toContain('icon-correct.svg');
  });

  it('should add wrong class to option button when answer is incorrect', () => {
    handleCorrectAnswer(optionBtn, false);
    expect(optionBtn.classList.contains('wrong')).toBe(true);
  });

  it('should add wrong class to answer option when answer is incorrect', () => {
    handleCorrectAnswer(optionBtn, false);
    expect(answer_option.classList.contains('wrong_option')).toBe(true);
  });

  it('should set answer icon src to wrong icon when answer is incorrect', () => {
    handleCorrectAnswer(optionBtn, false);
    expect(answerIcon.src).toContain('icon-error.svg');
  });
});

export {};