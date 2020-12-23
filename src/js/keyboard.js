import layouts from './layouts';

const cssClasses = {
  wrapper: 'keyboard-wrapper',
  kbContainer: 'keyboard_container',
  kbKeys: 'keyboard_keys',
  input: 'input',
  key: 'key',
  info: 'info',
  buttonConatiner: 'buttons__container',
  keySpecial: 'key-special',
  commonKey: 'common_key',
  keyPressed: 'key_pressed',
  keyActive: 'key_active',
  capsIndicator: 'caps_indicator',
  lightOn: 'on',
};

const OFFSET_FORWARD = 1;
const OFFSET_BACKWARD = -1;

let isCapsActive = false;
let isShiftActive = false;

const keyDownSet = new Set();

const isCapsOn = () => document.querySelector(`.${cssClasses.capsIndicator}`)
  .classList.contains(cssClasses.lightOn);

const defaultLang = 'en';
const saveLang = (lang) => window.localStorage.setItem('lang', lang);
const getLang = () => (window.localStorage.getItem('lang')
  ? window.localStorage.getItem('lang') : defaultLang);

const getCurrentLayout = () => layouts[getLang()];

const createKeyTextElement = (values) => {
  const [val, altVal] = values;
  const textContent = val; // toUpperCase()
  const textElement = document.createElement('span');
  const isAltValExists = altVal !== undefined;
  const isAltValDifferentChar = val.toUpperCase() !== altVal;
  const alternateContent = (isAltValExists && isAltValDifferentChar)
    ? `<div class="altValue">${altVal}</div>` : '';
  textElement.innerHTML = textContent + alternateContent;
  return textElement;
};

const createKeyTextElementCase = (values) => {
  const [val, val2, val3] = values;
  let textContent = '';
  if (isShiftActive && isCapsActive) {
    textContent = val;
  } else if (isShiftActive) {
    textContent = val2;
  } else if (isCapsActive) {
    textContent = val3;
  } else {
    textContent = val;
  }
  const textElement = document.createElement('span');
  textElement.innerHTML = textContent;
  return textElement;
};

const createKeyboardElements = () => {
  const kbElements = Object.entries(getCurrentLayout()).map((key) => {
    const [id, values] = key;
    const elem = document.createElement('div');
    elem.id = id;
    elem.classList.add(cssClasses.key);
    elem.dataset.key = 'volume';
    elem.append(createKeyTextElement(values));
    return elem;
  });
  return kbElements;
};

const createPageElements = (lang) => {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add(cssClasses.buttonConatiner);
  const buttonOpen = document.createElement('button');
  buttonOpen.classList.add(cssClasses.buttonOpen);
  buttonOpen.append(document.createTextNode('Show KB'));
  const wrapperContainer = document.createElement('div');
  wrapperContainer.classList.add(cssClasses.wrapper);
  const input = document.querySelector('input');
  input.classList.add(cssClasses.input);
  const kbContainer = document.createElement('div');
  kbContainer.classList.add(cssClasses.kbContainer);
  const capsIndicator = document.createElement('div');
  capsIndicator.classList.add(cssClasses.capsIndicator);
  kbContainer.append(capsIndicator);
  const kbKeys = document.createElement('div');
  kbKeys.classList.add(cssClasses.kbKeys);
  const kbElements = createKeyboardElements(lang);
  kbKeys.append(...kbElements);
  kbContainer.append(kbKeys);
  const info = document.createElement('div');
  info.innerHTML = `<p>Переключение языка Shift + Alt</p><p>Звуковой  набор - ${'&#9835'} на клавиатуре (выключается с небольшой задержкой).</p>`;
  info.classList.add('info');

  wrapperContainer.append(kbContainer);
  document.body.appendChild(wrapperContainer);
  return wrapperContainer;
};
let isKBShow = false;

function showKeyboard() {
  const keyboardWindow = document.querySelector('.keyboard_container');
  if (isKBShow) {
    isKBShow = false;
    keyboardWindow.style.bottom = '-150%';
  } else {
    isKBShow = true;
    keyboardWindow.style.bottom = '0';
  }
}

let currentInput = '';

function setEventInput(input) {
  const event = new Event('input');
  input.dispatchEvent(event);
}

function getInput() {
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      currentInput = input;
    });
  });

  const buttons = document.querySelectorAll('input[type="button"]');
  buttons.forEach((button) => {
    button.addEventListener('click', showKeyboard);
  });
  return currentInput;
}

const switchLayoutLowerCase = () => {
  const lang = getLang();
  saveLang(lang);
  const curLayout = getCurrentLayout();
  const kbKeysContainer = document.querySelector(`.${cssClasses.kbKeys}`);
  const keys = [...kbKeysContainer.children];
  keys.forEach((key) => {
    const values = curLayout[key.id];
    key.firstChild.remove();
    key.append(createKeyTextElement(values));
  });
};

const printCharacter = (input, char) => {
  const cursorPos = input.selectionEnd;
  const prevLine = input.value.lastIndexOf('\n', cursorPos);
  const maxCols = input.getAttribute('cols');
  if ((cursorPos - prevLine) > maxCols && input.selectionEnd - input.selectionStart === 0) {
    input.setRangeText('\n', input.selectionStart, input.selectionEnd, 'end');
  }
  if (isShiftActive) {
    const keyShiftLeft = document.querySelector('#ShiftLeft');
    const keyShiftRight = document.querySelector('#ShiftRight');
    input.setRangeText(char.toUpperCase(), input.selectionStart, input.selectionEnd, 'end');
    isShiftActive = false;
    keyShiftLeft.classList.remove('key_active');
    keyShiftRight.classList.remove('key_active');
    switchLayoutLowerCase();
  } else {
    input.setRangeText(char, input.selectionStart, input.selectionEnd, 'end');
  }
  input.focus();
};

const printText = (input, char) => {
  input.setRangeText(`${char} `, input.selectionStart, input.selectionEnd, 'end');
  input.focus();
};

const deleteCharacter = (input, offset) => {
  if (input.selectionStart === input.selectionEnd) {
    const start = Math.min(input.selectionStart, Math.max(0, input.selectionStart + offset));
    const end = Math.max(input.selectionEnd, input.selectionEnd + offset);
    input.setRangeText('', start, end, 'end');
  } else {
    input.setRangeText('', input.selectionStart, input.selectionEnd, 'end');
  }
  input.focus();
};

const moveCursorHorizontally = (n, input) => {
  input.setSelectionRange(Math.max(0, input.selectionEnd + n),
    Math.max(0, input.selectionEnd + n));
  input.focus();
};

const moveCursorDown = () => {
  const input = getInput();
  let cursorPos = input.selectionEnd;
  const prevLine = input.value.lastIndexOf('\n', cursorPos);
  const nextLine = input.value.indexOf('\n', prevLine + 1);
  if (nextLine !== -1) {
    cursorPos -= prevLine;
    input.selectionStart = nextLine + cursorPos;
    input.selectionEnd = nextLine + cursorPos;
  }
  input.focus();
};

setTimeout(() => {
  getInput();
}, 3000);

const moveCursorUp = () => {
  const input = getInput();
  let cursorPos = input.selectionEnd;
  const prevLine = input.value.lastIndexOf('\n', cursorPos);
  const secLine = input.value.lastIndexOf('\n', prevLine - 1);
  if (prevLine !== -1) {
    cursorPos -= prevLine;
    input.selectionStart = secLine + cursorPos;
    input.selectionEnd = secLine + cursorPos;
  }
  input.focus();
};

const switchLayout = () => {
  let lang = getLang();
  lang = lang === 'en' ? 'ru' : 'en';
  saveLang(lang);
  const curLayout = getCurrentLayout();
  const kbKeysContainer = document.querySelector(`.${cssClasses.kbKeys}`);
  const keys = [...kbKeysContainer.children];
  keys.forEach((key) => {
    const values = curLayout[key.id];
    key.firstChild.remove();
    key.append(createKeyTextElement(values));
  });
};

const switchLayoutUpperCase = () => {
  const lang = getLang();
  saveLang(lang);
  const curLayout = getCurrentLayout();
  const kbKeysContainer = document.querySelector(`.${cssClasses.kbKeys}`);
  const keys = [...kbKeysContainer.children];
  keys.forEach((key) => {
    const values = curLayout[key.id];
    key.firstChild.remove();
    key.append(createKeyTextElementCase(values));
  });
};

const isShiftDown = () => keyDownSet.has('ShiftLeft') || keyDownSet.has('ShiftRight');
const isAltDown = () => keyDownSet.has('AltLeft') || keyDownSet.has('AltRight');
const isLangDown = () => keyDownSet.has('Lang');
const isCapsDown = () => keyDownSet.has('CapsLock');

const processKeyPressed = (code) => {
  const input = getInput();
  setEventInput(input);
  const currentLayout = getCurrentLayout();
  switch (code) {
    case 'Backspace':
      deleteCharacter(input, OFFSET_BACKWARD);
      break;
    case 'Enter':
      break;
    case 'Tab':
      for (let i = 0; i < 4; i += 1) {
        printCharacter(input, ' ');
      }
      break;
    case 'CapsLock':
      document.querySelector(`.${cssClasses.capsIndicator}`).classList.toggle(cssClasses.lightOn);
      break;
    case 'Delete':
      deleteCharacter(input, OFFSET_FORWARD);
      break;
    case 'ArrowLeft':
      moveCursorHorizontally(OFFSET_BACKWARD, input);
      break;
    case 'ArrowRight':
      moveCursorHorizontally(OFFSET_FORWARD, input);
      break;
    case 'ArrowUp':
      moveCursorUp();
      break;
    case 'ArrowDown':
      moveCursorDown();
      break;
    case 'Lang':
      break;
    case 'Microphone':
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
    case 'AltLeft':
    case 'AltRight':
    case 'ControlLeft':
    case 'ControlRight':
    case 'WinLeft':
    case 'WinRight':
    case 'MetaLeft':
    case 'MetaRight':
      break;
    default:
    {
      const char = currentLayout[code][isShiftActive || isCapsOn() ? 1 : 0];
      let charToPrint = char;
      if ((isCapsOn() && isShiftDown())) { // caps lock + shift = lower case
        charToPrint = char.toLowerCase();
      } else if (isCapsOn()) {
        charToPrint = char.toUpperCase();
      }
      printCharacter(input, charToPrint);
      break;
    }
  }
};

const addKeyDown = (event, code) => {
  const keyElement = document.querySelector(`#${code}`);

  if (keyElement) {
    event.preventDefault();
    keyDownSet.add(code);

    keyElement.classList.add(cssClasses.keyPressed);
    processKeyPressed(code);
    if ((isShiftDown() && isAltDown()) || isLangDown()) switchLayout();

    if (isCapsDown()) {
      const keyCaps = document.querySelector('#CapsLock');
      if (isCapsActive === false) {
        isCapsActive = true;
        keyCaps.classList.add('key_active');
        switchLayoutUpperCase();
      } else {
        isCapsActive = false;
        keyCaps.classList.remove('key_active');
        switchLayoutUpperCase();
      }
    }

    if (isShiftDown()) {
      const keyShiftLeft = document.querySelector('#ShiftLeft');
      const keyShiftRight = document.querySelector('#ShiftRight');
      if (isShiftActive === false) {
        isShiftActive = true;
        keyShiftLeft.classList.add('key_active');
        keyShiftRight.classList.add('key_active');
        switchLayoutUpperCase();
      } else {
        isShiftActive = false;
        keyShiftLeft.classList.remove('key_active');
        keyShiftRight.classList.remove('key_active');
        switchLayoutUpperCase();
      }
    }
    if (isShiftActive && isCapsActive) {
      switchLayoutLowerCase();
    }
  }
};

const addKeyUp = (event, code) => {
  const keyElement = document.querySelector(`#${code}`);
  if (keyElement) {
    event.preventDefault();
    keyDownSet.delete(code);
    keyElement.classList.remove(cssClasses.keyPressed);
  }
};

const onKeyDown = (event) => {
  addKeyDown(event, event.code);
};

const onKeyUp = (event) => {
  addKeyUp(event, event.code);
};

const onMouseDown = (event) => {
  if (event.currentTarget.classList.contains(cssClasses.key)) {
    addKeyDown(event, event.currentTarget.id);
  }
};

const onMouseUp = (event) => {
  if (event.currentTarget.classList.contains(cssClasses.keyPressed)) {
    addKeyUp(event, event.currentTarget.id);
  }
};

window.addEventListener('load', () => {
  const lang = getLang();
  const pageElements = createPageElements(lang);
  document.querySelector('body').appendChild(pageElements);
  document.querySelectorAll(`.${cssClasses.key}`).forEach((keyElement) => {
    keyElement.addEventListener('mousedown', onMouseDown);
    keyElement.addEventListener('mouseup', onMouseUp);
    keyElement.addEventListener('mouseout', onMouseUp);
  });
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
});

window.addEventListener('load', () => {
  const openBut = document.querySelector('.button__kb__view');

  // When the user clicks on button, close the modal
  openBut.addEventListener('click', showKeyboard);

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = new window.SpeechRecognition();
  let isRecordActive = false;

  const start = document.getElementById('Microphone');
  rec.interimResults = false;

  const reset = () => {
    rec = undefined;
  };

  const record = () => {
    rec.lang = (getLang() === 'en') ? 'en-US' : 'ru-RU';
    rec.start();
    rec.addEventListener('result', (e) => {
      const input = getInput();
      const text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      printText(input, text);
    });
    rec.addEventListener('end', () => {
      try {
        rec.start();
      } catch (error) {
        console.log('record is finished');
      }
    });
  };

  start.addEventListener('click', (e) => {
    if (isRecordActive) {
      reset();
      isRecordActive = false;
      e.target.classList.remove('key_active');
    } else {
      isRecordActive = true;
      rec = new window.SpeechRecognition();
      record();
      e.target.classList.add('key_active');
    }
  });
});
