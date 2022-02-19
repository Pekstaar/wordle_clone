// TRIE
export class TrieNode {
  constructor(value = null, isEnd = false) {
    this.end = isEnd;
    this.parent = null;
    this.children = {};

    if (value === null || typeof value === "string") {
      this.value = value;
    } else if (Array.isArray(value)) {
      this.value = null;

      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== "string") {
          throw new Error("All values in the input must be strings");
        } else {
          this.insert(value[i]);
        }
      }
    } else {
      throw new Error("Input must be a string or an array of strings");
    }
  }

  setEnd(end) {
    this.end = end;
  }

  insert(word) {
    let node = this;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isEnd = i === word.length - 1;

      if (!node.children[char]) {
        node.children[char] = new TrieNode(char, isEnd);
        node.children[char].parent = node;
      }

      node = node.children[char];

      if (isEnd) {
        node.setEnd(true);
      }
    }
  }

  contains(word) {
    let node = this;

    // for loop is more efficient than forEach here
    // because we can break out of for loops if desired
    for (let i = 0; i < word.length; i++) {
      const next = node.children[word[i]];

      if (next) {
        node = next;
      } else {
        return false;
      }
    }

    return node.end;
  }

  // Gets the full word if this
  // node is the end of a word.
  getWord() {
    if (this.end) {
      let word = this.value;
      let node = this;

      while (node.parent.value) {
        node = node.parent;
        word = node.value + word;
      }

      return word;
    } else {
      return null;
    }
  }

  getAllWords(node = this, words = []) {
    if (node.end) {
      words.push(node.getWord());
    }

    for (let child in node.children) {
      this.getAllWords(node.children[child], words);
    }

    return words;
  }
}
