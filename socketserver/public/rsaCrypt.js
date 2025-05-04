//RSA dependant variables
//primes
var p = 11
var q = 3

// public keys
var e
var n

//private keys
let phiN
let d

function calculateKeys ()
{
    
    n = p * q
    
    phiN = (p - 1) * (q - 1)
    e = chooseE()
    console.log("e: " + String(e))

    d = modInverse(e, phiN)
    console.log("d: " + String(d))
}

function encrypMessage (message)
{
    m = int(stringToNumbers(message))
    c = Math.pow(m, e) % n

    console.log("encryption input: " + String(m))
    console.log("encrypted message: " + String(c))
    return c
}
function decryptMessage (c)
{
    cMsg = int(c)
    const m = modPow(c, d, n);

    console.log("decryption input: " + String(cMsg))
    console.log("decrypted message: " + String(m))

    return m
}





function stringToNumbers (str) 
{
    let result = "";
    for (let i = 0; i < str.length; i++) 
        {
            let code = str.charCodeAt(i);
            result += code;
        }
    return int(result);
}

function numbersToString (numStr) 
{
    let result = "";
    for (let i = 0; i < numStr.length; i += 2) 
        {
            let code = parseInt(numStr.substring(i, i + 2));
            result += String.fromCharCode(code);
        }
    return String(result);
}

function modInverse (a, m) 
{
    // validate inputs
    [a, m] = [Number(a), Number(m)]
    if (Number.isNaN(a) || Number.isNaN(m)) 
        {
            return NaN // invalid input
        }
    a = (a % m + m) % m
    if (!a || m < 2)
        {
            return NaN // invalid input
        }
    // find the gcd
    const s = []
    let b = m
    while(b) 
        {
            [a, b] = [b, a % b]
            s.push({a, b})
        }

    if (a !== 1) 
        {
            return NaN // inverse does not exists
        }
    // find the inverse
    let x = 1
    let y = 0
    for(let i = s.length - 2; i >= 0; --i) 
        {
            [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
        }
    return (y % m + m) % m
  }

  function chooseE() {

    for (let e = 3; e < phiN; e += 2) {
      if (gcd(e, phiN) === 1) {
        return e;
      }
    }
  
    throw new Error("Failed to find e");
  }

  function gcd(a, b) {
    while (b != 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }



  function modPow(base, exponent, modulus) {
    base = BigInt(base);
    exponent = BigInt(exponent);
    modulus = BigInt(modulus);
  
    if (modulus === 1n) return 0n;
  
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> 1n; // divide by 2
      base = (base * base) % modulus;
    }
    return result;
  }