function generateRandomCode() {
    const min = 100000; 
    const max = 999999;

    const randomCode = Math.floor(Math.random() * (max - min + 1) + min);
  
    return randomCode;
}

export {
    generateRandomCode
}
  