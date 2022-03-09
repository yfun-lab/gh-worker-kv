/**
 * 打包程序
 */

import fetch from "node-fetch";
import fs from "fs";
import UglifyJS from "uglify-js";

var reslist = [];
// const getFile = async (list) => {
//     var reslist = [];
//     for (let i = 0; i < list.length; i++) {
//         let url = list[i];
//         let re = await fetch(list[i], {
//             method: "GET",
//         });
//         let res = await re.text();
//         reslist.push(res);
//     }
//     return reslist;
// };
// console.log(1);
const run = async () => {
    //     let list = ["https://cdn.jsdelivr.net/npm/js-base64@3.7.1/base64.min.js"];
    //     let l = await getFile(list);
    let b64code = fs.readFileSync("./base64.js", "utf-8");
    let file = fs.readFileSync("../index.js", "utf-8");

    var code = "";
    //     for (let i = 0; i < l.length; i++) {
    //         code = code + l[i];
    //     }
    code = b64code + "\n" + file;
    // console.log(code);
    var result = UglifyJS.minify(code);
    console.log();
    if (result.error == undefined) {
        console.log(result.code);
    } else {
        console.log(result.error);
    }

    fs.writeFileSync("../dist/main.js", result);
};
run();
