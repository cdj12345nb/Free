
const correctUsername = "admin";
const correctPassword = "topuplao123";

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === correctUsername && p === correctPassword) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadOrders();
    loadPrices();
  } else {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
}
function logout() {
  location.reload();
}

function loadOrders() {
  const dummyData = [
    { uid: "123456", package: "50", phone: "020000111", status: "รอเติม" },
    { uid: "987654", package: "100", phone: "020000222", status: "เติมแล้ว" }
  ];
  const tbody = document.getElementById("orderList");
  tbody.innerHTML = "";
  dummyData.forEach((o, i) => {
    tbody.innerHTML += `<tr>
      <td>${o.uid}</td>
      <td>${o.package}</td>
      <td>${o.phone}</td>
      <td>${o.status}</td>
      <td><button onclick="toggleStatus(${i})">เปลี่ยนสถานะ</button></td>
    </tr>`;
  });
}
function toggleStatus(index) {
  alert("ฟังก์ชันเปลี่ยนสถานะจำลอง (ในเวอร์ชันเต็มจะเชื่อมฐานข้อมูล)");
}
function savePrices() {
  const p50 = document.getElementById("price50").value;
  const p100 = document.getElementById("price100").value;
  const p200 = document.getElementById("price200").value;
  alert("บันทึกราคาใหม่เรียบร้อย:\n50 เพชร = " + p50 + "฿\n100 เพชร = " + p100 + "฿\n200 เพชร = " + p200 + "฿");
}
