const data = [
    { q: '半粒荔枝', a: '把幾火' },
    { q: '壽星公吊頸', a: '嫌命長' },
    { q: '棺材頭燒炮仗', a: '嚇死人' },
    { q: '烏蠅摟馬尾', a: '一拍兩散' },
    { q: '豉油撈飯', a: '整色整水' },
    { q: '白鱔上沙灘', a: '唔死一身潺' },
    { q: '閰羅王嫁女', a: '鬼要' },
    { q: '結他無線', a: '無得彈' },
    { q: '一三五七九', a: '無雙' },
    { q: '殺雞用牛刀', a: '小題大做' }
];

// Configuration
const TIME_LIMIT = 30; 
let quizData = [];
let currentIndex = 0;
let score = 0;
let tries = 3;
let timeLeft = TIME_LIMIT;
let timerInterval;
let userLog = [];
let hintUsedForCurrent = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function initProgress() {
    const bar = document.getElementById('progress-bar');
    bar.innerHTML = '';
    quizData.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'step';
        dot.id = `step-${i}`;
        bar.appendChild(dot);
    });
}

function startGame() {
    quizData = shuffle([...data]);
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    initProgress();
    showQuestion();
}

function showQuestion() {
    if (currentIndex >= quizData.length) {
        endGame();
        return;
    }
    
    document.getElementById(`step-${currentIndex}`).classList.add('active');
    hintUsedForCurrent = false;
    resetTimer();
    tries = 3;
    
    document.getElementById('q-text').innerText = quizData[currentIndex].q;
    document.getElementById('tries').innerText = tries;
    document.getElementById('current-score').innerText = score;
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('hint-btn').disabled = false;
    document.getElementById('feedback').innerHTML = ''; // Changed to innerHTML for buttons
    document.getElementById('user-input').focus();
}

function getHint() {
    if (hintUsedForCurrent) return;
    
    hintUsedForCurrent = true;
    score -= 0.5;
    document.getElementById('current-score').innerText = score;
    document.getElementById('hint-btn').disabled = true;

    const correctA = quizData[currentIndex].a;
    
    // Get all other possible answers
    const otherAnswers = data
        .map(item => item.a)
        .filter(a => a !== correctA);
    
    // Shuffle and pick 2 wrong ones
    const wrongChoices = shuffle(otherAnswers).slice(0, 2);
    
    // Combine with correct and shuffle again
    const finalChoices = shuffle([correctA, ...wrongChoices]);

    // Create buttons
    let hintHtml = '<div style="margin-top:10px;">請選擇一個答案 (扣0.5分)：<br>';
    finalChoices.forEach(choice => {
        hintHtml += `<button onclick="selectHint('${choice}')" style="margin:5px; background-color:#6a4a3a; font-size:0.9rem; padding:5px 10px;">${choice}</button>`;
    });
    hintHtml += '</div>';
    
    document.getElementById('feedback').innerHTML = hintHtml;
}

function selectHint(val) {
    document.getElementById('user-input').value = val;
    document.getElementById('feedback').innerHTML = `已選擇：${val}。請點擊提交或按 Enter。`;
    document.getElementById('user-input').focus();
}

function checkAnswer() {
    const input = document.getElementById('user-input').value.trim();
    const correctAnswer = quizData[currentIndex].a;
    const dot = document.getElementById(`step-${currentIndex}`);

    if (input === correctAnswer) {
        score += 1;
        dot.className = 'step correct';
        userLog.push({ q: quizData[currentIndex].q, a: input, correct: true, expected: correctAnswer });
        document.getElementById('feedback').style.color = "green";
        document.getElementById('feedback').innerText = "答對了！攞到 1 分！";
        lockAndNext();
    } else {
        tries--;
        document.getElementById('tries').innerText = tries;
        if (tries <= 0) {
            dot.className = 'step wrong';
            userLog.push({ q: quizData[currentIndex].q, a: input || "未填寫", correct: false, expected: correctAnswer });
            document.getElementById('feedback').style.color = "red";
            document.getElementById('feedback').innerText = `次數用盡！答案：${correctAnswer}`;
            lockAndNext();
        } else {
            document.getElementById('feedback').style.color = "orange";
            document.getElementById('feedback').innerText = "唔係呢個喎，再試下！";
        }
    }
}

function lockAndNext() {
    clearInterval(timerInterval);
    document.getElementById('user-input').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('hint-btn').disabled = true;
    setTimeout(() => {
        currentIndex++;
        showQuestion();
    }, 2200);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = TIME_LIMIT;
    document.getElementById('timer').innerText = `剩餘時間: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `剩餘時間: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById(`step-${currentIndex}`).className = 'step wrong';
            userLog.push({ q: quizData[currentIndex].q, a: "超時", correct: false, expected: quizData[currentIndex].a });
            document.getElementById('feedback').style.color = "red";
            document.getElementById('feedback').innerText = "時間到！";
            lockAndNext();
        }
    }, 1000);
}

function endGame() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('final-score').innerText = score;
    
    const msg = document.getElementById('congrats-msg');
    if (score >= 8) msg.innerText = "直情係大師級！太犀利喇！🎊";
    else if (score >= 5) msg.innerText = "唔錯喎，做得好！👍";
    else msg.innerText = "唔緊要，下次再努力過！💪";

    let html = '<table class="results-table"><tr><th>題目</th><th>狀態</th><th>正確答案</th></tr>';
    userLog.forEach(item => {
        html += `<tr>
            <td>${item.q}</td>
            <td style="color:${item.correct?'green':'red'}">${item.correct?'正確':'錯誤'}</td>
            <td><strong>${item.expected}</strong></td>
        </tr>`;
    });
    html += '</table>';
    document.getElementById('review-area').innerHTML = html;
}

document.getElementById("user-input").addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !document.getElementById('user-input').disabled) checkAnswer();
});