// sanitise util functions for sanitising input
// https://medium.com/@rohitkuwar/input-sanitization-ensuring-safe-and-secure-web-applications-73fa023d1bbd
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
// remove anything that is not a letter, number, or space
// then trim whitspace from the begining and end
export function sanitiseAlphaNum(input: string): string {
  const cleanedInput = input
    // keep only letters, numbers, and spaces
    .replace(/[^a-zA-Z0-9 ]/g, "") 
    // collapse multiple spaces into one
    .replace(/\s+/g, " ")  
    // remove spaces from start and end        
    .trim(); 
    return cleanedInput;                      
};

// remove anything that is not a letter or number
// then trim whitspace from the begining and end
export function sanitiseAlphaNumNoSpaces(input: string): string {
  const cleanedInput = input
    // keep only letters and numbers
    .replace(/[^a-zA-Z0-9]/g, "") 
    // remove spaces from start and end        
    .trim(); 
    return cleanedInput;                      
};

// remove anything that is not number or decimal point
// keep only the first decimal point so 1.2.3 is 1.23
// then trim whitspace from the begining and end
export function sanitiseNumNoSpaces(input: string | number): number {
    // convert to string to use regex
    const str = String(input);
    const cleanedInput = str
    // keep only letters, numbers, decimal points, and minus sign
    .replace(/[^0-9.-]/g, "")
    // keeps only the first dot and delete others 
    .replace(/(\..*?)\./g, "$1")
    // minus sign only allowed at the very beginning (for coordinates)
    .replace(/(?!^)-/g, "")
    // remove spaces from start and end        
    .trim(); 
    // convert string back to a number and return or return 0
    return parseFloat(cleanedInput) || 0;                   
};

// remove anything that is not a letter, number, @ or .
// then trim whitspace from the begining and end
export function sanitiseEmail(input: string): string {
  const cleanedInput = input
    // keep only letters, numbers, @ or .
    .replace(/[^a-zA-Z0-9@.]/g, "") 
    // remove spaces from start and end        
    .trim(); 
    return cleanedInput;                      
};

// remove html tags < > and everything inside them
// allow everything else
export function sanitisePassword(input: string): string {
  const cleanedInput = input
    // keep anything that is not a html tag
    .replace(/<[^>]*>?/gm, '') 
    return cleanedInput;                      
};