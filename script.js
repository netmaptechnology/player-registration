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