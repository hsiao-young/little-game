let basicTarget = Math.floor(Math.random() * 100) + 1;
let advancedTarget = Math.floor(Math.random() * 100) + 1;
let basicHistory = [];
let advancedHistory = [];

function adjustTarget(target, guess, direction) {
    const difference = Math.abs(target - guess);
    let adjustment;
    if (difference > 7) {
        adjustment = Math.floor(Math.random() * 7) + 1;
    } else {
        adjustment = Math.floor(Math.random() * 3) + 1;
    }
    return direction === "big" ? target + adjustment : target - adjustment;
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

    if (guess < target) {
        messageElement.textContent = "小了!";
        if (isAdvanced) {
            advancedTarget = adjustTarget(target, guess, "small");
        }
    } else if (guess > target) {
        messageElement.textContent = "大了!";
        if (isAdvanced) {
            advancedTarget = adjustTarget(target, guess, "big");
        }
    } else {
        messageElement.textContent = `恭喜你,猜对了!答案就是${target}。`;
        document.getElementById(inputId.replace('Input', 'Button')).disabled = true;
    }

    history.push(guess);
    historyElement.textContent = "你猜过的数字: " + history.join(", ");
    document.getElementById(inputId).value = "";
}

document.getElementById('basicGuessButton').addEventListener('click', () => handleGuess(false));
document.getElementById('advancedGuessButton').addEventListener('click', () => handleGuess(true));
