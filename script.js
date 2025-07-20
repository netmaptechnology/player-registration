function fetchData(apiURL) {
  return fetch(apiURL).then(r=>r.json());
}

function initIndex(apiURL) {
  fetchData(apiURL).then(data => {
    const list = document.getElementById('studentList');
    const input = document.getElementById('searchInput');
    const render = filter => {
      list.innerHTML = '';
      const filtered = data.filter(item => {
        const text = `${item['Name']} ${item['Email']}`.toLowerCase();
        return !filter || text.includes(filter.toLowerCase());
      });
      if (!filtered.length) list.innerHTML = '<li class="list-group-item">No matches found.</li>';
      else filtered.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<a href="${item._url}">${item['Name']} (${item['Email']})</a>`;
        list.appendChild(li);
      });
    };
    input.oninput = ()=>render(input.value);
    render('');
  });
}

function formatDate(isoDate) {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
/*
function renderIdentityCard(data, uid) {
  document.getElementById('studentDetails').innerHTML = `
    <div class="card mx-auto" style="max-width: 350px;">
      <div class="card-body text-center">
        <h4 class="card-title mb-3">Player ID Card</h4>
        ${uid ? `<div class="mb-2"><strong>UID:</strong> ${uid}</div>` : ''}
        <h5 class="mb-2">${data.Name}</h5>
        <p class="mb-1"><strong>Date of Birth:</strong> ${formatDate(data['Date of Birth'])}</p>
        <p class="mb-1"><strong>District:</strong> ${data.District}</p>
      </div>
    </div>
  `;
}
*/

function renderIdentityCard(data, uid) {
  console.log("Raw Data:", data);
  
  let photoUrl = data.Photo || '';
  let fileId = '';

  if (photoUrl.includes("drive.google.com")) {
    const fileMatch1 = photoUrl.match(/\/d\/(.*?)\//); // for /file/d/FILE_ID/view
    const fileMatch2 = photoUrl.match(/[?&]id=([^&]+)/); // for open?id=FILE_ID

    if (fileMatch1) {
      fileId = fileMatch1[1];
      console.log("Matched fileId from /d/:", fileId);
    } else if (fileMatch2) {
      fileId = fileMatch2[1];
      console.log("Matched fileId from ?id=:", fileId);
    }

    if (fileId) {
      photoUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    } else {
      console.warn("No valid fileId found in URL.");
    }
  }

  if (!photoUrl || !fileId) {
    // fallback image
    photoUrl = 'https://i.ibb.co/JRZkXwwk/471485559-592272406722282-6638279170456780772-n.png';
    console.warn("Using fallback image:", photoUrl);
  }

  console.log("Final Photo URL:", photoUrl);

  document.getElementById('studentDetails').innerHTML = `
    <div style="
      max-width: 320px;
      margin: 0 auto;
      font-family: 'Segoe UI', sans-serif;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-top: 0;
      position: relative;
      text-align: center;
    ">
      <!-- Association Title Bar -->
      <div style="
        background: #8b1538;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 1px;
        padding: 22px 0 18px 0;
        width: 100%;
        text-align: center;
      ">
        Jharkhand Pickleball Association
      </div>

      <!-- Photo -->
      <div style="position: absolute; top: 84px; left: 50%; transform: translateX(-50%);">
        <img src="${photoUrl}" style="
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid white;
          object-fit: cover;
          background: white;
        " alt="Profile Photo" onerror="this.onerror=null; this.src='https://i.ibb.co/JRZkXwwk/471485559-592272406722282-6638279170456780772-n.png';"/>
      </div>

      <!-- Content -->
      <div style="margin-top: 75px; padding: 20px;">
        <h2 style="margin: 10px 0 5px; font-size: 22px; color: #000;">${data.Name || 'Name not available'}</h2>
        <div style="font-size: 14px; color: #666;">${data.District || 'District not available'}</div>

        ${uid ? `
          <div style="
            margin: 15px auto;
            display: inline-block;
            background: #8b1538;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
          ">ID: ${uid}</div>
        ` : ''}

        <div style="margin: 10px 0; font-size: 14px; color: #000;">
          <strong>Emergency Contact:</strong><br>
          <span style="font-weight: bold; font-size: 15px;">+91 ${data["Phone number"]}</span>
        </div>
        <!-- QR Code -->
        <div style="margin-top: 18px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(window.location.href)+"&type=verify"}" alt="QR Code" style="border:1px solid #eee; border-radius:8px;">
          <div style="font-size:11px; color:#888; margin-top:2px;">Scan for online verification</div>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #8b1538; color: white; padding: 10px; font-size: 12px;">
        <div style="margin-bottom: 5px;">
          <i class="bi bi-geo-alt-fill"></i>
        Gita Colony, Singh More, Latma Road,
	  
        </div>
        <div> Ranchi, Jharkhand.</div>
      </div>
    </div>
  `;
}


function initStudent(url) {
  const uid = new URLSearchParams(location.search).get('id');
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const student = Array.isArray(data) ? data.find(s => s._uid === uid) : data;
      if (student) {
        renderIdentityCard(student, uid);
      } else {
        document.getElementById('studentDetails').textContent = 'Student not found.';
      }
    })
    .catch(() => {
      document.getElementById('studentDetails').textContent = 'Failed to load data.';
    });
}