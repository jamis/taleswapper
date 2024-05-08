// This file implements a very simple, very naive RTF parser and
// RTF-to-HTML translator.

const COMMAND_RE = new RegExp('[a-zA-Z]');
const ARG_RE = new RegExp('[0-9]');
const TEXT_RE = new RegExp('[^{}\\\\]');

function strbytes(string) {
  return Uint8Array.from(string.split('').map(c => c.charCodeAt()));
}

class Scanner {
  constructor(string) {
    this.pos = 0;
    this.string = string;
  }

  next() {
    if (this.pos >= this.string.length)
      return null;

    const c = this.string.charAt(this.pos++);
    switch(c) {
      case '{': return { type: 'group-start', pos: this.pos - 1 };
      case '}': return { type: 'group-end', pos: this.pos - 1 };
      case ';': return { type: 'semi', pos: this.pos - 1 };
      case '\n': return this.next();
      case '\\': return this.tokenizeCommand();
    }

    this.pos--;
    return this.scanText();
  }

  tokenizeCommand() {
    const peek = this.string.charAt(this.pos);
    if (peek === "'") {
      let savePos = this.pos;
      let n = this.string.substring(this.pos + 1, this.pos + 3);
      this.pos += 3;
      return { type: 'text', value: String.fromCharCode(parseInt(n, 16)), pos: savePos };
    } else if (!peek.match(COMMAND_RE)) {
      this.pos++;
      return { type: 'escape', value: peek, pos: this.pos - 1 };
    }

    const cmdStart = this.pos;
    while (this.pos < this.string.length && this.string.charAt(this.pos).match(COMMAND_RE)) this.pos++;
    const command = this.string.substring(cmdStart, this.pos);

    const argStart = this.pos;
    if (this.string.charAt(this.pos) === '-') this.pos++;
    while (this.pos < this.string.length && this.string.charAt(this.pos).match(ARG_RE)) this.pos++;
    const arg = this.string.substring(argStart, this.pos);

    if (this.string.charAt(this.pos) === ' ') this.pos++;

    return { type: 'command', value: command, arg, pos: cmdStart };
  }

  scanText() {
    const textStart = this.pos;
    while (this.pos < this.string.length && this.string.charAt(this.pos).match(TEXT_RE)) this.pos++;

    return { type: 'text', value: this.string.substring(textStart, this.pos) };
  }
}

class Parser {
  constructor(string) {
    this.tokens = new Scanner(string);
    this.parse();
  }

  parse() {
    this.currentContext = {};
    this.stack = [];
    this.document = [];

    for (let tok = this.tokens.next(); tok; tok = this.tokens.next()) {
      switch(tok.type) {
        case 'group-start':
          this.stack.push(this.currentContext);
          this.currentContext = Object.create(this.currentContext);
          break;
        case 'group-end':
          this.currentContext = this.stack.pop();
          break;
        case 'command':
          this.processCommand(tok);
          break;
        case 'semi':
          // skip for now
          break;
        case 'text':
          if (!this.currentContext.ignoreText) {
            let text = this.currentContext.textDecoder ?
              this.currentContext.textDecoder.decode(strbytes(tok.value)) :
              tok.value;
            this.document.push({ type: 'text', value: text });
          }
          break;
        case 'escape':
          if (!this.currentContext.ignoreText && tok.value === '\n')
            this.document.push({ type: 'para' });
          break;
        default:
          console.log('no handler for', tok);
      }
    }
  }

  processCommand(token) {
    switch(token.value) {
      case 'fonttbl':
      case 'colortbl':
      case 'stylesheet':
        this.currentContext.ignoreText = true;
        break;
      case 'ansicpg':
        this.currentContext.textDecoder = new TextDecoder(this.decoderLabelFor(token.value, token.arg));
        break;
      case 'par':
      case 'pard':
        this.document.push({ type: 'para' });
        break;
      case 'i':
        this.currentContext.em = token.arg != '0';
        this.document.push({ type: 'em', state: this.currentContext.em });
        break;
      case 'b':
        this.currentContext.strong = token.arg != '0';
        this.document.push({ type: 'strong', state: this.currentContext.strong });
        break;
    }
  }

  decoderLabelFor(scope, id) {
    switch(scope) {
      case 'ansicpg': return 'cp' + id;
      default:
        console.warn('unsupported label scope', scope, 'with id', id);
        return 'cp1252'; // totally arbitrary and almost guaranteed to fail, but it's something...
    }
  }
}

function itemToHTML(item) {
  if (item.contents) {
    let contents = item.contents.map(itemToHTML).join('');
    return `<${item.type}>${contents}</${item.type}>`;
  } else {
    return item.value;
  }
}

function toHTML(rtfString) {
  const parser = new Parser(rtfString);
  let currentBlock = null;
  let blocks = [];

  parser.document.forEach(item => {
    switch(item.type) {
      case 'para':
        currentBlock = { type: 'p', contents: [] };
        blocks.push(currentBlock);
        break;
      case 'text':
        currentBlock.contents.push(item);
        break;
      default:
        if (item.state) {
          const newBlock = { type: item.type, contents: [], parent: currentBlock };
          currentBlock.contents.push(newBlock);
          currentBlock = newBlock;
        } else {
          currentBlock = currentBlock.parent;
        }
    }
  });

  if (blocks.length > 0 && blocks[blocks.length - 1].contents.length < 1)
    blocks.pop();

  return blocks.map(itemToHTML).join('\n');
}

export default { Scanner, Parser, toHTML };
