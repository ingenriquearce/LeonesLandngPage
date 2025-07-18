
function cargarCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
      callback(results.data);
    }
  });
}

const url_fixture = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYXScoRCoo9DbquvdWPT7CZlImArBABXU552zmZPbsV5f-RPn1GSG4WEetgzctjw/pub?output=csv";
const url_goleadores = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYXScoRCoo9DbquvdWPT7CZlImArBABXU552zmZPbsV5f-RPn1GSG4WEetgzctjw/pub?gid=1075599834&single=true&output=csv";

document.querySelectorAll(".sub-btn").forEach(button => {
  button.addEventListener("click", () => {
    const sub = button.dataset.sub;

    cargarCSV(url_fixture, data => {
      const filtered = data.filter(d => d.Sub == sub);
      renderFixture(filtered);
      renderPosiciones(filtered);
    });

    cargarCSV(url_goleadores, data => {
      const filtered = data.filter(d => d.Sub == sub);
      renderGoleadores(filtered);
    });
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
      <td class="px-3 py-2">${row.Cancha}</td>
      <td class="px-3 py-2">${row.Local}</td>
      <td class="px-3 py-2 text-center">${row["Goles Local"] || "-"}</td>
      <td class="px-3 py-2 text-center">${row["Goles Visitante"] || "-"}</td>
      <td class="px-3 py-2">${row.Visitante}</td>
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
    [[eq1, g1, g2], [eq2, g2, g1]].forEach(([equipo, gf, gc], i) => {
      if (!tabla[equipo]) tabla[equipo] = { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, Pts: 0 };
      tabla[equipo].PJ += 1;
      tabla[equipo].GF += gf;
      tabla[equipo].GC += gc;
      if (gf > gc) tabla[equipo].PG += 1, tabla[equipo].Pts += 3;
      else if (gf === gc) tabla[equipo].PE += 1, tabla[equipo].Pts += 1;
      else tabla[equipo].PP += 1;
    });
  });

  const tbody = document.getElementById("posiciones-body");
  tbody.innerHTML = "";
  const rows = Object.entries(tabla).sort((a,b) => b[1].Pts - a[1].Pts || b[1].GF - a[1].GF);
  if (rows.length === 0) {
    tbody.innerHTML = "<tr><td colspan='8' class='text-center py-4 text-gray-400'>Sin posiciones registradas</td></tr>";
    return;
  }
  rows.forEach(([equipo, v]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2">${equipo}</td>
      <td class="px-3 py-2 text-center">${v.PJ}</td>
      <td class="px-3 py-2 text-center">${v.PG}</td>
      <td class="px-3 py-2 text-center">${v.PE}</td>
      <td class="px-3 py-2 text-center">${v.PP}</td>
      <td class="px-3 py-2 text-center">${v.GF}</td>
      <td class="px-3 py-2 text-center">${v.GC}</td>
      <td class="px-3 py-2 text-center font-bold">${v.Pts}</td>
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
