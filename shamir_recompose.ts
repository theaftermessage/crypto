export function secret_reconstruction(m: number, shares: string[]){
  m = Number(m);
  const x_values: bigint[] = [];
  const y_values: bigint[] = [];
  
  try{

    for(let i = 0; i < m; i++){
      const x = BigInt(parseInt(shares[i]!.slice(0, 4), 16));
      const y_hex = shares[i]!.slice(4);
      const y = BigInt(h2d(y_hex));
      x_values!.push(x);
      y_values!.push(y);
    }
  }catch(e){
    console.log("Error: " + e);
    return "error: " + e;
  }
  const result = lagrange_interpolation(x_values, y_values);
  const secret = result!.toString(16)!.padStart(64, "0");
  // console.log("Recovered secret: " + secret);

  return secret;
}

//lagrange interpolation function is this but in code:
//\sum_{k=0}^{n-1}\left(y_{k}\left(\prod_{i=0,i\ne k}^{n-1}\frac{x-x_{i}}{x_{k}-x_{i}}\right)\right) (put this into desmos.com for example)

function lagrange_interpolation(x: bigint[], y: bigint[]): bigint {
  /*
   * Given a set of points (x_i, y_i), returns the value of the Lagrange
   * interpolating polynomial evaluated at z.
   */
  const n = x.length;

  const p = 170710135468633802373902797963023003448200376621205767451035144007114225176334129010565001622031278090983230001348856251081366174883694274536429880972840154866371035929692437560732171204507481222127040480698468063664391357003951462205648222778715772507708034473377741699096248230195561990428017619077625082111n;

  let sum = 0n;

  for (let k = 0; k < n; k++) {
    const i_values = Array.from({ length: n }, (_, i) => i);

    let denominator = 1n;
    let numerator = 1n;

    for (const i of i_values) {
      if (k !== i) {
        const x_k = BigInt(x[k] || 0);
        const x_i = BigInt(x[i] || 0);

        const numerator_without_modulo = (0n - x_i);
        const numerator_modulo = Modulo(numerator_without_modulo, p);

        numerator *= numerator_modulo;
        denominator *= (x_k - x_i) % p;
      }
    }

    sum += BigInt(y[k] || 0) * BigInt(numerator) * BigInt(modInverse(denominator, p));
  }

  return sum % p;
}

// modular inverse function that works the same as modular inverse function in sympy in python
function modInverse(a: bigint, m: bigint): bigint {
  a = BigInt(a);
  m = BigInt(m);
  a = (a % m + m) % m;

  // find the gcd
  const s: {
    a: bigint, 
    b: bigint}[] = [];

  let b: bigint = m;

  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }

  // find the inverse
  let x = 1n;
  let y = 0n;

  for (let i: number = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * (s[i]!.a / s[i]!.b)];
  }
  return (y % m + m) % m;
}

function Modulo(x: bigint, y: bigint): bigint {
  return ((x % y) + y) % y;
}

// hex to decimal function
function h2d(s: string): string {
  function add(x: string, y: string): string {
    let c = 0;
    const r: number[] = [];
    const xArr: number[] = x!.split('').map(Number);
    const yArr: number[] = y!.split('').map(Number);
    while (xArr.length || yArr.length) {
      const sum: number = (xArr.pop() || 0) + (yArr.pop() || 0) + c;
      r.unshift(sum < 10 ? sum : sum - 10);
      c = sum < 10 ? 0 : 1;
    }
    if (c) r.unshift(c);
    return r.join('');
  }

  let dec = '0';
  s.split('').forEach(function(chr: string) {
    const n: number = parseInt(chr, 16);
    for (let t = 8; t; t >>= 1) {
      dec = add(dec, dec);
      if (n & t) dec = add(dec, '1');
    }
  });
  return dec;
}