async function createOrder(){
    const uid = document.getElementById("uid").value;
    const amount = document.getElementById("amount").value;
    const res = await fetch("/api/orders", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({uid, game:"Free Fire", amount})
    });
    const data = await res.json();
    alert(data.message);
}