document.addEventListener("DOMContentLoaded", () => {
  const desafioForm = document.getElementById('desafioForm');
  const nombreInput = document.getElementById('nombreDesafio');
  const descInput = document.getElementById('descDesafio');
  const lista = document.getElementById('listaDesafios');
  const frase = document.getElementById('aywaDesafio');

  function getDesafios() {
    return JSON.parse(localStorage.getItem('desafios') || '[]');
  }
  function saveDesafios(ds) {
    localStorage.setItem('desafios', JSON.stringify(ds));
  }

  function renderDesafios() {
    const ds = getDesafios();
    lista.innerHTML = '';
    if(!ds.length){
      lista.innerHTML = "<p style='color:#ffe066;'>No hay desafíos activos.</p>";
      frase.textContent = "¡Aceptá un desafío para dar el salto!";
      return;
    }
    ds.forEach((d, idx) => {
      const div = document.createElement('div');
      div.className = 'habit-item';
      div.innerHTML = `
        <span>
          <span class="habit-name">${d.nombre}</span>
          <span style="color:#eee;margin-left:7px;font-size:.97em;">${d.desc}</span>
          <span class="racha">${d.estado ? '✔ Completado' : 'Pendiente'}</span>
        </span>
        <span>
          ${d.estado ? '' : `<button class="btn-done" onclick="cumplirDesafio(${idx})">Cumplir</button>`}
          <button class="btn-del" onclick="eliminarDesafio(${idx})">Eliminar</button>
        </span>
      `;
      lista.appendChild(div);
    });
    frase.textContent = "¡Vas a lograrlo! AYWA confía en vos.";
  }

  window.cumplirDesafio = function(idx) {
    let ds = getDesafios();
    ds[idx].estado = true;
    saveDesafios(ds);
    renderDesafios();
  };
  window.eliminarDesafio = function(idx) {
    if (!confirm("¿Seguro que querés eliminar este desafío?")) return;
    let ds = getDesafios();
    ds.splice(idx, 1);
    saveDesafios(ds);
    renderDesafios();
  };

  desafioForm.onsubmit = function(e) {
    e.preventDefault();
    let ds = getDesafios();
    ds.push({nombre: nombreInput.value, desc: descInput.value, estado: false});
    saveDesafios(ds);
    nombreInput.value = '';
    descInput.value = '';
    renderDesafios();
  };

  renderDesafios();
});
