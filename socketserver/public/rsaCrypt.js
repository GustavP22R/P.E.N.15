let publicKey, privateKey;  // Declare the public and private key globally

async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;
  console.log("RSA Key Pair Generated");
}

  

  
  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let length = bytes.byteLength;
    
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);  // Use btoa() to convert to base64
  }
  
  

 // Decryption function
async function decryptMessage(encryptedMessage) {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedMessage
  );
  console.log(decryptedMessage)
  return new TextDecoder().decode(decryptedMessage); // Return the decoded message as a string

}


  async function exportPublicKeyToBase64(publicKey) {
    const spki = await crypto.subtle.exportKey("spki", publicKey);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
    return b64;
  }
  
  async function importRsaPublicKey(base64Key) {
    // 1. Decode base64 to binary string
    const binaryDerString = atob(base64Key);
  
    // 2. Convert binary string to Uint8Array
    const binaryDer = new Uint8Array([...binaryDerString].map(char => char.charCodeAt(0)));
  
    // 3. Import the key using Web Crypto API
    return await crypto.subtle.importKey(
      "spki",                     // format for public RSA keys
      binaryDer.buffer,          // key data
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,                       // extractable
      ["encrypt"]                 // key usages
    );
  }

async function exchangeKeys(pKey) 
{
  const RSAkey = await exportPublicKeyToBase64(pKey); // Wait for key to be exported
  socket.emit('mouse',RSAkey) // send as base64 for transport)
}

async function initializeRSA() 
{
  await generateRSAKeyPair();
  await exchangeKeys(publicKey) 
}


async function generateSHA256Bits(inputMessage) {
  const encoder = new TextEncoder();
  let resultBits = '';
  let counter = 0;

  while (resultBits.length < 100000000) {
      const msg = inputMessage + counter;
      const data = encoder.encode(msg);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashBits = hashArray.map(b => b.toString(2).padStart(8, '0')).join('');
      resultBits += hashBits;
      counter++;
  }

  return resultBits.slice(0, 100000000);
}

function stringToBinary(str) {
  return str.split('')   // Split the string into an array of characters
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0')) // Convert each char to binary with 8 bits
      .join(''); // Join all the binary strings into one continuous string
}

/**
 * hammingEncode - encode binary string input with hamming algorithm
 * @param {String} input - binary string, '10101'
 * @returns {String} - encoded binary string
 */
function hammingEncode(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var output = input;
	var controlBitsIndexes = [];
	var controlBits = [];
	var l = input.length;
	var i = 1;
	var key, j, arr, temp, check;

	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	for (j = 0; j < controlBitsIndexes.length; j++) {
		key = controlBitsIndexes[j];
		arr = output.slice(key - 1).split('');
		temp = chunk(arr, key);
		check = (temp.reduce(function (prev, next, index) {
			if (!(index % 2)) {
				prev = prev.concat(next);
			}
			return prev;
		}, []).reduce(function (prev, next) { return +prev + +next }, 0) % 2) ? 1 : 0;
		output = output.slice(0, key - 1) + check + output.slice(key - 1);
		if (j + 1 === controlBitsIndexes.length && output.length / (key * 2) >= 1) {
			controlBitsIndexes.push(key * 2);
		}
	}

	return output;
}


/**
 * hammingPureDecode - just removes from input parity check bits
 * @param {String} input - binary string, '10101'
 * @returns {String} - decoded binary string
 */
function hammingPureDecode(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var controlBitsIndexes = [];
	var l = input.length;
	var originCode = input;
	var hasError = false;
	var inputFixed, i;
	
	i = 1;
	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	controlBitsIndexes.forEach(function (key, index) {
		originCode = originCode.substring(0, key - 1 - index) + originCode.substring(key - index);
	});

	return originCode;
}

/**
 * hammingDecode - decodes encoded binary string, also try to correct errors
 * @param {String} input - binary string, '10101'
 * @returns {String} - decoded binary string
 */
function hammingDecode(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var controlBitsIndexes = [];
	var sum = 0;
	var l = input.length;
	var i = 1;
	var output = hammingPureDecode(input);
	var inputFixed = hammingEncode(output);


	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	controlBitsIndexes.forEach(function (i) {
		if (input[i] !== inputFixed[i]) {
			sum += i;
		}
	});

	if (sum) {
		output[sum - 1] === '1' 
			? output = replaceCharacterAt(output, sum - 1, '0')
			: output = replaceCharacterAt(output, sum - 1, '1');
	}
	return output;
}

/**
 * hammingCheck - check if encoded binary string has errors, returns true if contains error
 * @param {String} input - binary string, '10101'
 * @returns {Boolean} - hasError
 */
function hammingCheck(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var inputFixed = hammingEncode(hammingPureDecode(input));

	return hasError = !(inputFixed === input);
}

/**
 * replaceCharacterAt - replace character at index
 * @param {String} str - string
 * @param {Number} index - index
 * @param {String} character - character 
 * @returns {String} - string
 */
function replaceCharacterAt(str, index, character) {
  return str.substr(0, index) + character + str.substr(index+character.length);
}

/**
 * chunk - split array into chunks
 * @param {Array} arr - array
 * @param {Number} size - chunk size
 * @returns {Array} - chunked array
 */
function chunk(arr, size) {
	var chunks = [],
	i = 0,
	n = arr.length;
	while (i < n) {
		chunks.push(arr.slice(i, i += size));
	}
	return chunks;
}


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.hammingCode = factory();
    }
}(this, function () {
    return {
    	encode: hammingEncode,
    	pureDecode: hammingPureDecode,
    	decode: hammingDecode,
    	check: hammingCheck
    };
}));


