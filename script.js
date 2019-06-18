'use strict';

// TODO:
// - decompose complex expressions
// - decompose long lines, use more variables for free
// - link this js file to html
// - use eslint to check syntax
// - remove comments or move debug code to separate functions
// - use content.push(...)... then .join(); instead of +=

function constituent(value, keys) {
  const obj = {};
  obj.value = value;
  obj.keys = keys;
  obj.inversion = function () {
    let result = '';
    for (let i = 0; i < value.length; i++) {
      if (value[i] === '1') {
        result += '0';
      } else if (value[i] === '0') {
        result += '1';
      } else {
        result += '-';
      }
    }
    return result;
  };
  return obj;
}

function isEqual(a, b) {
  const a1 = setToArray(a);
  const a2 = setToArray(b);
  return a1.length === a2.length && a1.every((v, i) => v === a2[i]);
}

function setToArray(setInstance) {
  return Array.from(setInstance).sort((a, b) => b - a);
}

const functions = [];
let ddnf = [];
function calculate(n, countFunc, inversion) {
 

  for (let i = 0; i < countFunc; i++) {
    const func = document.getElementsByClassName('value' + i);
    const arr = [];
    for (let k = 0; k < func.length; k++) {
      arr.push(func[k].value);
    }
    functions.push(arr);
  }

  for (let i = 0; i < functions[0].length; i++) {
    const keys = [];
    for (let k = 0; k < functions.length; k++) {
      if (functions[k][i] === '10'[+inversion] || functions[k][i] === '-') {
        keys.push(k + 1);
      }
    }
    if (keys.length !== 0) {
      ddnf.push(constituent(i.toString(2).padStart(n, '0'), new Set(keys)));
    }
  }
  console.log('10'[+inversion]);
  console.log(ddnf);
  const sdnf = minimization(ddnf);
  const resstring = [];
  for (let i = 0; i < sdnf.length; i++) {
    resstring.push(sdnf[i].value + '{' + [...sdnf[i].keys].join(',') + '}');
  }
  const res = document.getElementsByClassName('res')[0];
  res.innerHTML = resstring.join(' V ');


  console.log(functions);
  ddnf = [];
  for (let i = 0; i < functions[0].length; i++) {
    const keys = [];
    for (let k = 0; k < functions.length; k++) {
      if (functions[k][i] === '10'[+inversion]) {
        keys.push(k + 1);
      }
    }
    if (keys.length !== 0) {
      ddnf.push(constituent(i.toString(2).padStart(n, '0'), new Set(keys)));
    }
  }
  console.log(ddnf);
  const coverageTable = document.getElementById('coverageTable');

  const header = '<h3 class=\'title\'>Таблиця покриття</h3>';
  const output = coverage_table(sdnf, ddnf, countFunc);
  coverageTable.innerHTML = header + output;
}

function covers(constituent, implicant) {
  for (let i = 0; i < constituent.length; i++) {
    if (implicant[i] !== constituent[i] && implicant[i] !== 'X') {
      return false;
    }
  }
  return true;
}

function coverage_table(implicants, constituents, countFunc) {

  const content = [];
  const head = [];
  content.push('<tr><th></th>');
  for (let i = 1; i <= countFunc; i++) {
    for (let k = 0; k < constituents.length; k++) {
      if (constituents[k].keys.has(i)) {
        content.push('<th>',constituents[k].value,'{',i,'}','</th>');
        head.push(constituent(constituents[k].value, [i]));
      }
    }
  }
  content.push('</tr>');

  const matrix = [];
  for (let i = 0; i < implicants.length; i++) {
    const line = [];
    for (let k = 0; k < head.length; k++) {
      const imp = implicants[i];
      const col = head[k];
      const colCovers = covers(col.value, imp.value);
      const hasKey = imp.keys.has(col.keys[0]);
      line.push((hasKey && colCovers) ? 1 : 0);
    }
    matrix.push(line);
  }
  console.log(matrix);

  for (let i = 0; i < matrix[0].length; i++) {
    let pos = 0;
    let count = 0;
    for (let k = 0; k < matrix.length; k++) {
      if (matrix[k][i] === 1) {
        count++;
        pos = k;
      }
    }
    if (count === 1) {
      matrix[pos][i] = 2;
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    content.push('<tr>');
    const val = implicants[i].value;
    const listOfKeys = [...implicants[i].keys].join(',');
    content.push('<th>', val, '{', listOfKeys, '}</th>');
    for (let k = 0; k < matrix[i].length; k++) {
      if (matrix[i][k] === 2) {
        content.push('<th class=\'yellow\'>+</th>');
      } else {
        const plus = matrix[i][k] === 1 ? '+' : '';
        content.push(`<th>${plus}</th>`);
      }
    }
    content.push('</tr>');
  }

  return '<table style=\'margin: 0 auto;\'>' + content.join('') + '</table>';
}

function similar(string1, string2) {
  let nosimilar = 0;
  let st = '';
  for (let j = 0; j < string1.length; j++) {
    if (string1[j] !== string2[j]) {
      nosimilar += 1;
      st += 'X';
    } else {
      st += string1[j];
    }
  }
  return [nosimilar, st];
}

function count(string, ch) {
  let c = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === ch) {
      c++;
    }
  }
  return c;
}

function unique(arr) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    let similar = false;
    for (let k = i + 1; k < arr.length; k++) {
      if (arr[i].value === arr[k].value && isEqual(arr[i].keys, arr[k].keys)) {
        similar = true;
      }
    }
    if (!similar) {
      res.push(arr[i]);
    }
  }
  return res;
};

function minimization(ddnf) {
  const massege = [];
  for (let i = 0; i < ddnf.length; i++) {
    massege.push(ddnf[i].value + '{' + [...ddnf[i].keys].join(',') + '}');
  }
  let arr = [];
  const opt = [];
  for (let i = 0; i < ddnf.length; i++) { opt.push(0); }

  for (let i = 0; i < ddnf.length; i++) {
    for (let k = i + 1; k < ddnf.length; k++) {
      const res = similar(ddnf[i].value, ddnf[k].value);
      const nosimilar = res[0];
      const st = res[1];
      const keys = new Set([...ddnf[i].keys].filter(x => ddnf[k].keys.has(x)));

      if (nosimilar === 1 && keys.size !== 0) {

        arr.push(constituent(st, keys));
        if (isEqual(ddnf[i].keys, keys)) {
          opt[i] = 1;
        }
        if (isEqual(ddnf[k].keys, keys)) {
          opt[k] = 1;
        }
      }
    }
  }
  
  arr = unique(arr);
  
  let next_ddnf = null;
  if (arr.length !== 0) {
    if (count(arr[0].value, 'X') !== arr[0].value.length - 1) {
      next_ddnf = minimization(arr);
    } else {
      const arr_remove = [];
      for (let i = 0; i < arr.length; i++) {
        for (let k = i + 1; k < arr.length; k++) {
          const iVal = arr[i].value;
          const kVal = arr[k].value;
          const compare = (arr[i].keys.forEach(key => arr[k].keys.has(key));
          if (iVal === kVal &&  || compare ||
          (arr[k].keys.forEach(key => arr[i].keys.has(key)))) {
            arr_remove.push(arr[i]);
            arr_remove.push(arr[k]);
          }
        }
      }
      arr = unique(arr.filter(x => !arr_remove.includes(x)));
      next_ddnf = arr;
    }
    let res = ddnf.filter(x => opt[ddnf.indexOf(x)] === 0);
    for (let i = 0; i < next_ddnf.length; i++) {
      res.push(next_ddnf[i]);
    }
    res = unique(res);
    return res;
  }
  return ddnf;
}

function chang(btn) {
  btn.value = '01-'[('01-'.indexOf(btn.value) + 1) % 3];
}

function buildTable(n, countFunc) {
  let string = '';

  //start line
  string += '<tr>';
  for (let k = 0; k < n; k++) {
    string += '<th>X' + (n - k).toString() + '</th>';
  }
  for (let k = 0; k < countFunc; k++) {
    string += '<th>F' + k + '</th>';
  }
  string += '</tr>';
  //finish line

  for (let i = 0; i < Math.pow(2, n); i++) {
    //start line
    string += '<tr>';
    for (let k = 0; k < n - i.toString(2).length; k++) {
      string += '<th>0</th>';
    }
    for (let k = 0; k < i.toString(2).length; k++) {
      string += '<th>' + i.toString(2)[k] + '</th>';
    }
    for (let k = 0; k < countFunc; k++) {
      string += '<th><input class=\'value' + k.toString() + '\' type=\'button\' onclick=\'chang(this)\' value=\'0\'></th>';
    }
    string += '</tr>';
    //finish line
  }
  return '<table>' + string + '</table>';
}

const main = document.getElementsByClassName('mainGrid')[0];
const table = document.createElement('table');
//create input countFunc//////////////////////
let countFunc = 1;
let inversion = true;
//////////////////////////////////////////////
table.className = 'table grid-element';
table.innerHTML = buildTable(2, countFunc);
main.insertBefore(table, main.firstChild);

let n = 2;
const select_emount_x = document.getElementById('emountX');
const select_emount_functions = document.getElementById('emountFunctions');

function updateTable() {
  if (n !== Number(select_emount_x.value)) {
    n = Number(select_emount_x.value);
    table.innerHTML = buildTable(n, countFunc);
  } else if (countFunc !== Number(select_emount_functions.value)) {
    countFunc = Number(select_emount_functions.value);
    table.innerHTML = buildTable(n, countFunc);
  }
}

function setInversion(value) {
  inversion = value;
}

function getresult() {
  calculate(n, countFunc, inversion);
}
