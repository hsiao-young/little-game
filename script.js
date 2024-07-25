let basicTarget = Math.floor(Math.random() * 100) + 1;
let advancedTarget = Math.floor(Math.random() * 100) + 1;
let basicHistory = [];
let advancedHistory = [];
let consecutiveGuesses = { count: 0, value: null };
let netCenter = null;
let fishPosition = null;

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
            return "唉，这个网真不耐用，三次就破了，鱼都跑出去了。目标已重置！";
        }
    } else {
        consecutiveGuesses = { count: 1, value: guess };
    }
    return null;
}

function handleGuess(isAdvanced) {
    const inputId = isAdvanced ? 'advancedGuessInput' : 'basicGuessInput';
    const messageId = isAdvanced ? 'advancedMessage' : 'basicMessage';
    const historyId = isAdvanced ? 'advancedHistory' : 'basicHistory';
    const guess = parseInt(document.getElementById(inputId).value);
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
            } else {
                messageElement.textContent = `${guess < advancedTarget ? '小' : '大'}了，鱼没进网！`;
            }
        } else {
            if (difference === 0) {
                messageElement.textContent = "恭喜你，抓到鱼了！";
                document.getElementById(inputId.replace('Input', 'Button')).disabled = true;
                document.getElementById('giveUpButton').disabled = true;
                return;
            } else {
                messageElement.textContent = `很接近了！但还是${guess < advancedTarget ? '小' : '大'}了一点。`;
            }
        }
        fishPosition = advancedTarget;
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
    historyElement.textContent = "你猜过的数字: " + history.join(", ");
    document.getElementById(inputId).value = "";
}

function createNumberButtons() {
    const numberButtonsContainer = document.getElementById('numberButtons');
    for (let i = 1; i <= 15; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            document.getElementById('advancedGuessInput').value = i;
        });
        numberButtonsContainer.appendChild(button);
    }
}

function handleGiveUp() {
    if (fishPosition !== null) {
        const historyElement = document.getElementById('advancedHistory');
        const guessedNumbers = advancedHistory.map(num => num.toString());
        const lastGuessIndex = guessedNumbers.lastIndexOf(fishPosition.toString());
        if (lastGuessIndex !== -1) {
            guessedNumbers[lastGuessIndex] += ` <span class="fish-position">(${fishPosition})</span>`;
        } else {
            guessedNumbers.push(`<span class="fish-position">(${fishPosition})</span>`);
        }
        historyElement.innerHTML = "你猜过的数字: " + guessedNumbers.join(", ");
        historyElement.innerHTML += '<br>游戏结束,鱼的最后位置已显示。';
        document.getElementById('advancedGuessButton').disabled = true;
        document.getElementById('giveUpButton').disabled = true;
    }
}

function init() {
    createNumberButtons();
    document.getElementById('basicGuessButton').addEventListener('click', () => handleGuess(false));
    document.getElementById('advancedGuessButton').addEventListener('click', () => handleGuess(true));
    document.getElementById('giveUpButton').addEventListener('click', handleGiveUp);
}

window.addEventListener('load', init);
