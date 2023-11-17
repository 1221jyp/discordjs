const data = {
  _id: { $oid: "65561ce63ad8b5661a32c43e" },
  Guild: "935862478280212480",
  name: "390446078643929091",
  Money: { $numberInt: "100000000" },
  coins: [
    { coinName: "BTC", amount: { $numberInt: "5" } },
    { coinName: "ETH", amount: { $numberInt: "10" } },
  ],
  __v: { $numberInt: "0" },
};

// 모든 coinName과 amount 가져오기
const coinData = data.coins.map((coin) => ({
  coinName: coin.coinName,
  amount: coin.amount,
}));

console.log(coinData);
