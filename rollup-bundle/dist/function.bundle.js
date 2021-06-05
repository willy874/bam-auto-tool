/**
 * 大小寫與連接符無法混用，連接符的優先級比駝峰高
 * @constructor
 * @param {String} name
 */
function FileName(name) {
  this.data = [];
  const type = /\./.test(name) ? 'file' : 'dir';
  const getExt = () => {
    const file = name.split('.');
    return file[file.length - 1]
  };
  const getFile = () => {
    const file = name.split('.');
    file.splice(file.length - 1, 1);
    return file.join('')
  };
  this.ext = type === 'dir' ? 'dir' : getExt();
  this.name = type === 'dir' ? name : getFile();
  if (/[A-Z]/.test(this.name)) {
    const arr = this.name.split('');
    arr.forEach((s, i) => {
      if (/[A-Z]/.test(s)) {
        arr[i] = '-' + s.toLowerCase();
      }
      this.data = arr
        .join('')
        .split('-')
        .filter(p => p);
    });
  } else if (/\.|\-|_|\s/.test(this.name)) {
    const allow = ['.', '-', '_', '', '\r', '\t', '\n', '\f'];
    const arr = this.name.split('');
    arr.forEach((s, i) => {
      if (allow.includes(s)) {
        arr[i] = '-';
      }
    });
    this.data = arr.join('').split('-');
  } else {
    this.data = [this.name];
  }
}
FileName.prototype.ConverBigHump = function () {
  const arr = [];
  this.data.forEach(s => {
    if (s[0]) {
      arr.push(s[0].toUpperCase() + s.substring(1));
    }
  });
  return arr.join('')
};
FileName.prototype.ConverLittleHump = function () {
  const arr = [];
  this.data.forEach(s => {
    if (s[0]) {
      if (arr.length === 0) {
        arr.push(s.toLowerCase());
      } else {
        arr.push(s[0].toUpperCase() + s.substring(1));
      }
    }
  });
  return arr.join('')
};
var fileName = FileName;

class SubScriber {
  constructor() {
    this.steps = [];
  }
  next(callback) {
    this.steps.push(callback);
  }
  error(callback) {
    this.err = callback;
  }
  complete(callback) {
    this.steps.push(callback);
    this.steps.push('complete');
  }
}

var observable = class Observable {
  constructor(init) {
    this.subscriber = new SubScriber();
    init(this.subscriber);
  }
  run() {
    const steps = this.subscriber.steps;
    if (steps.length) {
      const action = (index = 0, data) => {
        if (steps[index] && typeof steps[index] === 'function') {
          const promise = steps[index](data);
          if (promise instanceof Promise) {
            promise
              .then(() => {
                action(index + 1, data);
              })
              .catch(this.subscriber.err);
          }
        }
      };
      action();
    }
  }
};

var valueString = function valueString(value, type) {
  switch (true) {
    case value === undefined:
      return 'undefined'
    case value === null:
      return 'null'
    case value === 0:
      return '0'
    case value === '':
      return "''"
    case isNaN(value):
      return 'NaN'
    case Array.isArray(value):
      return type === 'sql'
        ? `[${value.map(v => valueString(v)).join(',')}]`
        : `(${value.map(v => valueString(v)).join(',')})`
    case typeof value === 'string':
      return `'${value}'`
    case typeof value === 'boolean':
      return value.toString()
    case typeof value === 'number':
      return value.toString()
    case typeof value === 'function':
      return value.toString()
    case typeof value === 'object':
      return JSON.stringify(value)
  }
};

var _function = {
  FileName: fileName,
  Observable: observable,
  ValueString: valueString,
};
var _function_1 = _function.FileName;
var _function_2 = _function.Observable;
var _function_3 = _function.ValueString;

export default _function;
export { _function_1 as FileName, _function_2 as Observable, _function_3 as ValueString };
