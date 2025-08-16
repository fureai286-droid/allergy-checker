// --- DOM要素の取得 ---
const menuInput = document.getElementById("menuInput");
const checkButton = document.getElementById("checkButton");
const userListElement = document.getElementById("userList");

let users = [];
let menus = {};

// --- データの読み込み ---
// ページが読み込まれたら、JSONファイルを非同期で読み込む
window.addEventListener('load', async () => {
    try {
        const usersResponse = await fetch('./data/users.json');
        users = await usersResponse.json();

        const menusResponse = await fetch('./data/menus.json');
        menus = await menusResponse.json();
        
        console.log("データ読み込み完了");
    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
        userListElement.innerHTML = "<li>データの読み込みに失敗しました。</li>";
    }
});


// --- チェック処理の関数 ---
function checkAllergy() {
    const menuName = menuInput.value;
    userListElement.innerHTML = ""; // 結果をリセット

    if (!menuName) {
        userListElement.innerHTML = "<li class='no-match'>メニュー名を入力してください。</li>";
        return;
    }

    if (!menus[menuName]) {
        userListElement.innerHTML = "<li class='no-match'>そのメニューは登録されていません。</li>";
        return;
    }

    const ingredients = menus[menuName];
    let foundUsers = [];

    users.forEach(user => {
        const hasAllergy = user.allergies.some(allergy => ingredients.includes(allergy));
        if (hasAllergy) {
            foundUsers.push(user.name);
        }
    });

    if (foundUsers.length > 0) {
        foundUsers.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            userListElement.appendChild(li);
        });
    } else {
        userListElement.innerHTML = "<li class='no-match'>該当する利用者はいません。</li>";
    }
}

// --- イベントリスナーの設定 ---
checkButton.addEventListener('click', checkAllergy);
// Enterキーでもチェックできるようにする
menuInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkAllergy();
    }
});