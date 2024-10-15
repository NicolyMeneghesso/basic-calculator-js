let display = document.querySelector('.display')
let btnNum = document.querySelectorAll('.btn')

// Variável para armazenar o cálculo completo
let calculation = ''

function AddValue(value) {
    if (value == "+" || value == "-" || value == "/" || value == "*" || value == "%") {
        if (calculation[calculation.length - 1] == value) {
            return
        }

        if (calculation[calculation.length - 1] == "+" || calculation[calculation.length - 1] == "-" ||
            calculation[calculation.length - 1] == "/" || calculation[calculation.length - 1] == "*" ||
            calculation[calculation.length - 1] == "%") {
                calculation = calculation.slice(0, -1) + value;
                display.innerHTML = calculation; 
                return
            }
    } 

    if (value == "(") {
        if (lastCaracterIsNumber()){
            if (AnyCaracterIsOperator()) {
                calculation += ')'
            }
            else {
                calculation += '*('
            }
        }
        
    }
    else {
        calculation += value;
    }

    

    console.log(calculation)

    const maxLength = 25;
    if (calculation.length > maxLength) {
        calculation = calculation.slice(0, maxLength); // Trunca o valor
    }
    display.innerHTML = calculation;
}

function lastCaracterIsNumber() {
    if (calculation[calculation.length - 1] == "0" || calculation[calculation.length - 1] == "1" ||
        calculation[calculation.length - 1] == "2" || calculation[calculation.length - 1] == "3" ||
        calculation[calculation.length - 1] == "4" || calculation[calculation.length - 1] == "5" ||
        calculation[calculation.length - 1] == "6" || calculation[calculation.length - 1] == "7" ||
        calculation[calculation.length - 1] == "8" || calculation[calculation.length - 1] == "9") 
        {
            return true
        }

        return false
}

function AnyCaracterIsOperator() {
    if (calculation.includes("*") || calculation.includes("/") || calculation.includes("%") ||
        calculation.includes("+") || calculation.includes("-")  ) {
            return true
        }
        return false
}

function removeOneValue(){
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

    expression = expression.replace(/\(\d+\)/g, '');

    // Expressão regular para separar números e operadores
    let numbers = expression.split(/[\+\-\*\/]/).map(Number); // Separa números e converte para floats
    let operators = expression.replace(/[0-9]|\./g, '').split(''); // Extrai operadores

    // while (operators.includes('(')) {
    //     for (let i = 0; i < operators.length; i++) {
    //         if (operators[i] === '*' || operators[i] === '/' || operators[i] === '%' ||
    //             operators[i] === '+' || operators[i] === '-') {
    //             let result;
    //             switch (operators[i]) {
    //                 case '*':
    //                     result = numbers[i] * numbers[i + 1];
    //                     break;
    //                 case '/':
    //                     result = numbers[i] / numbers[i + 1];
    //                     break;
    //                 case '%':
    //                     result = numbers[i] * numbers[i + 1];
    //                     break;
    //                 case '+':
    //                     result = numbers[i] + numbers[i + 1];
    //                     break;
    //                 case '-':
    //                     result = numbers[i] - numbers[i + 1];
    //                     break;
    //             }
    //             numbers.splice(i, 2, result); // Substitui o número atual e o próximo pelo resultado
    //             operators.splice(i, 1); // Remove o operador
    //             break;
    //         }
    //     }
    // }
 
    while (operators.includes('*')) {
        for (let i = 0; i < operators.length; i++) {
            let result;
            result = numbers[i] * numbers[i + 1];
            numbers.splice(i, 2, result); // Substitui o número atual e o próximo pelo resultado
            operators.splice(i, 1); // Remove o operador
            break; // Reinicia o loop para resolver outros operadores de mesma precedência
        }
    }

    while (operators.includes('/')) {
        for (let i = 0; i < operators.length; i++) {
            let result;
            result = numbers[i] / numbers[i + 1];
            numbers.splice(i, 2, result);
            operators.splice(i, 1); 
            break; 
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
            if (operators[i] === '+' || operators[i] === '-') {
                let result;
                switch (operators[i]) {
                    case '+':
                        result = numbers[i] + numbers[i + 1];
                        break;
                    case '-':
                        result = numbers[i] - numbers[i + 1];
                        break;
                }
                numbers.splice(i, 2, result); // Substitui o número atual e o próximo pelo resultado
                operators.splice(i, 1); // Remove o operador
                break;
            }
        }
    }

    calculation = `${numbers[0]}`;
    display.innerHTML = calculation;
}
