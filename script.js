let basicTarget = Math.floor(Math.random() * 100) + 1;
let advancedTarget = Math.floor(Math.random() * 100) + 1;
let basicHistory = [];
let advancedHistory = [];
let consecutiveGuesses = { count: 0, value: null };
let netCenter = null;
let fishPositions = [];

function adjustTarget(target, guess) {
    if (netCenter === null) {
        const difference = Math.abs(target - guess);
        if (difference <= 7) {
            netCenter = target;
            return target;
        }
        const adjustment = Math.floor(Math.random() * 5) + 3; // 改为3到7之间
        const direction = guess < target ? 1 : -1;
        return Math.max(1, Math.min(100, target + (adjustment * direction)));
    } else {
        const adjustment = Math.floor(Math.random() * 3) + 1;
        const direction = Math.random() < 0.5 ? 1 : -1;
        let newTarget = target + (adjustment * direction);
        return Math.max(1, Math.min(100, Math.max(netCenter - 7, Math.min(netCenter + 7, newTarget))));
    }
}

function handleConsecutiveGuesses(guess) {
    if (guess === consecutiveGuesses.value) {
        consecutiveGuesses.count++;
        if (consecutiveGuesses.count === 3) {
            advancedTarget = Math.floor(Math.random() * 100) + 1;
            consecutiveGuesses = { count: 0, value: null };
            netCenter = null;
            document.getElementById('numberButtons').style.display = 'none';
            return "唉，这个网真不耐用，三次就破了，鱼都跑出去了。目标已重置！";
        }
    } else {
        consecutiveGuesses = { count: 1, value: guess };
    }
    return null;
}

function handleGuess(isAdvanced, guess = null) {
    console.log("handleGuess called", isAdvanced, guess);
    const inputId = isAdvanced ? 'advancedGuessInput' : 'basicGuessInput';
    const messageId = isAdvanced ? 'advancedMessage' : 'basicMessage';
    const historyId = isAdvanced ? 'advancedHistory' : 'basicHistory';
    
    if (guess === null) {
        guess = parseInt(document.getElementById(inputId).value);
    }
    
    const messageElement = document.getElementById(messageId);
    const historyElement = document.getElementById(historyId);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        messageElement.textContent = "请输入1到100之间的有效数字！";
        return;
    }
    
    let target = isAdvanced ? advancedTarget : basicTarget;
    let history = isAdvanced ? advancedHistory : basicHistory;
    
    if (isAdvanced) {
        const resetMessage = handleConsecutiveGuesses(guess);
        if (resetMessage) {
            messageElement.textContent = resetMessage;
            fishPositions = [];
            return;
        }
        const difference = Math.abs(advancedTarget - guess);
        if (netCenter === null) {
            if (difference <= 7) {
                messageElement.textContent = "鱼已进网！继续努力，抓住它！";
                netCenter = advancedTarget;
                createNumberButtons();
            } else {
                messageElement.textContent = `${guess < advancedTarget ? '小' : '大'}了，鱼没进网！`;
            }
        } else {
            if (difference === 0) {
                messageElement.textContent = `恭喜你，抓到鱼了！这条鱼的编号是 ${advancedTarget}。`;
                document.getElementById(inputId.replace('Input', 'Button')).disabled = true;
                document.getElementById('giveUpButton').disabled = true;
                document.getElementById('numberButtons').style.display = 'none';
                history.push(guess);
                updateHistory(historyElement, history, fishPositions, false);
                addRestartButton(isAdvanced);
                return;
            } else {
                messageElement.textContent = `很接近了！但还是${guess < advancedTarget ? '小' : '大'}了一点。`;
            }
        }
        fishPositions.push(advancedTarget);
        advancedTarget = adjustTarget(advancedTarget, guess);
    } else {
        if (guess < target) {
            messageElement.textContent = "小了!";
        } else if (guess > target) {
            messageElement.textContent = "大了!";
        } else {
            messageElement.textContent = `恭喜你,猜对了!答案就是${target}。`;
            document.getElementById(inputId.replace('Input', 'Button')).disabled = true;
            addRestartButton(isAdvanced);
            return;
        }
    }
    
    history.push(guess);
    updateHistory(historyElement, history, isAdvanced ? fishPositions : [], false);
    document.getElementById(inputId).value = "";
}

function createNumberButtons() {
    const numberButtonsContainer = document.getElementById('numberButtons');
    numberButtonsContainer.innerHTML = '';
    numberButtonsContainer.style.display = 'flex';
    numberButtonsContainer.style.flexWrap = 'wrap';
    numberButtonsContainer.style.justifyContent = 'center';
    
    const start = Math.max(1, netCenter - 7);
    const end = Math.min(100, netCenter + 7);
    
    for (let i = start; i <= end; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('number-button');
        button.addEventListener('click', (e) => {
            e.target.classList.add('clicked');
            setTimeout(() => {
                e.target.classList.remove('clicked');
                handleGuess(true, i);
            }, 200);
        });
        numberButtonsContainer.appendChild(button);
    }
}

function updateHistory(historyElement, history, fishPositions, showFish = false) {
    const historyWithFish = history.map((guess, index) => {
        if (showFish && fishPositions[index] !== undefined) {
            return `${guess} <span class="fish-position">(${fishPositions[index]})</span>`;
        }
        return guess;
    });
    historyElement.innerHTML = "你猜过的数字: " + historyWithFish.join(", ");
}

function handleGiveUp() {
    console.log("Give up button clicked");
    const historyElement = document.getElementById('advancedHistory');
    updateHistory(historyElement, advancedHistory, fishPositions, true);
    document.getElementById('advancedGuessButton').disabled = true;
    document.getElementById('giveUpButton').disabled = true;
    document.getElementById('numberButtons').style.display = 'none';
}

function addRestartButton(isAdvanced) {
    const gameSection = isAdvanced ? document.querySelector('.game-section:nth-child(2)') : document.querySelector('.game-section:first-child');
    const restartButton = document.createElement('button');
    restartButton.textContent = '重新开始';
    restartButton.id = 'restartButton';
    restartButton.addEventListener('click', () => restartGame(isAdvanced));
    gameSection.appendChild(restartButton);
}

function restartGame(isAdvanced) {
    if (isAdvanced) {
        advancedTarget = Math.floor(Math.random() * 100) + 1;
        advancedHistory = [];
        consecutiveGuesses = { count: 0, value: null };
        netCenter = null;
        fishPositions = [];
        document.getElementById('advancedMessage').textContent = "鱼儿跳进了泳池，快来抓住它呀!（每次抓鱼都会吓跑，池底是1-100的地砖铺成的）";
        document.getElementById('advancedGuessButton').disabled = false;
        document.getElementById('giveUpButton').disabled = false;
        document.getElementById('numberButtons').style.display = 'none';
    } else {
        basicTarget = Math.floor(Math.random() * 100) + 1;
        basicHistory = [];
        document.getElementById('basicMessage').textContent = "我已经想好了一个1到100之间的数字，请你来猜！";
        document.getElementById('basicGuessButton').disabled = false;
    }
    document.getElementById('restartButton').remove();
    updateHistory(document.getElementById(isAdvanced ? 'advancedHistory' : 'basicHistory'), [], [], false);
}

function init() {
    console.log("Initializing game...");
    document.getElementById('basicGuessButton').addEventListener('click', () => {
        console.log("Basic guess button clicked");
        handleGuess(false);
    });
    document.getElementById('advancedGuessButton').addEventListener('click', () => {
        console.log("Advanced guess button clicked");
        handleGuess(true);
    });
    document.getElementById('giveUpButton').addEventListener('click', handleGiveUp);
}

window.addEventListener('load', init);
