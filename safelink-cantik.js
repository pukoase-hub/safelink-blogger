// ====== SAFELINK GENERATOR & REDIRECT (TAMPILAN CANTIK) ======
const path = window.location.pathname;

function showGenerator() {
  const mainContent = document.querySelector('.content');
  mainContent.style.display = 'none';
  const genDiv = document.createElement('div');
  genDiv.style.maxWidth = '600px';
  genDiv.style.margin = '50px auto';
  genDiv.style.padding = '25px';
  genDiv.style.background = '#ffffff';
  genDiv.style.borderRadius = '10px';
  genDiv.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
  genDiv.innerHTML = `
    <h2 style="color:#2196f3; text-align:center;">Safelink Generator</h2>
    <p>Masukkan link yang ingin diamankan:</p>
    <textarea id="inputLink" rows="3" style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;"></textarea><br/><br/>
    <button id="btnGenerate" style="padding:12px 25px; background:#2196f3; color:#fff; border:none; border-radius:5px; cursor:pointer;">Generate Link</button>
    <div id="result" style="margin-top:20px; display:none;">
      <h3 style="color:#333;">Hasil:</h3>
      <input id="outputLink" readonly="readonly" style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;" placeholder="Hasil akan muncul di sini"/>
    </div>
  `;
  document.body.appendChild(genDiv);

  document.getElementById('btnGenerate').onclick = function() {
    const link = document.getElementById('inputLink').value.trim();
    if (!link) return alert("Masukkan URL terlebih dahulu!");
    const encoded = btoa(link);
    fetch('/feeds/posts/summary?alt=json')
      .then(res => res.json())
      .then(data => {
        const posts = data.feed.entry || [];
        if (posts.length === 0) return alert("Tidak ada postingan ditemukan!");
        const randomPost = posts[Math.floor(Math.random()*posts.length)];
        const randomLink = randomPost.link.find(l => l.rel === 'alternate').href;
        const finalUrl = randomLink + "?go=" + encoded;
        const resultDiv = document.getElementById('result');
        document.getElementById('outputLink').value = finalUrl;
        resultDiv.style.display = 'block';
      })
      .catch(() => alert("Gagal membuat safelink!"));
  };
}

function showRedirect() {
  const mainContent = document.querySelector('.content');
  mainContent.style.display = 'none';
  const redirectDiv = document.createElement('div');
  redirectDiv.style.maxWidth = '600px';
  redirectDiv.style.margin = '80px auto';
  redirectDiv.style.padding = '25px';
  redirectDiv.style.background = '#ffffff';
  redirectDiv.style.borderRadius = '10px';
  redirectDiv.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
  redirectDiv.style.textAlign = 'center';
  redirectDiv.innerHTML = `
    <h2 style="color:#2196f3;">Harap Tunggu...</h2>
    <p>Sedang menyiapkan link Anda, mohon tunggu beberapa detik.</p>
    <div id="timer" style="font-size:30px; font-weight:bold; margin:25px 0; color:#2196f3;">5</div>
    <button id="btnGo" disabled style="padding:12px 30px; background:#4caf50; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:16px;">Lanjutkan ke Link</button>
    <div class="ad-slot" style="margin:25px 0; background:#f9f9f9; border:1px dashed #ccc; padding:15px; font-style:italic; color:#777;">
      [Ruang Iklan 728x90 / responsive]
    </div>
  `;
  document.body.appendChild(redirectDiv);

  let countdown = 5;
  const timerElem = document.getElementById('timer');
  const btn = document.getElementById('btnGo');
  const timer = setInterval(() => {
    countdown--;
    timerElem.textContent = countdown;
    timerElem.style.color = countdown % 2 === 0 ? "#2196f3" : "#f44336";
    if (countdown <= 0) {
      clearInterval(timer);
      timerElem.textContent = "Klik tombol di bawah untuk melanjutkan";
      timerElem.style.color = "#4caf50";
      btn.disabled = false;
    }
  }, 1000);

  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("go");
  if (!encoded) return;
  const decoded = atob(encoded);
  btn.onclick = function() { window.location.href = decoded; };
}

// Tentukan halaman aktif
if (path.includes("/generator") || path.includes("/p/generator")) {
  showGenerator();
} else if (window.location.search.includes("?go=")) {
  showRedirect();
}
