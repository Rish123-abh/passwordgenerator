// using custom attribute fetching information from html
const inputSlider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-lengthnumber]")
const passworddisplay=document.querySelector("[data-passwordDisplay]");
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');
const generateButton=document.querySelector('.generateButton');
const dataindicator=document.querySelector("[data-indicator]");
const copybtn=document.querySelector('.copybtn');
const copymsg=document.querySelector("[data-copyMsg]");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
// Symbol ki string banali jisse random symbol generate karenge 
const symbolstring = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password="";
let passwordlength=10;
let checkcount=0;
// Make strength circle color to grey
setindicator("#ccc");
handleslider();
function handleslider(){
    inputSlider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordlength-min)*100/(max-min))+"% 100%";
}

function setindicator(color){
    dataindicator.style.backgroundColor=color;
    dataindicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
    // shadow
}

function getRndInt(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generaterndNumber(){
    return getRndInt(0,9);
}
function generatelowercase(){
     return String.fromCharCode(getRndInt(97,123));
}
function generateuppercase(){
    return  String.fromCharCode(getRndInt(65,91));
}

function generateSymbol(){
const randnum=getRndInt(0,symbolstring.length);
return symbolstring.charAt(randnum);
}
// function for calculating strength
function calcstrength(){
    let uppercheck=false;
    let lowercheck=false;
    let numbercheck=false;
    let symbolcheck=false;
    // uppercase.checked means it tells whether the box is checked or not 
    if(uppercase.checked) uppercheck=true;
    if(lowercase.checked) lowercheck=true;
    if(numbers.checked) numbercheck=true;
    if(symbols.checked) symbolcheck=true;

    if (uppercheck && lowercheck && (numbercheck || symbolcheck) && passwordlength >= 8) {
        setindicator("#0f0");
    } else if (
        (lowercheck || uppercheck) &&
        (numbercheck|| symbolcheck) &&
        passwordlength >= 6
    ) {
        setindicator("#ff0");
    } else {
        setindicator("#f00");
    }
}
// In this function there is possibility of an error so we use try and catch 
async  function copytext(){
try {
    // used to copy to the clipboard 
    await navigator.clipboard.writeText(passworddisplay.value);
    copymsg.innerText="Copied";    
} 

catch (error) {
    copymsg.innerText="failed";    
}
// to make copy wala span visible
copymsg.classList.add("active");

// to make copy wala span invisible after 2seconds 
setTimeout( ()=> {copymsg.classList.remove("active");},2000);
}


// Adding event listeners to all button
// Here e = value of input slider jo user ne dee hogi 
inputSlider.addEventListener('input',(e)=> {passwordlength=e.target.value;
handleslider();}
);
copybtn.addEventListener('click',()=>{
    if(passworddisplay.value){
        copytext();
    }
});

function handlecheckboxchange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if (checkbox.checked){
            checkcount++;
        }
    });
    // special condition    
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
    } 
}



// applying add event listener on all checkbox to make ensure that if boxes not checked password not generated

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange);
});

//Fisher yates method algoritm for shufflling
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateButton.addEventListener('click',()=>{
    if (checkcount==0) return;
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
    }
    // Remove previous password
    password="";

    let funcarr=[];
    if(uppercase.checked){
        funcarr.push(generateuppercase);
    }
    if(lowercase.checked){
        funcarr.push(generatelowercase);
    }
    if(symbols.checked){
        funcarr.push(generateSymbol);
    }
    if(numbers.checked){
        funcarr.push(generaterndNumber);
    }
// Compulsory addition 
    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();
    }

    // additional addition in password 
    for(let i=0;i<passwordlength-funcarr.length;i++){
        let randdindex=getRndInt(0,funcarr.length);
        password+=funcarr[randdindex]();
    }

    // Shuffle password 
    password=shuffle(Array.from(password));
    passworddisplay.value=password;
    calcstrength();
});
