let display = document.querySelector('.display')
let btnNum = document.querySelectorAll('.btn')

// Variável para armazenar o cálculo completo
let calculation = ''

function AddValue(value) {
    // Se value é um operador (retorna true), depois, Se a variavel é o value (retorna true)  
    if (value == "+" || value == "-" || value == "/" || value == "*" || value == "%") {
        if (calculation[calculation.length - 1] == value) {
            return
        }

        // Se a variavel é um operador, não deixa add 2 vezes repetidas  
        if (calculation[calculation.length - 1] == "+" || calculation[calculation.length - 1] == "-" ||
            calculation[calculation.length - 1] == "/" || calculation[calculation.length - 1] == "*" ||
            calculation[calculation.length - 1] == "%") {
            calculation = calculation.slice(0, -1) + value;
            display.innerHTML = calculation;
            return
        }
    }

    if (value == "(") {
        // Se a variavel esta vazia, add (  
        if (calculation == '') {
            calculation += '('
        }
        // Se não, o ultimo caracter da variavel é um numero  
        else if (lastCaracterIsNumber()) {
            if (AnyCaracterIsOperator()) {  // Se a variavel possui qualquer operador  
                if (!canCloseParenthesis()) { // Se a variavel não tem ( para fecha add *(  
                    calculation += '*('
                }
                else {                      // Se não, a variavel fecha o )
                    calculation += ')' 
                }
            } 
            else {              
                if (canCloseParenthesis()) {  // Se a variavel tem ) para fechar, add )
                    calculation += ')'
                } else {
                    calculation += '*(' // Se não, a variavel add (
                }
            }
        }
        // Se não, a variavel possui qualquer operador
        else if (AnyCaracterIsOperator()) {
            // Se o ultimo caracter for um number ou o ultino caracter for ) [retorna true/false] e a variavel tem ) para fechar
            if ((lastCaracterIsNumber() || calculation[calculation.length -1] == ')') && canCloseParenthesis()) {
               calculation += ')'
            } 
            // Se não, o ultimo caracter da variavel é ), add *(
            else if (calculation[calculation.length -1] == ')') {
                calculation += '*('
            }
            // Se não, add (
            else {
                calculation += '('
            }
        } 
        // Se não, o ultimo caracter da variavel é ), add *(
        else if (calculation[calculation.length -1] == ')') {
            calculation += '*('
        }
    // Se não tiver (, continua e ignora o de cima
    } else {
        calculation += value;
    }

    const maxLength = 25;
    if (calculation.length > maxLength) {
        calculation = calculation.slice(0, maxLength); // Define que calculation incia no 0 e finaliza no maxLength
    }
    display.innerHTML = calculation;
}

function lastCaracterIsNumber() {
    if (calculation[calculation.length - 1] == "0" || calculation[calculation.length - 1] == "1" ||
        calculation[calculation.length - 1] == "2" || calculation[calculation.length - 1] == "3" ||
        calculation[calculation.length - 1] == "4" || calculation[calculation.length - 1] == "5" ||
        calculation[calculation.length - 1] == "6" || calculation[calculation.length - 1] == "7" ||
        calculation[calculation.length - 1] == "8" || calculation[calculation.length - 1] == "9") {
        return true
    }
    return false
}

// Includes - Determina se um array/objeto contém um determinado elemento ou não, retornando true ou false
function AnyCaracterIsOperator() {
    if (calculation.includes("*") || calculation.includes("/") || calculation.includes("%") ||
        calculation.includes("+") || calculation.includes("-")) {
        return true
    }
    return false
}

function canCloseParenthesis() {
    let openParenthesis = 0
    let closeParenthesis = 0

    //criar um loop para contar os parenteses abertos/fechados
    for (let i = 0; i < calculation.length; i++) {
        if (calculation[i] === '(') {
            openParenthesis++
        } else if (calculation[i] === ')') {
            closeParenthesis++
        }
    }

    return openParenthesis > closeParenthesis
}

function removeOneValue() {
    calculation = calculation.slice(0, calculation.length - 1)
    display.innerHTML = calculation
}

function removeValue() {
    calculation = ''
    display.innerHTML = ''
}

function CalculateResult() {
    // Remove espaços desnecessários
    let expression = calculation.replace(/\s+/g, '');

    // Substitui "50%" por "0.5" (tratamento da porcentagem) e divide por 100
    expression = expression.replace(/(\d+)%/g, (match, p1) => {
        return parseFloat(p1) / 100;
    });

    // Expressão regular para separar números e operadores
    let numbers = expression.split(/[\+\-\*\/]/).map(Number); // Separa números e converte para floats
    let operators = expression.replace(/[0-9]|\./g, '').split(''); // Extrai operadores

    
    while (operators.includes('*') || operators.includes('/')) {
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '*') {
                let result = numbers[i] * numbers[i + 1];
                numbers.splice(i, 2, result); // Substitui o número atual e o próximo pelo resultado
                operators.splice(i, 1); // Remove o operador
                break; // Reinicia o loop para resolver outros operadores de mesma precedência
            } 
            else if (operators[i] === '/') {
                let result = numbers[i] / numbers[i + 1];
                numbers.splice(i, 2, result);
                operators.splice(i, 1);
                break;
            }
        }
    }

    while (operators.includes('%')) {
        for (let i = 0; i < operators.length; i++) {
            result = numbers[i] * numbers[i + 1]; // Multiplica o valor pelo valor seguinte
            numbers.splice(i, 2, result);
            operators.splice(i, 1);
            break;

        }
    }

    // Agora resolver adição e subtração
    while (operators.includes('+') || operators.includes('-')) {
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '+') {
                let result = numbers[i] + numbers[i + 1];
                numbers.splice(i, 2, result);
                operators.splice(i, 1);
                break;
            }
            else if (operators[i] === '-') {
                let result = numbers[i] - numbers[i + 1];
                numbers.splice(i, 2, result);
                operators.splice(i, 1);
                break;
            }
        }
    }

    calculation = `${numbers[0]}`;
    display.innerHTML = calculation;
}
