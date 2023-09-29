// import { key_generation, shares } from './shamir_decompose';

// import { secret_reconstruction } from './shamir_recompose';

// // m is the number of shares needed to reconstruct the key
// // m = neededShares
// // n is the number of shares generated
// // n = totalShares

// // use like this:
// // node main.js <n> <m>
// let n: number = Number(process.argv[2]);
// let m: number = Number(process.argv[3]);

// console.log("")
// const key = key_generation();
// console.log("Your key is: " + key);
// const shares_list = shares(n, m, key);
// // console.log("Shares: ", shares_list);

// for (let i = 0; i < Number(n); i++){
//   console.log("secret_:" + i + " " + shares_list[i] + "\n");
// }

// console.log("Successfully generated " + n + " shares of your key. " + m + " shares are needed to reconstruct the key.");

// console.log("")

// let secret = secret_reconstruction(m, shares_list);

// console.log("Your secret is: " + secret);

// console.log("")

// process.exit();
