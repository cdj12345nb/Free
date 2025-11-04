const games = [
  "Axie Infinity 2",
  "CryptoBlades",
  "Morning Moon Village",
  "Borderlands 4",
  "League of Legends",
  "Counter-Strike 2",
  "Honkai: Star Rail",
  "PUBG Mobile",
  "Free Fire",
  "Block",
  "whiteout Survival",
  "Royal Match",
  "Last War: SurvivalGame",
  "Candy Crush Saga",
  "Roblox",
  "Gardena Free Fire",
  "Honor of Kings"
];
const sel = document.getElementById('gameSelect');
games.forEach(g=>{
  const opt = document.createElement('option');
  opt.value = g; opt.textContent = g; sel.appendChild(opt);
});

document.getElementById('topupForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    game: sel.value,
    uid: form.uid.value,
    phone: form.phone.value,
    package_name: form.package_name.value,
    amount: parseInt(form.amount.value)||0
  };
  const res = await fetch('/api/topup', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  const j = await res.json();
  if(j.ok) document.getElementById('result').innerText = 'ส่งคำขอสำเร็จ: ' + j.order_ref;
  else document.getElementById('result').innerText = 'Error: ' + JSON.stringify(j);
};
