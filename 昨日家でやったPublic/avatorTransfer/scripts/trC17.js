// ページ移動するためのタイマーをセット
function tm() {
    tm = setTimeout("loc()", 10 * 1000);
}

function loc() {
    window.location = "./tr17.html";
}