async function getOrders(){
    const res = await fetch("/api/orders");
    const orders = await res.json();
    const div = document.getElementById("orders");
    div.innerHTML = orders.map(o => 
        'ID:'+o.id+' UID:'+o.uid+' Amount:'+o.amount+' Status:'+o.status+' <button onclick="confirmOrder('+o.id+')">ยืนยัน</button>'
    ).join('<br>');
}

async function confirmOrder(id){
    const res = await fetch("/api/orders/confirm", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id})
    });
    const data = await res.json();
    alert(data.message);
    getOrders();
}