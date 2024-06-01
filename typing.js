const typeSound = new Audio("./typing-sound.mp3");
const wrongSound = new Audio("./wrong.mp3");
const correctSound = new Audio("./correct.mp3");
let inputText = document.getElementById("input-text");
let i = 0;

// 文章生成関数
async function makeSentence() {
  i = 0;
  const textElement = document.getElementById("text");
  const response = await fetch("https://api.quotable.io/random");

  const data = await response.json();
  quote = data.content; // 取得した引用を保存
  textElement.innerText = quote;
  console.log(quote);

  // テキストをspanタグで区切る
  splitTextToSpans();

  return quote; // 新しい引用を返す
}

// テキストをspanタグで区切る関数
function splitTextToSpans() {
  let splitText = document.getElementById('text');
  let text = splitText.innerHTML;
  let newText = '';

  const unEscapeHTML = (str) => {
    return str
      .replace(/(&lt;)/g, '<')
      .replace(/(&gt;)/g, '>')
      .replace(/(&quot;)/g, '"')
      .replace(/(&#39;)/g, "'")
      .replace(/(&amp;)/g, '&');
  };

  text = unEscapeHTML(text);
  text.split('').forEach((element) => {
    // 文字列に空白（スペース）がある場合
    if (element == ' ') {
      newText += '<span>&nbsp;</span>';
    } else {
      newText += '<span>' + element + '</span>';
    }
  });

  splitText.innerHTML = newText;
}

// 初期化時にテキストを取得して表示
document.addEventListener('DOMContentLoaded', makeSentence);

//　カウントダウンタイマー
function countdownTimer() {
  const countNumberElement = document.getElementById("count-number");
  let countNumber = parseInt(countNumberElement.innerText);
  if (countNumber > 1) {
    countNumber -= 1;
    countNumberElement.innerText = countNumber;
  } else {
    countNumberElement.innerText = "Game Over!!";
    inputText.remove();
  }
}

// i番目の文字を赤色にする関数
function updateTextColor(index) {
  const spans = document.getElementById('text').getElementsByTagName('span');
  if (index < spans.length) {
    spans[index].style.color = 'red';
  }
}

window.onload = async function () {
  let quote = ""; // APIから取得した引用を格納する変数
  
  // 初回の引用を取得
  quote = await makeSentence();
  setInterval(countdownTimer, 1000);

  // textareaが入力されたら実行
  inputText.addEventListener("input", async function () {
    typeSound.play();
    typeSound.currentTime = 0;
    // 正誤を確かめる
    function checkSpell([...input]) {
      if ([...input][i] === [...quote][i]) {
        updateTextColor(i); // 正しい場合、色を赤にする
        i = i + 1;
        correctSound.play();
        correctSound.currentTime = 0;
        if(i === quote.length) {
          correctSound.play();
          correctSound.currentTime = 0;
          inputText.value = "";
          makeSentence().then((newQuote) => (quote = newQuote));
        }
      } else {
        console.log("no");
        wrongSound.play();
        wrongSound.currentTime = 0;
      }
    }
    checkSpell(inputText.value);
  });
};


