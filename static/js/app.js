
function cargarCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
      callback(results.data);
    }
  });
}

const url_fixture = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCYb_f-77tV7Eo7ZozBdxzN4KVaKYeL-TxGOn7UUL3JSJrYANB3GS2jSa1M3JUEg/pub?gid=1343751749&single=true&output=csv";
const url_goleadores = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCYb_f-77tV7Eo7ZozBdxzN4KVaKYeL-TxGOn7UUL3JSJrYANB3GS2jSa1M3JUEg/pub?gid=396491182&single=true&output=csv";

function activarBotonSub(sub) {
  document.querySelectorAll(".sub-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.sub == sub) btn.classList.add("active");
  });
}

function cargarSubcategoria(sub) {
  activarBotonSub(sub);

  cargarCSV(url_fixture, data => {
    const filtered = data.filter(d => d.Sub == sub);
    renderFixture(filtered);
    renderPosiciones(filtered);
  });

  cargarCSV(url_goleadores, data => {
    const filtered = data.filter(d => d.Sub == sub);
    renderGoleadores(filtered);
  });
}


let currentSub = null;

function cargarSubcategoria(sub) {
  currentSub = sub;
  activarBotonSub(sub);

  cargarCSV(url_fixture, data => {
    const categorias = [...new Set(data.filter(d => d.Sub == sub).map(d => d.Categoria))]
                        .sort((a, b) => a.localeCompare(b));
    mostrarCategorias(categorias);
    if (categorias.length > 0) {
      cargarCategoria(sub, categorias[0]);
    }
  });
}

function mostrarCategorias(categorias) {
  const contenedor = document.getElementById("categoria-buttons");
  contenedor.innerHTML = "";
  contenedor.classList.toggle("hidden", categorias.length === 0);

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "categoria-btn text-green-700 font-semibold hover:underline";
    btn.addEventListener("click", () => cargarCategoria(currentSub, cat));
    contenedor.appendChild(btn);
  });
}

function cargarCategoria(sub, categoria) {
  document.querySelectorAll(".categoria-btn").forEach(btn => btn.classList.remove("active"));
  [...document.querySelectorAll(".categoria-btn")].find(b => b.textContent == categoria)?.classList.add("active");

  document.getElementById("fixture-body").innerHTML = "<tr><td colspan='7' class='text-center py-4 text-gray-400'>Sin partidos registrados</td></tr>";
  document.getElementById("posiciones-body").innerHTML = "<tr><td colspan='7' class='text-center py-4 text-gray-400'>Sin posiciones registradas</td></tr>";
  document.getElementById("goleadores-body").innerHTML = "<tr><td colspan='3' class='text-center py-4 text-gray-400'>Sin goleadores registrados</td></tr>";


  cargarCSV(url_fixture, data => {
    const filtered = data.filter(d => d.Sub == sub && d.Categoria == categoria);
    renderFixture(filtered);
    renderPosiciones(filtered);
  });

  cargarCSV(url_goleadores, data => {
    const filtered = data.filter(d => d.Sub == sub && d.Categoria == categoria);
    renderGoleadores(filtered);
  });
}

document.querySelectorAll(".sub-btn").forEach(button => {
  button.addEventListener("click", () => {
    const sub = button.dataset.sub;
    cargarSubcategoria(sub);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  cargarCSV(url_fixture, data => {
    const subsConPartidos = [...new Set(data.map(row => row.Sub))];
    if (subsConPartidos.length > 0) {
      cargarSubcategoria(subsConPartidos[0]);
    }
  });
});

function renderFixture(data) {
  const tbody = document.getElementById("fixture-body");
  tbody.innerHTML = "";
  if (data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7' class='text-center py-4 text-gray-400'>Sin partidos registrados</td></tr>";
    return;
  }
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2">${row.Fecha}</td>
      <td class="px-3 py-2">${row.Hora}</td>
      <td class="px-3 py-2">${row.Local}</td>
      <td class="px-3 py-2 text-center">${row["Goles Local"] || "-"}</td>
      <td class="px-3 py-2 text-center">${row["Goles Visitante"] || "-"}</td>
      <td class="px-3 py-2">${row.Visitante}</td>
      <td class="px-3 py-2">${row.Cancha}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPosiciones(data) {
  const tabla = {};
  data.forEach(row => {
    const g1 = parseInt(row["Goles Local"]);
    const g2 = parseInt(row["Goles Visitante"]);
    if (isNaN(g1) || isNaN(g2)) return;

    const eq1 = row["Local"];
    const eq2 = row["Visitante"];
    [[eq1, g1, g2], [eq2, g2, g1]].forEach(([equipo, gf, gc]) => {
      if (!tabla[equipo]) tabla[equipo] = { PJ: 0, PG: 0, PE: 0, PP: 0, DG: 0, Pts: 0 };
      tabla[equipo].PJ += 1;
      tabla[equipo].DG += gf - gc;
      if (gf > gc) tabla[equipo].PG += 1, tabla[equipo].Pts += 3;
      else if (gf === gc) tabla[equipo].PE += 1, tabla[equipo].Pts += 1;
      else tabla[equipo].PP += 1;
    });
  });

  const tbody = document.getElementById("posiciones-body");
  tbody.innerHTML = "";
  const rows = Object.entries(tabla).sort((a,b) => b[1].Pts - a[1].Pts || b[1].DG - a[1].DG);
  if (rows.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7' class='text-center py-4 text-gray-400'>Sin posiciones registradas</td></tr>";
    return;
  }
  rows.forEach(([equipo, v]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2">${equipo}</td>
      <td class="px-3 py-2 text-center font-bold">${v.Pts}</td>
      <td class="px-3 py-2 text-center">${v.PJ}</td>
      <td class="px-3 py-2 text-center">${v.DG}</td>
      <td class="px-3 py-2 text-center">${v.PG || 0}</td>
      <td class="px-3 py-2 text-center">${v.PE || 0}</td>
      <td class="px-3 py-2 text-center">${v.PP || 0}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderGoleadores(data) {
  const tbody = document.getElementById("goleadores-body");
  tbody.innerHTML = "";
  if (data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3' class='text-center py-4 text-gray-400'>Sin goleadores registrados</td></tr>";
    return;
  }
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2">${row.Jugador}</td>
      <td class="px-3 py-2">${row.Equipo}</td>
      <td class="px-3 py-2 text-center">${row.Goles}</td>
    `;
    tbody.appendChild(tr);
  });
}
