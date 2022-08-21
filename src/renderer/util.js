export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const getAtJsPath = (input, obj) => {
  return input.split('.').reduce((o, s) => o[s], obj);
};

export const setAtJsPath = (input, obj, val) => {
  const pathValues = input.split('.');

  pathValues.reduce((o, s, i) => {
    if (i !== pathValues.length - 1) {
      return o[s];
    }

    o[s] = val;
  }, obj);
};
