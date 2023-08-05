import * as CryptoJS from 'crypto-js';

export function key_generation(){
  const key = CryptoJS.lib.WordArray.random(32)!.toString();
  return key;
}

export function shares(n: number, m: number, key: string) {

        // 1024 bit prime number
        const p = 170710135468633802373902797963023003448200376621205767451035144007114225176334129010565001622031278090983230001348856251081366174883694274536429880972840154866371035929692437560732171204507481222127040480698468063664391357003951462205648222778715772507708034473377741699096248230195561990428017619077625082111n;

        const decimal = BigInt("0x" + key); 

        const coeffs = [decimal];

        const x_values: bigint[] = [];

        const y_values: bigint[] = [];

        const shares_y_hex: string[] = [];

        const shares_x_hex: string[] = [];

        for(let i = 0; i < Number(m) - 1; i++){
          coeffs.push(coefficient(p));
        }

        for (let i = 1; i <= Number(n); i++) {
          const x = x_value(p);
          const y = poly(x, coeffs, p);
          x_values.push(x);
          y_values.push(y);
        }

        for (let i = 1; i <= Number(n); i++) {
          const x_val = x_values[i-1];
          const y_val = y_values[i-1];
          const x_hex = x_val!.toString(16);
          const y_hex = y_val!.toString(16);
          shares_x_hex.push(x_hex);
          shares_y_hex.push(y_hex);
        }
        
        const shares: string[] = [];

        for (let i = 0; i < Number(n); i++){
          shares.push(shares_x_hex[i]!.padStart(4, "0") + shares_y_hex[i]);
        }

        return shares;

}

// generate random coefficients from 1 to p-1, since we want to ensure that the polynomial(x) ≠ secret (we don't want a situation where all coefficients are 0)
function coefficient(p: bigint){
  let coef = BigInt(0);
  while (coef === BigInt(0)) {
    // const randomBytes = crypto.randomBytes(256);
    const randomBytes = CryptoJS.lib.WordArray.random(256)!.toString();
    coef = BigInt('0x' + randomBytes!.toString()) % p;
  }
  return coef;
}

// byte length of x values is 2 because we are combining x values and y values into one share and we want fix lenght of x values so we can split them into x and y values later
function x_value(p: bigint) {
  // you want non 0 x since we don't want to leak the secret (we want to ensure that the polynomial(x) ≠ secret)
  let x = BigInt(0);
  while (x === BigInt(0)) {
    // const randomBytes = crypto.randomBytes(2);
    const randomBytes = CryptoJS.lib.WordArray.random(2)!.toString();
    x = BigInt('0x' + randomBytes!.toString()) % p;
  }
  return x;
}

// polynomial function
function poly(x: bigint, coeffs: bigint[], p: bigint){
  let result = BigInt(0);
  for(let i = 0; i < coeffs.length; i++){
    // result += coeffs[i] * x ** BigInt(i);
    const x_pow_i = powBigInt(x, BigInt(i))
    result += coeffs[i]! * x_pow_i
  }
  return result % p;
}

function powBigInt(base: bigint, exponent: bigint) {
  let the_result = BigInt(1)
  for(let i = 0; i < exponent; i++){
    the_result *= base
  }
  return the_result
}