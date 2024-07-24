let target = Math.floor(Math.random() * 100) + 1;
let history = [];

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

document.getElementById('guessButton').addEventListener('click', function() {
    const guess = parseInt(document.getElementById('guessInput').value);
    const messageElement = document.getElementById('message');
    const historyElement = document.getElementById('history');

    if (isNaN(guess) || guess < 1 || guess > 100) {
        messageElement.textContent = "请输入1到100之间的有效数字！";
        return;
    }

    if (guess < target) {
        messageElement.textContent = "小了!";
        target = adjustTarget(target, guess, "small");
    } else if (guess > target) {
        messageElement.textContent = "大了!";
        target = adjustTarget(target, guess, "big");
    } else {
        messageElement.textContent = `恭喜你,猜对了!答案就是${target}。`;
        document.getElementById('guessButton').disabled = true;
    }

    history.push(guess);
    historyElement.textContent = "你猜过的数字: " + history.join(", ");
    document.getElementById('guessInput').value = "";
});
