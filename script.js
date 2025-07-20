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

function initStudent(apiURL) {
  const uid = new URLSearchParams(location.search).get('id');
  fetchData(apiURL).then(data => {
    const student = data.find(s=>s._uid===uid);
    const div = document.getElementById('studentDetails');
    if (!student) return div.innerHTML='<p>Student not found.</p>';
    div.innerHTML = Object.entries(student)
      .filter(([k])=>!['_uid','_url'].includes(k))
      .map(([k,v])=>`<p><strong>${k}:</strong> ${v}</p>`).join('');
  });
}