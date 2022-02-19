import { TrieNode } from "./Trie.js";
import { words } from "./words.js";

const wordTrie = new TrieNode(words);

// const wordsLength = words.length;

const chosenWord = words[Math.floor(Math.random() * words.length)];

let gameIsOver = false;

const alphabet = "abcdefghijklmnopqrstuvwxyz";

//pick random word form wordlist
const chosenWord = "apple";
let currentWord = "";
var wordsSubmitted = [];

const showToast = (msg) => {
  const toastDiv = document.getElementById("toast");
  toastDiv.classList.add("visible");
  toastDiv.innerHTML = msg;

  toastDiv.classList.remove("fade-out");
  toastDiv.classList.add("visible");

  setTimeout(() => {
    toastDiv.classList.remove("visible");
    toastDiv.classList.add("fade-out");
  }, 800);
};

const getCurrentRowDiv = () => {
  const currentRowIndex = wordsSubmitted.length;
  const rowDiv = document.getElementsByClassName("row")[currentRowIndex];

  return rowDiv;
};

const shakeRow = () => {
  const currentRow = getCurrentRowDiv();

  currentRow.classList.remove("shake-it");
  currentRow.classList.add("shake-it");

  setTimeout(() => {
    currentRow.classList.remove("shake-it");
  }, 500);
};

const checkForlength = (word) => {
  const isCorrectLength = word.length === 5;

  if (!isCorrectLength) {
    showToast("Not enough Letters");
    shakeRow();
  }

  return isCorrectLength;
};

const checkWordExists = (word) => {
  const exists = wordTrie.contains(word);

  if (!exists) {
    showToast("Not in Word List");
    shakeRow();
  }

  return exists;
};

const victory = () => {
  gameIsOver = !false;
  const toastDiv = document.getElementById("toast");
  toastDiv.innerHTML = `You Won!`;
  toastDiv.classList.remove("fade-out");
  toastDiv.classList.add("visible");
};
const gameOver = () => {
  gameIsOver = !false;
  const toastDiv = document.getElementById("toast");
  toastDiv.innerHTML = `You Lost! The correct word is: ${chosenWord.toUpperCase()}`;
  toastDiv.classList.remove("fade-out");
  toastDiv.classList.add("visible");
};

const refreshGrid = () => {
  const currentWordArray = currentWord.split("");
  const currentRowIndex = wordsSubmitted.length;

  wordsSubmitted.forEach((word, wordIndex) => {
    word.split("").forEach((letter, letterIndex) => {
      const currentRow = document.getElementsByClassName("row")[wordIndex];
      const currentCell =
        currentRow.getElementsByClassName("cell")[letterIndex];

      currentCell.innerHTML = letter;
    });
  });

  [0, 1, 2, 3, 4].forEach((index) => {
    const currentRow = document.getElementsByClassName("row")[currentRowIndex];

    const currentCell = currentRow.getElementsByClassName("cell")[index];

    currentCell.innerHTML = currentWordArray[index] || "";
  });
};

const updateWord = (letter) => {
  if (!letter) {
    // backspacing:
    const wordAsArray = currentWord.split("");

    wordAsArray.pop();

    currentWord = wordAsArray.join("");
  } else {
    currentWord = currentWord + letter;
  }

  refreshGrid();
};

const getKeyboardLetter = (letter) => {
  const div = Array.from(document.getElementsByClassName("key")).find(
    (keyDiv) => keyDiv.innerHTML.toLowerCase() === letter.toLowerCase()
  );

  return div;
};

const submitWord = () => {
  const currentRowIndex = wordsSubmitted.length;

  const currentWordArray = currentWord.split("");
  const chosenWordArray = chosenWord.split("");

  const currentRow = document.getElementsByClassName("row")[currentRowIndex];

  currentWordArray.forEach((letter, letterIndex) => {
    const currentCell = currentRow.getElementsByClassName("cell")[letterIndex];
    if (letter === chosenWordArray[letterIndex]) {
      currentCell.classList.add("match");

      getKeyboardLetter(letter).classList.add("match");
      // currentCell.classList.add("match");
    } else if (chosenWord.includes(letter)) {
      // includes class
      getKeyboardLetter(letter).classList.add("includes");

      currentCell.classList.add("includes");
    } else {
      //not include class
      getKeyboardLetter(letter).classList.add("not-includes");

      currentCell.classList.add("not-includes");
    }
  });

  wordsSubmitted.push(currentWord);
};

const keyDownEvent = (key) => {
  if (gameIsOver) {
    return;
  }
  // check if alphabets includes the key:
  if (currentWord.length < 5 && alphabet.includes(key.toLowerCase())) {
    updateWord(key.toLowerCase());
  } else if (key === "Enter") {
    if (!checkForlength(currentWord)) return;
    if (!checkWordExists(currentWord)) return;

    submitWord();

    if (currentWord === chosenWord) {
      victory();
    } else if (wordsSubmitted.length === 6) {
      gameOver();
    } else {
      currentWord = "";
      refreshGrid();
    }
  } else if (key === "Backspace") {
    updateWord();
  }
};

document.addEventListener("keydown", (evt) => {
  const { key } = evt;

  keyDownEvent(key);
});

Array.from(document.getElementsByClassName("key")).forEach((keyDiv) => {
  keyDiv.addEventListener("click", (evt) => {
    const letter = evt.target.innerHTML;

    keyDownEvent(letter === "⌫" ? "Backspace" : letter);
  });
});
