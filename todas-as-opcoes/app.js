const select = document.querySelector('#tableSelect');
const search = document.querySelector('#searchInput');
const title = document.querySelector('#tableTitle');
const head = document.querySelector('#tableHead');
const body = document.querySelector('#tableBody');
const count = document.querySelector('#rowCount');
const empty = document.querySelector('#emptyState');
let tables = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function renderTable() {
  const current = tables.find((item) => item.id === select.value) || tables[0];
  if (!current) return;
  const term = search.value.trim().toLocaleLowerCase('pt-BR');
  const rows = current.linhas.filter((row) => row.join(' ').toLocaleLowerCase('pt-BR').includes(term));
  title.textContent = current.titulo;
  count.textContent = `${rows.length} de ${current.linhas.length} registros`;
  head.innerHTML = `<tr>${current.colunas.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr>`;
  body.innerHTML = rows.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`).join('');
  empty.hidden = rows.length !== 0;
}

async function init() {
  try {
    const response = await fetch('../tabelas.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar os dados de teste.');
    const payload = await response.json();
    tables = payload.tabelas || [];
    select.innerHTML = tables.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.titulo)}</option>`).join('');
    renderTable();
  } catch (error) {
    title.textContent = 'Dados indisponíveis';
    count.textContent = '';
    empty.hidden = false;
    empty.textContent = 'Não foi possível carregar o arquivo local de dados de teste.';
  }
}

select.addEventListener('change', renderTable);
search.addEventListener('input', renderTable);
init();
