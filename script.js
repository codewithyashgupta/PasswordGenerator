const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-Indicator]");
const generateBtn = document.querySelector(".generatorPassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox");

const symbols = '~`!@#$%^&**()_-=+{[}]";><,./?';

let password = "";
let passwordLength = 7;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// Set Password Length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandNumber() {
  return getRandInteger(0, 9);
}
function generateLowercase() {
  return String.fromCharCode(getRandInteger(97, 123));
}
function generateUppercase() {
  return String.fromCharCode(getRandInteger(65, 91));
}
function generateSymbol() {
  const randNum = getRandInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#ff0");
  }
}
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }

    // to make copy wala span visible
    copyMsg.classList.add("active")
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher Yates Methods 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j]
        array[j] = temp;        
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBox(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if (checkbox.checked) 
            checkCount++;
        
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// allCheckBox.forEach( (checkbox) => {
//     checkbox.addEventListener('change', handleCheckBox);
// })

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider(); 
})

copyBtn.addEventListener('click',() => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    // none of the check box are selected
    if (checkCount == 0)  return;
    
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's find the journey to fund new passowrd
    // remove old password
    password = "";

    // let's puts the stuff  mentioned by checkboxes
    // if (uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if (lowercaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if (numbersCheck.checked){
    //     password += generatNumber();
    // }
    // if (symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];
    if (uppercaseCheck.checked)
        funArr.push(generateUppercase);  

    if (lowercaseCheck.checked)
        funArr.push(generateLowercase); 

    if (uppercaseCheck.checked)
        funArr.push(generateUppercase); 
    
    if (numberCheck.checked)
        funArr.push(generateRandNumber); 

    if (symbolCheck.checked)
        funArr.push(generateSymbol); 

    // compulsory addition
    for (let i = 0; i < funArr.length; i++) {
       password += funArr[i]();
        }
    
    // remaining addition
    for(let i = 0; i<passwordLength-funArr.length; i++){
        let randIndex = getRandInteger(0,funArr.length);
        console.log("randIndex" + randIndex);
        password += funArr[randIndex]();
        }
        // shuffle the password
        password = shufflePassword(Array.from(password));

        // show ui
        passwordDisplay.value = password;
        // calculate strength
        calcStrength();
    })


