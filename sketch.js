let radio; // 用於存放選項的 RADIO 物件
let inputBox; // 用於存放填空題的文字框
let button; // 用於送出的按鈕
let table; // 用於存放 CSV 資料
let currentQuestion = 0; // 當前題目索引
let correctCount = 0; // 答對的題數
let incorrectCount = 0; // 答錯的題數
let particles = []; // 用於存放粒子效果
let stars = []; // 用於存放星星效果

function preload() {
  // 載入 CSV 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() { // 這是一個初始設定函數，只會執行一次
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化粒子效果
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  // 初始化星星效果
  for (let i = 0; i < 300; i++) {
    stars.push(new Star());
  }

  // 設定選項的 RADIO 物件
  radio = createRadio();
  radio.style('font-size', '18px');
  radio.style('color', 'white');
  radio.style('background-color', '#0b3d91'); // 深藍色背景
  radio.style('padding', '10px');
  radio.style('border-radius', '10px');
  radio.style('box-shadow', '0px 4px 6px rgba(0, 0, 0, 0.2)');

  // 設定填空題的文字框
  inputBox = createInput();
  inputBox.style('font-size', '18px');
  inputBox.style('padding', '10px');
  inputBox.style('border-radius', '10px');
  inputBox.style('border', '2px solid #ffc300');
  inputBox.hide(); // 預設隱藏，只有填空題時顯示

  // 設定送出按鈕
  button = createButton('下一題');
  button.style('font-size', '18px');
  button.style('padding', '10px 20px');
  button.style('border-radius', '10px');
  button.style('background-color', '#ffc300');
  button.style('color', 'black');
  button.style('border', 'none');
  button.style('box-shadow', '0px 4px 6px rgba(0, 0, 0, 0.2)');
  button.mousePressed(nextQuestion); // 當按下按鈕時執行 nextQuestion 函數

  // 顯示第一題
  displayQuestion();
}

function draw() {
  // 清除背景，避免文字重疊
  background("#0b3d91"); // 深藍色背景

  // 星星效果
  for (let star of stars) {
    star.update();
    star.show();
  }

  // 粒子效果
  for (let particle of particles) {
    particle.update();
    particle.show();
  }

  // 顯示居中框
  drawCenteredBox();

  // 顯示題目文字
  fill("white"); // 白色文字
  textSize(32); // 更大的字體
  textAlign(CENTER, CENTER);
  textFont('Poppins'); // 使用 Poppins 字體

  if (currentQuestion < table.getRowCount()) {
    const question = table.getString(currentQuestion, 'question');
    text(question, width / 2, height / 2 - 100); // 題目位置稍微上移
  } else {
    // 顯示測驗結果
    text(`測驗結束！`, width / 2, height / 2 - 100);
    text(`答對題數：${correctCount}`, width / 2, height / 2 - 50);
    text(`答錯題數：${incorrectCount}`, width / 2, height / 2);
  }
}

// 自訂函數：繪製居中框
function drawCenteredBox() {
  const boxWidth = 700; // 框的寬度
  const boxHeight = 450; // 框的高度
  const boxX = (width - boxWidth) / 2; // 框的 X 座標
  const boxY = (height - boxHeight) / 2; // 框的 Y 座標

  // 繪製框的背景（漸層效果）
  noStroke();
  for (let i = 0; i < boxHeight; i++) {
    let inter = map(i, 0, boxHeight, 0, 1);
    let c = lerpColor(color("#1e6091"), color("#76c893"), inter);
    stroke(c);
    line(boxX, boxY + i, boxX + boxWidth, boxY + i);
  }

  // 繪製框內的背景
  fill(30, 50, 100, 200); // 半透明深藍色
  noStroke();
  rect(boxX + 20, boxY + 20, boxWidth - 40, boxHeight - 40, 15); // 圓角矩形

  // 繪製框的邊框
  stroke("white"); // 白色邊框
  strokeWeight(4);
  noFill();
  rect(boxX, boxY, boxWidth, boxHeight, 20); // 外框圓角矩形
}

// 自訂函數：設定漸層背景
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === "Y") { // 垂直漸層
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  }
}

// 當視窗大小改變時，調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position((width - 300) / 2, (height / 2) + 20); // 調整選項位置
  inputBox.position((width - 300) / 2, (height / 2) + 20); // 調整文字框位置
  button.position((width - 150) / 2, (height / 2) + 150); // 調整按鈕位置
}

function displayQuestion() {
  if (currentQuestion < table.getRowCount()) {
    // 清空選項和文字框
    radio.html('');
    inputBox.hide();

    // 取得當前題目的類型
    const type = table.getString(currentQuestion, 'type');

    if (type === 'choice') {
      // 顯示選項題
      const option1 = table.getString(currentQuestion, 'option1');
      const option2 = table.getString(currentQuestion, 'option2');
      const option3 = table.getString(currentQuestion, 'option3');
      const option4 = table.getString(currentQuestion, 'option4');

      // 設定選項
      radio.option(option1, option1);
      radio.option(option2, option2);
      radio.option(option3, option3);
      radio.option(option4, option4);
      radio.show();

      // 設定選項位置
      radio.position((width - 300) / 2, (height / 2) + 20);
    } else if (type === 'fill') {
      // 顯示填空題
      inputBox.show();
      inputBox.position((width - 300) / 2, (height / 2) + 20);
    }

    // 設定按鈕位置
    button.position((width - 150) / 2, (height / 2) + 150);
  } else {
    // 測驗結束，按鈕顯示「再試一次」
    button.html('再試一次');
    button.mousePressed(restartQuiz);
  }
}

function nextQuestion() {
  if (currentQuestion < table.getRowCount()) {
    const type = table.getString(currentQuestion, 'type');
    const correctAnswer = table.getString(currentQuestion, 'answer'); // 取得正確答案

    let answer;
    if (type === 'choice') {
      answer = radio.value(); // 獲取選中的選項值
    } else if (type === 'fill') {
      answer = inputBox.value(); // 獲取填空題的輸入值
    }

    // 判斷答案是否正確
    if (answer === correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    // 前往下一題
    currentQuestion++;
    displayQuestion();
  }
}

function restartQuiz() {
  // 重置測驗狀態
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;
  button.html('下一題');
  button.mousePressed(nextQuestion);
  displayQuestion();
}

// 星星類別
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.brightness = random(150, 255);
    this.twinkleSpeed = random(0.02, 0.05);
  }

  update() {
    // 閃爍效果
    this.brightness += sin(frameCount * this.twinkleSpeed) * 5;
  }

  show() {
    noStroke();
    fill(this.brightness);
    ellipse(this.x, this.y, this.size);
  }
}

// 粒子類別
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(5, 15);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.color = color(random(100, 255), random(100, 255), random(255, 255));
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // 邊界檢查
    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}
