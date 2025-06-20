document.addEventListener("DOMContentLoaded", () => {
  // ---- HÁBITOS RECOMENDADOS ----
  const HABITOS_RECO = [
    { nombre: "Tomar 2L de agua", tipo: "salud", desc: "Mantené tu cuerpo y mente bien hidratados.",
      beneficios: [
        "Favorece la concentración y el rendimiento mental.",
        "Mejora la energía y vitalidad.",
        "Ayuda al metabolismo y desintoxicación natural."
      ],
      explicacion: "Mantenerte bien hidratado es uno de los hábitos más simples pero poderosos que podés adoptar..."
    },
    { nombre: "30 minutos de ejercicio", tipo: "ejercicio", desc: "Mové el cuerpo para sentirte mejor física y mentalmente.",
      beneficios: [
        "Aumenta la energía y reduce el estrés.",
        "Mejora la salud cardiovascular.",
        "Libera endorfinas que te hacen más feliz."
      ],
      explicacion: "El movimiento es medicina..."
    },
    { nombre: "Leer 10 páginas", tipo: "mental", desc: "Nutre tu mente con ideas nuevas cada día.",
      beneficios: [
        "Ejercita la memoria y la concentración.",
        "Estimula la creatividad.",
        "Reduce el estrés y mejora la empatía."
      ],
      explicacion: "La lectura diaria expande tu universo interior..."
    },
    { nombre: "No consumir azúcar refinada hoy", tipo: "salud", desc: "Dale un descanso a tu organismo, evitá azúcares agregados.",
      beneficios: [
        "Mejora la energía estable durante el día.",
        "Reduce el riesgo de enfermedades metabólicas.",
        "Favorece el control del apetito y el peso."
      ],
      explicacion: "Reducir el azúcar agregado le da un respiro a tu cuerpo y mente..."
    },
    { nombre: "Agradecer 3 cosas al despertar", tipo: "mental", desc: "Comenzá tu día enfocando la mente en lo positivo.",
      beneficios: [
        "Mejora el estado de ánimo y la resiliencia.",
        "Reduce el estrés y la ansiedad.",
        "Potencia la motivación y la creatividad."
      ],
      explicacion: "La gratitud transforma el modo en que ves la vida..."
    }
  ];

  // Iconos simples por tipo de hábito
  const ICONOS = {
    "ejercicio": "💪",
    "salud": "💧",
    "mental": "📚",
    "otro": "⭐"
  };

  // ---- ELEMENTOS DOM ----
  const habitForm = document.getElementById('habitForm');
  const habitName = document.getElementById('habitName');
  const habitFreq = document.getElementById('habitFreq');
  const habitList = document.getElementById('habitList');
  const aywaFrase = document.getElementById('aywaFrase');
  const btnRecomendados = document.getElementById('btnRecomendados');
  const recoPanel = document.getElementById('recoPanel');
  const lobeznoBar = document.getElementById('lobeznoBar');
  const emojiLobezno = document.getElementById('emojiLobezno');
  const fraseLobezno = document.getElementById('fraseLobezno');
  const habitosIzqLista = document.getElementById('habitosIzqLista');

  // ---- DATOS Y STORAGE ----
  function getHabits() {
    return JSON.parse(localStorage.getItem('habitos') || '[]');
  }
  function saveHabits(habits) {
    localStorage.setItem('habitos', JSON.stringify(habits));
  }

  // ---- HISTORIAL: Guardamos últimos 7 días de cada hábito ----
  function getHistorial(h) {
    return h.historial || [];
  }
  function updateHistorial(h, cumplido) {
    let hoy = today();
    let historial = h.historial || [];
    if (historial.length && historial[historial.length - 1].fecha === hoy) {
      historial[historial.length - 1].cumplido = cumplido;
    } else {
      historial.push({fecha: hoy, cumplido});
      if(historial.length > 7) historial = historial.slice(historial.length - 7);
    }
    h.historial = historial;
    return historial;
  }

  // ---- COLUMNA IZQUIERDA: Lista de hábitos activos ----
  function renderHabitosIzq() {
    if (!habitosIzqLista) return;
    const habits = getHabits();
    if (!habits.length) {
      habitosIzqLista.innerHTML = "<li style='color:#ffe066;'>Sin hábitos activos.</li>";
      return;
    }
    habitosIzqLista.innerHTML = habits.map((h, idx) => {
      // Elegir icono según nombre/tipo
      let icono = ICONOS[buscarTipoHabito(h.name)] || ICONOS.otro;
      const historial = getHistorial(h);
      const marcadoHoy = historial.length && historial[historial.length-1].fecha === today() && historial[historial.length-1].cumplido;
      return `
        <li class="habito-izq-item${marcadoHoy ? ' cumplido' : ''}">
          <span class="icono">${icono}</span>
          <span>${h.name}</span>
          <span class="habit-tipo">${h.freq === 'diario' ? 'Diario' : 'Semanal'}</span>
          <button class="btn-mark${marcadoHoy ? ' cumplido' : ''}" title="Marcar como realizado" data-idx="${idx}">${marcadoHoy ? '✔️' : '✔'}</button>
          <button class="btn-del" title="Eliminar" data-delidx="${idx}">🗑️</button>
        </li>
      `;
    }).join('');

    // Asignar eventos después de renderizar
    habitosIzqLista.querySelectorAll('.btn-mark').forEach(btn=>{
      btn.onclick = function(){
        let idx = parseInt(this.getAttribute('data-idx'));
        marcarHabit(idx);
      };
    });
    habitosIzqLista.querySelectorAll('.btn-del').forEach(btn=>{
      btn.onclick = function(){
        let idx = parseInt(this.getAttribute('data-delidx'));
        eliminarHabit(idx);
      };
    });
  }

  // Detectar tipo (usa el recomendado, o genérico)
  function buscarTipoHabito(nombre) {
    let reco = HABITOS_RECO.find(h => h.nombre.toLowerCase() === nombre.toLowerCase());
    return reco ? reco.tipo : "otro";
  }

  // ---- PANEL CENTRAL ----
  function renderHabits() {
    const habits = getHabits();
    habitList.innerHTML = '';
    if (!habits.length) {
      habitList.innerHTML = "<p style='color:#ffe066;'>Aún no tienes hábitos registrados.</p>";
      lobeznoBar.style.display = "none";
      aywaFrase.textContent = "AYWA: ¡Agregá tu primer hábito o explorá los recomendados para comenzar la transformación!";
      renderHabitosIzq();
      return;
    }
    let allDone = true, hayRacha = false;
    habits.forEach((h, idx) => {
      const historial = getHistorial(h);
      let historialHTML = '<span class="historial">';
      for(let i=0;i<7;i++){
        const dia = historial[historial.length-7+i];
        if(!dia) {
          historialHTML += `<span class="hist-dia hist-pendiente">-</span>`;
        } else if(dia.cumplido) {
          historialHTML += `<span class="hist-dia hist-cumplido">✔</span>`;
        } else {
          historialHTML += `<span class="hist-dia hist-fallido">✗</span>`;
        }
      }
      historialHTML += '</span>';
      const marcadoHoy = historial.length && historial[historial.length-1].fecha === today() && historial[historial.length-1].cumplido;
      if(!marcadoHoy) allDone = false;
      if(h.racha >= 3) hayRacha = true;
      const div = document.createElement('div');
      div.className = 'habit-item' + (marcadoHoy ? ' cumplido' : '');
      div.innerHTML = `
        <span class="info">
          <span class="habit-name">${h.name}</span>
          <span class="habit-freq">${h.freq === 'diario' ? 'Diario' : 'Semanal'}</span>
          <span class="racha">🔥 Racha: ${h.racha || 0}</span>
          ${historialHTML}
        </span>
        <span>
          <button class="btn-done${marcadoHoy ? ' cumplido' : ''}" onclick="marcarHabit(${idx})">${marcadoHoy ? '✔' : 'Cumplir'}</button>
          <button class="btn-del" onclick="eliminarHabit(${idx})">Eliminar</button>
        </span>
      `;
      habitList.appendChild(div);
    });
    lobeznoBar.style.display = "flex";
    if(allDone){
      emojiLobezno.textContent = "🐺✨";
      fraseLobezno.textContent = "¡Lobezno Alpha celebra tu constancia! Todas las tareas están cumplidas hoy.";
    } else if(hayRacha) {
      emojiLobezno.textContent = "🐺🔥";
      fraseLobezno.textContent = "¡Vas en racha, Alpha! Tu lobo interior está creciendo fuerte.";
    } else {
      emojiLobezno.textContent = "🐺😴";
      fraseLobezno.textContent = "El lobezno espera tu acción. ¡Hoy podés avanzar!";
    }
    let frases = [
      "La constancia es el músculo secreto de todo Alpha.",
      "Si caés, levantate. AYWA cree en vos.",
      "Hoy es un gran día para sumar un paso más.",
      "Tu futuro depende de los hábitos que construís hoy.",
      "El éxito es la suma de pequeñas victorias diarias."
    ];
    aywaFrase.textContent = frases[Math.floor(Math.random()*frases.length)];
    renderHabitosIzq();
  }

  // ---- MARCAR HABITO Y ELIMINAR ----
  window.marcarHabit = function(idx) {
    const habits = getHabits();
    let h = habits[idx];
    let historial = updateHistorial(h, true);
    if(historial.length && historial[historial.length-1].fecha === today() && historial[historial.length-1].cumplido){
    } else {
      h.racha = (h.racha || 0) + 1;
    }
    saveHabits(habits);
    renderHabits();
  };

  window.eliminarHabit = function(idx) {
    if (!confirm("¿Seguro que querés eliminar este hábito?")) return;
    const habits = getHabits();
    habits.splice(idx, 1);
    saveHabits(habits);
    renderHabits();
  };

  // ---- AGREGAR HABITO MANUAL ----
  function agregarHabitoManual(nombre, frecuencia) {
    let habits = getHabits();
    if(habits.some(x => x.name.toLowerCase() === nombre.toLowerCase())) {
      alert("Ya tenés ese hábito en tu lista.");
      return false;
    }
    habits.push({
      name: nombre,
      freq: frecuencia,
      racha: 0,
      historial: []
    });
    saveHabits(habits);
    renderHabits();
    return true;
  }

  habitForm.onsubmit = function(e) {
    e.preventDefault();
    if(agregarHabitoManual(habitName.value.trim(), habitFreq.value.trim())){
      habitName.value = '';
    }
  };

  // ---- RECOMENDADOS ----
  btnRecomendados.onclick = function() {
    if(recoPanel.style.display==='block'){
      recoPanel.style.display='none';
      return;
    }
    let html = "";
    HABITOS_RECO.forEach((h, idx) => {
      html += `
      <div class="reco-hab">
        <div class="reco-titulo">${h.nombre}</div>
        <div class="reco-desc">${h.desc}</div>
        <button class="reco-btn-benef" data-beneficio="${idx}">Ver beneficios</button>
        <button class="reco-btn-add" data-add="${idx}">Agregar hábito</button>
        <div id="beneficios_${idx}" style="display:none"></div>
      </div>
      `;
    });
    recoPanel.innerHTML = html;
    recoPanel.style.display='block';

    recoPanel.querySelectorAll('.reco-btn-benef').forEach(btn=>{
      btn.onclick = function(){
        let idx = this.getAttribute('data-beneficio');
        mostrarBenef(idx);
      };
    });
    recoPanel.querySelectorAll('.reco-btn-add').forEach(btn=>{
      btn.onclick = function(){
        let idx = this.getAttribute('data-add');
        agregarHabitoRecomendado(idx);
      };
    });
  };

  function mostrarBenef(idx){
    let h = HABITOS_RECO[idx];
    let div = document.getElementById('beneficios_'+idx);
    if(div.style.display==='block'){ div.style.display='none'; return;}
    let lista = `<ul class="reco-lista">` + h.beneficios.map(b=>`<li>${b}</li>`).join('') + `</ul>`;
    div.innerHTML = `
      <div class="reco-benef">
        ${lista}
        <div class="reco-p">${h.explicacion}</div>
      </div>
    `;
    div.style.display = 'block';
  }

  function agregarHabitoRecomendado(idx){
    let h = HABITOS_RECO[idx];
    agregarHabitoManual(h.nombre, "diario");
    recoPanel.style.display='none';
    setTimeout(()=>alert("¡Hábito agregado con éxito!"),350);
  }

  // ---- UTILIDAD ----
  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
  function resetRachas() {
    let habits = getHabits();
    const t = today();
    habits.forEach(h => {
      let historial = h.historial || [];
      if(historial.length){
        let ult = historial[historial.length-1];
        if(ult.fecha !== t && ult.cumplido){
        }
        else if(ult.fecha !== t && !ult.cumplido){
          h.racha = 0;
        }
      }
    });
    saveHabits(habits);
  }
  resetRachas();
  renderHabits();
});
