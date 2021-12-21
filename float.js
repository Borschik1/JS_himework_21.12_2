function float_num(x) {
	if (x[0] == '-'){
		sBit = "1";
	} else {
		sBit = "0";
	}
	x = Math.abs(x);
	s = x.toString(2);
	if (x == 0) {
		return sBit + "0000000000000000000000000000000";
	}
	if (x > ((2 - Math.pow(2, -23)) * Math.pow(2, 127))){
		return "01111111100000000000000000000000";
	}
	dotIndex = -1;
	digit_after_dot = -1;
	for (i = 0; i < s.length; i++){
		if (s[i] == '.'){
			dotIndex = i;
			break;
		}
	}
	for (i = dotIndex; i < s.length; i++){
		if (s[i] == '1') {
			digit_after_dot = i;
			break;
		}
	}
	order = "";
	mantiss = "";
	if (Math.abs(x) >= 1){
		if (dotIndex == -1){
			order = (s.length + 126).toString(2);
		} else {
			order = (dotIndex + 126).toString(2);
		}
		mantiss = s.slice(1);
	} else {
		order = (dotIndex - digit_after_dot + 127).toString(2);
		mantiss = s.slice(digit_after_dot + 1);
	}
	order = "0".repeat(8 - order.length) + order;
	for (i = 0; i < mantiss.length; i++){
		if (mantiss[i] == '.'){
			mantiss = mantiss.slice(0, i) + mantiss.slice(i + 1);
			break;
		}
	}
	mantiss = mantiss + "0".repeat(23 - mantiss.length);
	mantiss = mantiss.slice(0, 23);
	return sBit + order + mantiss;
}


let fs = require('fs');
let arg = process.argv;


s = fs.readFileSync('input.txt');

console.log(float_num(s.toString()));