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
        const adjustment = Math.floor(Math.random() * 7) + 1;
        const direction = guess < target ? 1 : -1;
        return Math.max(1, Math.min(100, target + (adjustment * direction)));
    } else {
        const adjustment = Math.floor(Math.random() * 3) + 1;
        const direction = Math.random() < 0.5 ? 1 : -1;
        let newTarget = target + (adjustment * direction);
        return Math.max(netCenter - 7, Math.min(netCenter + 7, newTarget));
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
                messageElement.textContent = "恭喜你，抓到鱼了！";
                document.getElementById(inputId.replace('Input', 'Button')).disabled = true;
                document.getElementById('giveUpButton').disabled = true;
                document.getElementById('numberButtons').style.display = 'none';
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
        }
    }
    
    history.push(guess);
    updateHistory(historyElement, history, fishPositions, false);
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
        button.style.margin = '5px';
        button.style.width = 'calc(20% - 10px)';
        button.addEventListener('click', () => handleGuess(true, i));
        numberButtonsContainer.appendChild(button);
    }
}

function updateHistory(historyElement, history, fishPositions, showFish = false) {
    const historyWithFish = history.map((guess, index) => {
        if (showFish && fishPositions[index] !== unde
