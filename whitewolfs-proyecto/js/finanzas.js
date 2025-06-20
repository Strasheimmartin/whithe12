document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIG Y CONSTANTES ---
  const consejos = [
    { min: 0.49, max: 0.51, texto: "¡Perfecto! Mantenés el flujo ideal. Sigue así, Alpha.", estado: "balanceado" },
    { min: 0, max: 0.49, texto: "¡Ojo! Estás destinando poco a activos. Incrementá tus inversiones para crecer.", estado: "poco_activos" },
    { min: 0.51, max: 1, texto: "¡Atento! El gasto en ocio/necesidades está alto. Revisa tu presupuesto.", estado: "mucho_gasto" }
  ];
  const frasesLobezno = {
    balanceado: "Tu economía está en equilibrio. El camino es claro.",
    poco_activos: "Dale más fuerza a tus inversiones y crecerás.",
    mucho_gasto: "Cuidado Alpha, ¡no descuides el control del dinero!"
  };

  // --- ELEMENTOS DOM ---
  const montoInput = document.getElementById('monto');
  const tipoMovimiento = document.getElementById('tipoMovimiento');
  const categoriaSelect = document.getElementById('categoria');
  const form = document.getElementById('registroForm');
  const filtroMes = document.getElementById('filtroMes');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const resumenDiv = document.getElementById('resumenFlujo');
  const tabla = document.getElementById('tablaHistorial').getElementsByTagName('tbody')[0];
  const imgLobezno = document.getElementById('imgLobezno');
  const fraseLobezno = document.getElementById('fraseLobezno');

  // --- STORAGE ---
  function obtenerMovimientos() {
    return JSON.parse(localStorage.getItem('movimientos') || "[]");
  }
  function guardarMovimientos(movs) {
    localStorage.setItem('movimientos', JSON.stringify(movs));
  }

  // --- AGREGAR MOVIMIENTO ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const monto = parseFloat(montoInput.value);
    if (isNaN(monto) || monto <= 0) return;
    const mov = {
      monto,
      tipo: tipoMovimiento.value,
      categoria: categoriaSelect.value,
      fecha: new Date().toISOString()
    };
    const movs = obtenerMovimientos();
    movs.unshift(mov);
    guardarMovimientos(movs);
    montoInput.value = "";
    renderizar();
  });

  // --- FILTROS ---
  filtroMes.addEventListener("change", renderizar);
  filtroCategoria.addEventListener("change", renderizar);

  // --- RENDERIZAR TODO ---
  function renderizar() {
    const movs = obtenerMovimientos();
    renderResumen(movs);
    renderTabla(movs);
    renderGrafico(movs);
    renderGraficoEvolucionSaldo(movs);
    renderLobezno(movs);
  }

  // --- RESUMEN Y CONSEJO EYWA ---
  function renderResumen(movs) {
    let ingresos = 0, gastos = 0, activos = 0, necesidades = 0, ocio = 0, salario = 0, extra = 0;
    movs.forEach(mov => {
      if (mov.tipo === "ingreso") ingresos += mov.monto;
      else gastos += mov.monto;
      if (mov.categoria === "activos") activos += mov.monto;
      else if (mov.categoria === "necesidades") necesidades += mov.monto;
      else if (mov.categoria === "ocio") ocio += mov.monto;
      else if (mov.categoria === "salario") salario += mov.monto;
      else if (mov.categoria === "extra") extra += mov.monto;
    });
    const saldo = ingresos - gastos;
    resumenDiv.innerHTML = `
      <span style="color:#00ff90">Ingresos: $${ingresos} | Gasto: $${gastos} | Saldo: $${saldo}</span>
      <br>
      <span style="color:#61ff05;font-weight:bold;">${darConsejoEYWA(activos, necesidades, ocio, ingresos, gastos)}</span>
    `;
  }
  function darConsejoEYWA(activos, necesidades, ocio, ingresos, gastos) {
    if (ingresos === 0) return "¡Comienza registrando tus ingresos!";
    const pActivos = activos / ingresos;
    const pNecesidades = necesidades / ingresos;
    const pOcio = ocio / ingresos;
    if (pActivos >= 0.45 && pActivos <= 0.55) {
      return "Consejo EYWA: Excelente distribución. Estás apalancando tu futuro.";
    } else if (pActivos < 0.3) {
      return "Consejo EYWA: Sube la inversión en activos para que tu dinero trabaje por vos.";
    } else if ((pOcio + pNecesidades) > 0.7) {
      return "Consejo EYWA: Demasiado gasto en ocio y necesidades. Busca balancear más.";
    } else {
      return "Consejo EYWA: Revisa tu flujo, puedes mejorar la distribución.";
    }
  }

  // --- TABLA DE HISTORIAL ---
  function renderTabla(movs) {
    const mesFiltro = filtroMes.value;
    const catFiltro = filtroCategoria.value;
    tabla.innerHTML = "";
    movs.filter(mov => {
      const fecha = new Date(mov.fecha);
      const mes = fecha.getMonth();
      let ok = true;
      if (mesFiltro !== "todos" && parseInt(mesFiltro) !== mes) ok = false;
      if (catFiltro !== "todos" && mov.categoria !== catFiltro) ok = false;
      return ok;
    }).forEach((mov, idx) => {
      const fecha = new Date(mov.fecha);
      const row = tabla.insertRow();
      row.innerHTML = `
        <td>$${mov.monto}</td>
        <td>${mov.tipo}</td>
        <td>${mov.categoria}</td>
        <td>${fecha.toLocaleDateString("es-AR")}</td>
        <td>
          <button style="background:#ff5050;color:#fff;padding:2px 8px;border:none;border-radius:5px;cursor:pointer;" onclick="borrarMov(${idx})">Eliminar</button>
        </td>
      `;
    });
  }

  // --- ELIMINAR MOVIMIENTO ---
  window.borrarMov = function(idx) {
    let movs = obtenerMovimientos();
    movs.splice(idx, 1);
    guardarMovimientos(movs);
    renderizar();
  }

  // --- GRÁFICO DE TORTA: Disponible vs. Gastado ---
  let chart = null;
  function renderGrafico(movs) {
    const ctx = document.getElementById('graficoFinanzas').getContext('2d');
    const totalIngresos = movs.filter(m => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
    const totalGastos = movs.filter(m => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
    let disponible = totalIngresos - totalGastos;
    if (disponible < 0) disponible = 0;
    let gastado = totalGastos;
    // Si no hay ingresos y gastos, la torta queda vacía
    let data, labels, backgroundColors;
    if (totalIngresos === 0 && totalGastos === 0) {
      data = [1];
      labels = ["Sin datos"];
      backgroundColors = ["#2e3440"];
    } else if (totalIngresos === 0) {
      // Solo hay gastos, todo rojo
      data = [gastado];
      labels = ["Gastado"];
      backgroundColors = ["#ff4060"];
    } else if (totalGastos === 0) {
      // Solo hay ingresos, todo celeste/verde
      data = [disponible];
      labels = ["Disponible"];
      backgroundColors = ["#09ffc8"];
    } else {
      // Ambos existen
      data = [disponible, gastado];
      labels = ["Disponible", "Gastado"];
      backgroundColors = ["#09ffc8", "#ff4060"];
    }

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 3,
        }]
      },
      options: {
        cutout: "62%",
        plugins: {
          legend: { display: true, position: 'top', labels: { color: '#fde047', font: { size: 13 } } },
        }
      }
    });
  }

  // --- LOBOZNO ESTADO ---
  function renderLobezno(movs) {
    const ingresos = movs.filter(m => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
    const activos = movs.filter(m => m.categoria === "activos").reduce((s, m) => s + m.monto, 0);
    let estado = "balanceado";
    if (ingresos === 0) estado = "balanceado";
    else if (activos / ingresos < 0.3) estado = "poco_activos";
    else if (activos / ingresos > 0.6) estado = "mucho_gasto";
    imgLobezno.src = `assets/img/lobezno-${estado}.png`;
    fraseLobezno.textContent = frasesLobezno[estado];
  }

  // --- INICIALIZAR ---
  renderizar();
});

// === GRÁFICO DE EVOLUCIÓN DE SALDO ===
let chartSaldo = null;
function renderGraficoEvolucionSaldo(movs) {
  const ctx = document.getElementById('graficoEvolucionSaldo').getContext('2d');
  const movsAsc = [...movs].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  let saldo = 0;
  const dataSaldo = [];
  const labels = [];
  movsAsc.forEach((mov, idx) => {
    if (mov.tipo === "ingreso") saldo += mov.monto;
    else saldo -= mov.monto;
    dataSaldo.push(saldo);
    if (idx === 0 || idx === movsAsc.length - 1 || idx % 5 === 0) {
      const fecha = new Date(mov.fecha);
      labels.push(`${fecha.getDate()}/${fecha.getMonth() + 1}`);
    } else {
      labels.push("");
    }
  });

  if (chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: "Evolución de Saldo",
        data: dataSaldo,
        borderWidth: 2.5,
        tension: 0.26,
        pointRadius: 2.5,
        borderColor: "#fde047",
        backgroundColor: "rgba(253,224,71,0.11)",
        fill: true,
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: "#aee7fa", font: { size: 11 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: "#fde047", font: { size: 12 } },
          grid: { color: "#2e3544" }
        }
      }
    }
  });
}
