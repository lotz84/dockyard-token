window.onload = function() {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        alert('Please install MetaMask!')
    }

    var dtokenAddress = '0x339ffc0aa89419e45e50679f8b6c04164be2ba47';
    var etokenAddress = '0xe9694b8fa7bd9f7189f95c34c0f6ee5d0df80d89';
    var dtokenABI = getDrinkTokenABI();
    var etokenABI = getEntranceTokenABI();

    var dtoken = web3.eth.contract(dtokenABI).at(dtokenAddress);
    var etoken = web3.eth.contract(etokenABI).at(etokenAddress);

    // チケット一覧の表示
    etoken.stockCount(function(err, count){
        document.getElementById('js-stock-count').innerText = count;
        var getRec = function(n) {
            if (n == 0) return;
            etoken.stocks(n-1, function(err, stock){
                var tr = document.createElement('tr');
                var addTd = function(html) {
                    var td = document.createElement('td');
                    td.innerHTML = html;
                    tr.appendChild(td);
                }
                addTd(n-1);
                addTd(stock[0]);
                addTd(web3.fromWei(stock[1], 'ether') + ' DRTK');
                addTd('Ξ' + web3.fromWei(stock[2], 'ether'));

                etoken.stockRemainings(n-1, function(err, remainings){
                    addTd(remainings);

                    document.getElementById('js-ticket-table').appendChild(tr);
                    getRec(n-1);
                });
            })
        }
        getRec(count);
    });

    // チケットの購入
    document.getElementById('js-ticket-buy').addEventListener('click', function(e) {
        e.preventDefault();
        var buyId = document.getElementById('js-ticket-buy-id').value
        var buyValue = document.getElementById('js-ticket-buy-value').value
        var weiValue = Number(buyValue) * 1e18;
        etoken.buyToken(buyId, {value: weiValue, gasPrice: 5e9}, function(){
            location.reload();
        })
    });

    // ユーザーが所持するチケット一覧の表示
    etoken.userTokenCount(function(err, count){
        document.getElementById('js-user-ticket-count').innerText = count;
        var getRec = function(n) {
            if (n == 0) return;
            etoken.userTokens(web3.eth.accounts[0], n-1, function(err, tokenId){
                // tokenId が 0 の時は使用済み
                if(tokenId == 0) getRec(n-1);

                // tokenId は配列の位置+1で有ることに注意
                etoken.tokens(tokenId - 1, function(err, token){
                    var tr = document.createElement('tr');
                    var addTd = function(html) {
                        var td = document.createElement('td');
                        td.innerHTML = html;
                        tr.appendChild(td);
                    }
                    addTd(tokenId);
                    addTd(token[0]);
                    addTd(web3.fromWei(token[1], 'ether') + ' DRTK');

                    document.getElementById('js-user-ticket-table').appendChild(tr);
                    getRec(n-1);
                });
            });
        }
        getRec(count);
    });

    // ユーザーチケットの使用
    document.getElementById('js-user-ticket-use').addEventListener('click', function(e) {
        e.preventDefault();
        var tokenId = document.getElementById('js-user-ticket-use-id').value
        etoken.useToken(tokenId, {gasPrice: 5e9}, function(){
            location.reload();
        })
    });

    // ドリンクトークンの残高
    dtoken.balanceOf(web3.eth.accounts[0], function(err, balance){
        document.getElementById('js-drink-token').innerHTML = web3.fromWei(balance, 'ether');
    });
}

function getDrinkTokenABI() {
    return [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
}

function getEntranceTokenABI() {
    return [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stocks","outputs":[{"name":"entranceAt","type":"string"},{"name":"amountOfDrinkToken","type":"uint256"},{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stockRemainings","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokens","outputs":[{"name":"entranceAt","type":"string"},{"name":"amountOfDrinkToken","type":"uint256"},{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"userTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"drinkTokenAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"stockCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"userTokenCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"entranceAt","type":"string"},{"name":"amountOfDrinkToken","type":"uint256"},{"name":"price","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"createStock","outputs":[{"name":"stockId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"stockId","type":"uint256"}],"name":"buyToken","outputs":[{"name":"tokenId","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"useToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
}