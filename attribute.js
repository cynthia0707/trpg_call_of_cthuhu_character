
// 通用骰子函式
function rollDice(times, sides, bonus = 0, multiplier = 1) {
  let total = 0;
  for (let i = 0; i < times; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return (total + bonus) * multiplier;
}

// 隨機選擇選項
function getRandomOption(selectId) {
  const select = document.getElementById(selectId);
  if (select.value === "隨機") {
    const options = Array.from(select.options).filter(opt => opt.value !== "隨機");
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex].value;
  }
  return select.value;
}

// 年齡輸入驗證
function validateAgeInput(ageInput) {
  if (!ageInput) return null; // 空值 → 用隨機
  const age = parseInt(ageInput, 10);
  if (isNaN(age)) {
    alert("請輸入數字格式的年齡（例如 25）");
    return null;
  }
  if (age < 15 || age > 90) {
    alert("年齡請輸入 15 到 90 之間的數字");
    return null;
  }
  return age;
}

// 非線性隨機年齡
function getWeightedRandomAge() {
  const pool = [
    ...Array(10).fill().map(() => getRandomBetween(20, 30)),
    ...Array(7).fill().map(() => getRandomBetween(31, 39)),
    ...Array(5).fill().map(() => getRandomBetween(15, 19)),
    ...Array(4).fill().map(() => getRandomBetween(40, 49)),
    ...Array(3).fill().map(() => getRandomBetween(50, 59)),
    ...Array(2).fill().map(() => getRandomBetween(60, 69)),
    ...Array(1).fill().map(() => getRandomBetween(70, 89)),
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 年齡調整
function applyAgeAdjustment(character) {
  const age = parseInt(character.age);
  const attr = character.attributes;
  let eduTests = 0;

  if (age >= 15 && age <= 19) {
    reduceRandomTotal(["STR", "SIZ"], 5, attr);
    attr.EDU -= 5;
    attr.LUCK = Math.max(rollDice(3, 6, 0, 5), rollDice(3, 6, 0, 5));
  } else if (age <= 39) {
    eduTests = 1;
  } else if (age <= 49) {
    eduTests = 2;
    reduceRandomTotal(["STR", "CON", "DEX"], 5, attr);
    attr.APP -= 5;
  } else if (age <= 59) {
    eduTests = 3;
    reduceRandomTotal(["STR", "CON", "DEX"], 10, attr);
    attr.APP -= 10;
  } else if (age <= 69) {
    eduTests = 4;
    reduceRandomTotal(["STR", "CON", "DEX"], 20, attr);
    attr.APP -= 15;
  } else if (age <= 79) {
    eduTests = 4;
    reduceRandomTotal(["STR", "CON", "DEX"], 40, attr);
    attr.APP -= 20;
  } else if (age <= 89) {
    eduTests = 4;
    reduceRandomTotal(["STR", "CON", "DEX"], 80, attr);
    attr.APP -= 25;
  }

  for (let i = 0; i < eduTests; i++) {
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll > attr.EDU) {
      attr.EDU += Math.floor(Math.random() * 10) + 1;
      attr.EDU = Math.min(attr.EDU, 99);
    }
  }

  for (const key in attr) {
    if (attr[key] < 1) attr[key] = 1;
  }
}

// 扣點分配工具（分散扣點）
function reduceRandomTotal(keys, total, attr) {
  while (total > 0) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    if (attr[key] > 1) {
      attr[key]--;
      total--;
    }
  }
}

// ✅ 主要功能：產生角色並跳轉
function generateCharacter() {
  const nameInput = document.getElementById("charName").value;
  const gender = getRandomOption("charGender");
  const birthplace = getRandomOption("charBirthplace");
  const name = nameInput || getRandomCharacterName(birthplace, gender);

  const ageInput = document.getElementById("charAge").value;
  const age = validateAgeInput(ageInput) || getWeightedRandomAge();

  const location = getRandomOption("charLocation");
  const era = document.getElementById("charEra").value || "1920";

  const attributes = {
    STR: rollDice(3, 6, 0, 5),
    CON: rollDice(3, 6, 0, 5),
    SIZ: rollDice(2, 6, 6, 5),
    DEX: rollDice(3, 6, 0, 5),
    APP: rollDice(3, 6, 0, 5),
    INT: rollDice(2, 6, 6, 5),
    POW: rollDice(3, 6, 0, 5),
    EDU: rollDice(2, 6, 6, 5),
    LUCK: rollDice(3, 6, 0, 5)
  };

  const character = {
    name,
    age,
    gender,
    location,
    birthplace,
    era,
    attributes
  };

  applyAgeAdjustment(character);
  localStorage.setItem("characterData", JSON.stringify(character));
  window.location.href = "character.html";
}
//珍愛生命，遠離程式...KP008關心您
