const regex = /ng\b/g
const str = `Regex là gì?
Regex là các mẫu (pattern) thay vì các chuỗi cụ thể được sử dụng tìm/thay thế (Find/Replace). 
Là một công cụ cực mạnh cho xử lí chuỗi trong Php, javascript… 
Ví dụ: Khi kiểm tra tính hợp lệ của email hoặc số điện thoại thì điều bạn nghĩ tới đầu tiên chính là regex. 
Regex là viết tắt của Regular Expression, tên thuần Việt là biểu thức chính quy.`
let m

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`)
    })
}