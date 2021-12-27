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
	if (23 - mantiss.length > 0) {
		mantiss = mantiss + "0".repeat(23 - mantiss.length);
	}
	mantiss = mantiss.slice(0, 23);
	return sBit + order + mantiss;
}




let fs = require('fs');
let arg = process.argv;

inputData = fs.readFileSync('operation.txt');
inputData = inputData.toString();

for (i = 0; i < inputData.length; i++){
	if (inputData[i] == '+'){
		a = inputData.slice(0, i) * 1;
		a_copy = a;
		b = inputData.slice(i + 1) * 1;
		b_copy = b;
		break;
	}
	if ((inputData[i] == '-') && (i != 0)){
		a = inputData.slice(0, i) * 1;
		a_copy = a;
		b = inputData.slice(i) * 1;
		b_copy = b;												
	}
}


a = Math.abs(a);
b = Math.abs(b);
if (a > b){
	k = a;
	a = b;
	b = k;
}
sign_a = "";
sign_b = "";
if (a == Math.abs(a_copy)){
	if (a_copy.toString()[0] == '-'){
		sign_a = "-";
	} else {
		sign_a = "+";
	}
	if (b_copy.toString()[0] == '-'){
		sign_b = "-";
	} else {
		sign_b = "+";
	}
} else {
	if (b_copy.toString()[0] == '-'){
		sign_a = "-";
	} else {
		sign_a = "+";
	}
	if (a_copy.toString()[0] == '-'){
		sign_b = "-";
	} else {
		sign_b = "+";
	}
}



float_a = float_num(a.toString());
float_b = float_num(b.toString());
zbit_s = "";
if (a_copy + b_copy >= 0){
	zbit_s = "0";
} else {
	zbit_s = "1";
}
order_s = "";
mantiss_s = "";
order_a = float_a.slice(1, 9);
order_b = float_b.slice(1, 9);

mantiss_a = '1' + float_a.slice(9);
mantiss_b = '1' + float_b.slice(9);



remained = parseInt(order_b, 2) - parseInt(order_a, 2);
order_a = order_b;
order_s = order_a;
mantiss_a = "0".repeat(remained) + mantiss_a;
mantiss_a = mantiss_a.slice(0, 24);


if (((sign_a == "+") && (sign_b == "-")) || ((sign_a == "-") && (sign_b == "+"))){
	mantiss_s = parseInt(mantiss_b, 2) - parseInt(mantiss_a, 2);
} else {
	mantiss_s = parseInt(mantiss_a, 2) + parseInt(mantiss_b, 2);
}

mantiss_s = mantiss_s.toString(2);



if (mantiss_s.length == 1){
	zbit_s = "0";
	order_s = "00000000";
	mantiss_s = "00000000000000000000000";
} else if (mantiss_s.length == 24) {
	order_s = order_a;
	mantiss_s = mantiss_s.slice(1);
} else if (mantiss_s.length == 25) {
	order_s = (parseInt(order_a, 2) + 1).toString(2);
	mantiss_s = mantiss_s.slice(1, 24);
} else if ((mantiss_s.length < 24) && (mantiss_s.length > 1)){
	r = 24 - mantiss_s.length;
	order_s = (parseInt(order_a, 2) - r).toString(2);
	order_s = "0".repeat(8 - order_s.length) + order_s;
	mantiss_s = mantiss_s.slice(1);
	if ((23 - mantiss_s.length) > 0) {
		mantiss_s = mantiss_s + '0'.repeat(23 - mantiss_s.length);
	}
}
mantiss_s = mantiss_s.slice(0, 24);



console.log(zbit_s, order_s, mantiss_s);
j = a_copy + b_copy;
console.log(float_num(j)[0], float_num(j).slice(1, 9), float_num(j).slice(9));
