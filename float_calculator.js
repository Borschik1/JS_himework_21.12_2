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

function bitSum(first_num, second_num) {
    first_num = "1" + first_num;
    second_num = "0" + second_num;
    let result = "";
    let add = "0";
    for (let i = 23; i > -1; i--) {
        let bit;
        if (first_num[i] == "1" && second_num[i] == "1") {
            if (add == "1") {
                bit = "1";
			} else {
                bit = "0";
                add = "1";
            }
		} else if (first_num[i] == "1" || second_num[i] == "1") {
            if (add == "1") {
                bit = "0"
			} else {
                bit = "1";
			}
		} else {
            if (add == "1") {
                bit = "1";
                add = "0";
            } else {
                bit = "0";
			}
		}
        result = bit + result;
    }
    if (result[0] == "0") {
        return [result.slice(0, 23), add];
	} else {
        return [result.slice(1, 24), add];
	}
}

function bitSum2(first_num, second_num) {
    let result = "";
    let add = "0";
    for (let i = 22; i > -1; i--) {
        let bit;
        if (first_num[i] == "1" && second_num[i] == "1") {
            if (add == "1") {
                bit = "1";
			}
            else {
                bit = "0";
                add = "1";
            }
		} else if (first_num[i] == "1" || second_num[i] == "1") {
            if (add == "1") {
                bit = "0";
			} else {
                bit = "1";
			}
		} else {
			if (add == "1") {
				bit = "1";
				add = "0";
			} else {
				bit = "0";
			}
		}
        result = bit + result;
		
    }
    return [result, add];
}


function floatSum(first_num, second_num) {
    if (first_num == 0) {
		return float_num(second_num);
	}
    if (second_num == 0) {
		return float_num(first_num);
	}
    if (first_num < second_num) {
        [second_num, first_num] = [first_num, second_num];
    }
    if (first_num < 0) {
		return floatSub(second_num, -first_num);
	}
    let order1 = Math.floor(Math.log2(first_num));
    let order2 = Math.floor(Math.log2(second_num));
    let order_rem = Math.abs(order2 - order1);
    let order = Math.max(order1, order2);
    first_num = float_num(first_num);
    second_num = float_num(second_num);
    let mantiss_1 = first_num.slice(9, 32);
    let mantiss_2 = second_num.slice(9, 32);
    if (order2 == order1) {
        let inter_answer = bitSum2(mantiss_1.padEnd(23, "0"), mantiss_2.padEnd(23, "0"));
        return "0" + (127 + order + 1).toString(2).padStart(8, "0") + inter_answer[1] + inter_answer[0].slice(0, 22);
    }

    mantiss_2 = "0".repeat(order_rem - 1) + "1" + second_num.slice(9, 32 - order_rem);
    mantiss_1 = first_num.slice(9, 32);
    let inter_answer = bitSum(mantiss_1, mantiss_2);
    let add = parseInt(inter_answer[1]);
    return "0" + (127 + order + add).toString(2).padStart(8, "0") + inter_answer[0];
}

function floatSub(first_num, second_num) {
    if (second_num == 0) {
		return float_num(first_num);
	}
    if (first_num == 0) {
		return float_num(-second_num);
	}
    if (first_num == second_num) {
		return "0".repeat(32);
	}

    let sign = 1;
	if (first_num > second_num) {
		sign = 0;
	}
    if (first_num < second_num) {
        [second_num, first_num] = [first_num, second_num];
    }
    let order1 = Math.floor(Math.log2(first_num));
    let order2 = Math.floor(Math.log2(second_num));
    first_num = float_num(first_num);
    second_num = float_num(second_num);
    let fit = -1;
    let mantiss = '';
    if (order1 !== order2) {
        let order = order1 - order2
        second_num = first_num.slice(0,9) + '0'.repeat(order - 1) + '1' + second_num.slice(9, 32 - order);
        fit = 0;
    }

    let add = 0;
    for (let i = 31; i >= 9; i--) {
        let remain = parseInt(first_num[i]) - parseInt(second_num[i]);
        mantiss = ((Math.abs(remain - add)) % 2).toString() + mantiss;
        add = ((remain + add) >= 0) ? 0 : -1;
    }

    if (fit == -1 || (fit == 0 && add == -1)) {
		let i = 0;
        while (mantiss[i] == '0') {
            fit--;
			i++;
        }
        if (add == -1) {
            i++;
            fit--;
        }
        if (order1 == order2) {
            i++;
        }
        mantiss = mantiss.slice(i, 31).padEnd(32, "0");

    }
    return sign + (parseInt(first_num.slice(1, 9), 2) + fit).toString(2).padStart(8, "0") + mantiss;
}



let fs = require('fs');

inputData = fs.readFileSync('operation.txt').toString();
listData = inputData.split(" ");
let first_num = parseFloat(listData[0]);
let operation = listData[1];
let second_num = parseFloat(listData[2]);

if (operation == "+") {
    console.log(floatSum(first_num, second_num));
} else {
    console.log(floatSub(first_num, second_num));
}
