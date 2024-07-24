let basicTarget = Math.floor(Math.random() * 100) + 1;
let advancedTarget = Math.floor(Math.random() * 100) + 1;
let basicHistory = [];
let advancedHistory = [];
let consecutiveGuesses = { count: 0, value: null };

function adjustTarget(target, guess) {
    const difference = Math.abs(target - guess);
    let adjustment;
    const direction = guess < target ? "big" : "small";
    
    if (difference <= 7) {
        // 鱼已进网
        adjustment = Math.min(Math.floor(Math.random() * 3) + 1, 7);
    } else {
        // 鱼未进网
        adjustment = Math.floor(Math.random() * 7) + 1;
    }
    
    return direction === "big" ? target - adjustment : target + adjustment;
}

function handleConsecutiveGuesses(guess) {
    if (guess === consecutiveGuesses.value) {
        consecutiveGuesses.count++;
        if (consecutiveGuesses.count === 3) {
            advancedTarget = Math.floor(Math.random() * 100) + 1;
            consecutiveGuesses = { count: 0, value: null };
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
        if (difference <= 7) {
            messageElement.textContent = `鱼已进网！但还是${guess < advancedTarget ? '小' : '大'}了。鱼可能会跑出1-3步。`;
        } else {
            messageElement.textContent = `${guess < advancedTarget ? '小' : '大'}了，鱼没进网！鱼可能会惊吓地跑出1-7步。`;
        }
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

document.getElementById('basicGuessButton').addEventListener('click', () => handleGuess(false));
document.getElementById('advancedGuessButton').addEventListener('click', () => handleGuess(true));
