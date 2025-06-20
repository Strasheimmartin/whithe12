document.addEventListener("DOMContentLoaded", () => {
  // Temas de educación financiera: título, ícono, html
  const TEMAS = [
    {
      titulo: "¿Qué es el dinero?",
      icono: "💸",
      html: `
        <p>El dinero es un <b>medio de intercambio</b> que usamos para comprar bienes y servicios. Puede ser billetes, monedas, saldos en cuentas o incluso activos digitales.<br>
        <b>El dinero en sí no tiene valor real</b>; su valor viene de la confianza y aceptación por parte de todos.<br><br>
        <span class="ejemplo">Ejemplo: Si tenés $1.000, podés usarlos para comprar comida, pagar servicios o ahorrar. No es el papel lo que vale, sino lo que representa: la posibilidad de intercambiarlo por algo que necesitás.</span>
        <a href="https://www.youtube.com/watch?v=KvQKEXuXo1g" target="_blank" class="video-link">Ver: ¿Cómo funciona el dinero? (video explicativo)</a>
      `
    },
    {
      titulo: "Diferencia entre ingreso y gasto",
      icono: "🔄",
      html: `
        <p><b>Ingresos</b> es todo lo que entra a tu bolsillo: salario, ventas, rentas, intereses.<br>
        <b>Gastos</b> es todo lo que sale: compras, servicios, pagos, salidas.<br>
        Aprender a <b>distinguir y anotar ambos</b> es el primer paso de una vida financiera saludable.</p>
        <img src="https://i.imgur.com/4mffuyN.png" alt="ingresos vs gastos" class="img-acordeon">
        <span class="ejemplo">Ejemplo: Si ganás $100.000 por mes y gastás $80.000, tu saldo positivo es $20.000. Si gastás $110.000, estás en negativo y necesitás ajustar.</span>
      `
    },
    {
      titulo: "¿Qué es un presupuesto y para qué sirve?",
      icono: "🗂️",
      html: `
        <p>El <b>presupuesto</b> es un plan que te ayuda a <b>controlar tus ingresos y gastos</b> para no quedarte sin dinero antes de fin de mes.<br>
        Te permite ver en qué gastás, anticipar gastos fijos y planear cómo ahorrar o invertir.</p>
        <img src="https://i.imgur.com/pAxg4Kv.png" alt="presupuesto" class="img-acordeon">
        <span class="ejemplo">Ejemplo: Anotá todos tus ingresos y todos tus gastos en una tabla, y al final del mes revisá qué podés ajustar para ahorrar más.</span>
        <a href="https://www.youtube.com/watch?v=7vKZquFnaX8" target="_blank" class="video-link">Video: Cómo hacer tu presupuesto</a>
      `
    },
    {
      titulo: "¿Qué es un activo y un pasivo?",
      icono: "🏦",
      html: `
        <p><b>Activo:</b> Todo lo que pone dinero en tu bolsillo (por ejemplo: un departamento que alquilás, una inversión, un negocio propio).<br>
        <b>Pasivo:</b> Todo lo que te saca dinero (por ejemplo: una deuda, un auto que tenés que mantener, una tarjeta de crédito si no la usás bien).</p>
        <img src="https://i.imgur.com/qNoTHiE.png" alt="activo y pasivo" class="img-acordeon">
        <span class="ejemplo">Ejemplo: Comprar un auto para trabajar de Uber (te genera ingresos) puede ser un activo. Tener un auto solo para pasear (te genera gastos) es un pasivo.</span>
      `
    },
    {
      titulo: "Errores financieros más comunes",
      icono: "⚠️",
      html: `
        <ul>
          <li>No llevar registro de gastos</li>
          <li>Vivir “al día” y no ahorrar nada</li>
          <li>Endeudarse con tarjetas o préstamos para consumir</li>
          <li>No diferenciar entre necesidades y deseos</li>
          <li>Invertir sin informarse o por moda</li>
        </ul>
        <img src="https://i.imgur.com/B1bhrnI.png" alt="errores comunes" class="img-acordeon">
        <a href="https://www.youtube.com/watch?v=VhUqstX_hLE" target="_blank" class="video-link">Video: Los 5 errores que destruyen tus finanzas</a>
      `
    },
    {
      titulo: "¿Qué es ahorrar? Estrategias simples",
      icono: "💰",
      html: `
        <p>Ahorrar es separar una parte de tus ingresos y <b>no gastarlos</b> para tener un colchón, invertir o alcanzar objetivos.<br>
        Estrategias básicas: 
          <ul>
            <li>Regla 50-30-20: 50% necesidades, 30% deseos, 20% ahorro/inversión</li>
            <li>Separar el ahorro apenas cobrás</li>
            <li>Usar sobres/cuentas separadas</li>
          </ul>
        </p>
        <img src="https://i.imgur.com/NUTvULx.png" alt="ahorro" class="img-acordeon">
      `
    },
    {
      titulo: "Introducción a la inversión: ¿por qué invertir?",
      icono: "📈",
      html: `
        <p>Invertir es <b>poner tu dinero a trabajar</b> para generar más dinero. Es la única forma de protegerte de la inflación y lograr que tus ahorros crezcan.<br>
        Hay instrumentos simples (plazo fijo, fondos comunes) y más avanzados (acciones, bonos, criptomonedas).</p>
        <img src="https://i.imgur.com/NFTyo5D.png" alt="invertir" class="img-acordeon">
        <a href="https://www.youtube.com/watch?v=fpp1A1XaxOw" target="_blank" class="video-link">Video: ¿Por qué invertir?</a>
      `
    },
    {
      titulo: "Instrumentos de inversión básicos",
      icono: "🏦",
      html: `
        <ul>
          <li><b>Plazo fijo:</b> Dejá tu dinero en el banco un tiempo y te pagan intereses.</li>
          <li><b>Fondos comunes de inversión:</b> Fondo donde muchas personas ponen su dinero y un profesional lo administra.</li>
          <li><b>Acciones:</b> Comprás una parte de una empresa. Si crece, ganás. Si baja, perdés.</li>
          <li><b>Bonos:</b> Le prestás plata a un gobierno/empresa y te pagan intereses.</li>
        </ul>
        <img src="https://i.imgur.com/AxTA9xp.png" alt="instrumentos de inversión" class="img-acordeon">
        <a href="https://www.youtube.com/watch?v=GHQCXwAOPMw" target="_blank" class="video-link">Video: Tipos de inversiones</a>
      `
    },
    {
      titulo: "Mentalidad financiera y metas",
      icono: "🧠",
      html: `
        <p>El dinero es 80% mentalidad y 20% conocimiento técnico.<br>
        <b>Si creés que podés, podés. Si creés que no, también.</b><br>
        Definí metas: corto, mediano y largo plazo. Motiváte, educáte y date tiempo: el cambio es proceso, no magia.</p>
        <img src="https://i.imgur.com/c5lHRB2.png" alt="mentalidad" class="img-acordeon">
        <a href="https://www.youtube.com/watch?v=2DFFQ6PJk_s" target="_blank" class="video-link">Video: Mentalidad millonaria</a>
      `
    }
  ];

  const acordeon = document.getElementById("acordeonFinanciero");

  TEMAS.forEach((tema, i) => {
    const item = document.createElement("div");
    item.className = "acordeon-item";
    item.innerHTML = `
      <div class="acordeon-titulo" tabindex="0">
        <span class="icono">${tema.icono}</span> ${tema.titulo}
        <span class="arrow">▶</span>
      </div>
      <div class="acordeon-contenido">${tema.html}</div>
    `;
    acordeon.appendChild(item);

    // Evento de abrir/cerrar acordeón
    item.querySelector(".acordeon-titulo").onclick = () => {
      item.classList.toggle("abierto");
    };
    // Permitir abrir/cerrar con ENTER
    item.querySelector(".acordeon-titulo").onkeydown = e => {
      if(e.key === "Enter" || e.key === " ") {
        item.classList.toggle("abierto");
      }
    };
  });
});
