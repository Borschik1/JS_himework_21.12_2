function float_num(num) {
	if (num == 0) {
		return "0".repeat(32);
	}
	let sign = 1;
	if (num > 0) {
		let sign = 0;
	}
    num = Math.abs(num);
    let order = Math.floor(Math.log2(num));
    num /=  Math.pow(2, order);
    let m = num % 1;
    let second = "";
    for (let i = 0; i < 23; i++) {
        m *= 2;
        second += Math.floor(m);
        m %= 1;
    }
    return sign + (127 + order).toString(2).padStart(8, "0") + second.padEnd(23, "0");
}


let fs = require('fs');
let arg = process.argv;


s = fs.readFileSync('input.txt');

console.log(float_num(s.toString()));
