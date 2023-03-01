const LottoMachine = require('../domain/LottoMachine.js');
const view = require('../view/view.js');
const { moneyValidate, winningAndBonusNumberValidate } = require('../utils/validation.js');
class ControllerLottoWeb {
  money;

  constructor() {
    this.money = 0;
    this.lottoMachine = new LottoMachine();
    this.initializeButtonEvents();
  }

  initializeButtonEvents() {
    document.querySelector('.inputLabel').addEventListener('submit', this.handlePurchaseButtonClick);

    document.querySelector('.winningLotto').addEventListener('submit', this.handleResultButtonClick);

    document.querySelector('.close').addEventListener('click', this.handleCloseModalButtonClick);

    document.querySelector('.restart').addEventListener('click', this.handleRestartButtonClick);

    document.querySelector('.modal').addEventListener('click', e => {
      this.handleCloseModalOutside(e)
    })

    window.addEventListener('keydown', e => {
      this.handleCloseModalEsc(e)
    });
  }

  handlePurchaseButtonClick = () => {
    try {
      event.preventDefault();
      this.money = view.readMoney();

      moneyValidate(this.money);
      this.buyLottos(this.money);
      this.disablePuchaseButton();
      this.focusWinningNumber();
    } catch (error) {
      alert(error.message);
    }
  };

  buyLottos(money) {
    this.printPurchasedLottoNumberToView();

    this.lottoMachine.makeLotto(money);
    view.printLottoListElements(this.lottoMachine.lottoNumber);
    view.printAllLotto();
  }

  disablePuchaseButton() {
    const button = document.querySelector('.buy');
    button.disabled = true;
    button.style.background = 'gray';
  }

  focusWinningNumber() {
    document.querySelector('.winning').focus();
  }

  printPurchasedLottoNumberToView = () => {
    const lottoNumber = this.lottoMachine.countLotto(this.money);
    view.printPurchasedLottoNumber(lottoNumber);
  };

  handleResultButtonClick = () => {
    try {
      event.preventDefault();
      const winningNumber = view.readWinningNumber();
      const bonusNumber = view.readBonusNumber();

      winningAndBonusNumberValidate(winningNumber, bonusNumber);
      this.displayResult(winningNumber, bonusNumber);
    } catch (error) {
      alert(error.message);
    }
  };

  displayResult(winningNumber, bonusNumber) {
    const result = this.lottoMachine.getWinningStatus(winningNumber, bonusNumber);

    view.printResultLotto(result);
    view.printProfitResult(this.lottoMachine.getProfitRate(this.money, result).toFixed(2));
    view.showModal();
  }

  handleRestartButtonClick = () => {
    view.inputReset();
    view.closeModal();

    view.resetLottoList();
    view.hideBuyText();
    view.hidePuchase();
  };

  handleCloseModalButtonClick = () => {
    view.closeModal();
  };

  handleCloseModalEsc(e){
    if (e.keyCode == 27) view.closeModal();
  }
  
  handleCloseModalOutside(e){
    if(e.target === e.currentTarget) view.closeModal()
  }
}

module.exports = ControllerLottoWeb;
