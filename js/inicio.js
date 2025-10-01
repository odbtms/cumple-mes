// inicio.js - validación de acceso simple

// CONFIGURA AQUÍ la fecha clave (formato base DD/MM/YYYY)
const FECHA_CLAVE_BASE = '02/07/2025'; // 02 de julio 2025
const FECHA_ISO = '2025-07-02'; // para input type=date

// Genera todas las variantes aceptadas de la fecha: 02/07/2025, 2/7/2025, 02-07-2025, 2-7-2025, 02072025
function variantesFecha(fecha){
	const [d,m,y] = fecha.split('/');
	const d2 = String(parseInt(d,10));
	const m2 = String(parseInt(m,10));
	return new Set([
		`${d}/${m}/${y}`,
		`${d2}/${m2}/${y}`,
		`${d}-${m}-${y}`,
		`${d2}-${m2}-${y}`,
		`${d}${m}${y}`,
		`${d2}${m2}${y}`,
		FECHA_ISO // formato ISO para input date
	]);
}
const FECHAS_VALIDAS = variantesFecha(FECHA_CLAVE_BASE);

// Hash simple (no seguro para producción real) - se usa para no dejar texto plano evidente
function hashSimple(str){
	let h = 0, i, chr;
	if(str.length === 0) return h.toString();
	for(i=0;i<str.length;i++){
		chr = str.charCodeAt(i);
		h = ((h << 5) - h) + chr;
		h |= 0; // Convert to 32bit
	}
	return h.toString(16);
}

// Genera hashes de cada variante (para ofuscar levemente)
const HASHES_VALIDOS = new Set(Array.from(FECHAS_VALIDAS).map(f => hashSimple(f)));

const form = document.getElementById('formAcceso');
const input = document.getElementById('clave');
const estado = document.getElementById('estado');
const btn = document.getElementById('btnIngresar');
const heartsLogin = document.getElementById('heartsLogin');
document.getElementById('anioLogin').textContent = new Date().getFullYear();

// Generar corazones suaves
function crearCorazon(){
	const span = document.createElement('span');
	span.textContent = ['❤','💖','💘','💕','💞'][Math.floor(Math.random()*5)];
	span.style.left = Math.random()*100 + '%';
	span.style.bottom = '-10px';
	span.style.fontSize = (10 + Math.random()*18) + 'px';
	span.style.animationDuration = (5 + Math.random()*5) + 's';
	heartsLogin.appendChild(span);
	setTimeout(()=> span.remove(), 10000);
}
setInterval(crearCorazon, 1200);

// Evitar ver la clave con inspección muy fácil (ofuscación mínima)
console.log('%cRincón especial 💫','color:#ff4f84;font-size:14px;font-weight:600');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	let valor = (input.value || '').trim();
	// Si viene desde input type=date será formato ISO (YYYY-MM-DD)
	if(/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
		// Convertir a DD/MM/YYYY para normalizar
		const [Y,M,D] = valor.split('-');
		valor = `${D}/${M}/${Y}`;
	}
	// Normalizar separadores comunes a '/'
	valor = valor.replace(/[-.]/g,'/');
	// Si viene en forma compacta 02072025 -> 02/07/2025
	if(/^\d{8}$/.test(valor)) {
		valor = `${valor.slice(0,2)}/${valor.slice(2,4)}/${valor.slice(4)}`;
	}
	// Eliminar ceros extra (para comparar variantes)
	let partes = valor.split('/');
	if(partes.length === 3) {
		const [dd,mm,yy] = partes;
		const ddN = parseInt(dd,10); const mmN = parseInt(mm,10); const yyN = parseInt(yy,10);
		if(!isNaN(ddN)&&!isNaN(mmN)&&!isNaN(yyN)) {
			// reconstruir con ceros para valoración base
			valor = `${dd.padStart(2,'0')}/${mm.padStart(2,'0')}/${yy}`;
		}
	}
	estado.className = 'estado';
	if(!valor){
		estado.textContent = 'Escribe la palabra secreta.';
		estado.classList.add('error');
		input.focus();
		return;
	}
	btn.disabled = true; btn.style.opacity = .7; estado.textContent = 'Verificando...';
	 setTimeout(()=> { // Simula pequeña verificación
		 // Re-evaluar variantes en bruto ingresado (aceptar cualquiera)
		 const ingresoOriginal = (input.value||'').trim();
		 const candidatos = new Set([
		 	ingresoOriginal,
		 	ingresoOriginal.replace(/[-.]/g,'/'),
		 	valor,
		 	ingresoOriginal.replace(/\D/g,'') // solo dígitos
		 ]);
		 let match = false;
		 for(const c of candidatos){
			 if(!c) continue;
			 let norm = c;
			 if(/^\d{8}$/.test(norm)) norm = `${norm.slice(0,2)}/${norm.slice(2,4)}/${norm.slice(4)}`;
			 norm = norm.replace(/[-.]/g,'/');
			 const p = norm.split('/');
			 if(p.length===3){
				 const dd = p[0].padStart(2,'0');
				 const mm = p[1].padStart(2,'0');
				 const yy = p[2];
				 const reconstruida = `${dd}/${mm}/${yy}`;
				 if(HASHES_VALIDOS.has(hashSimple(reconstruida))) { match = true; break; }
			 }
		 }
		 if(match){
			 estado.textContent = 'Bienvenida ❤️';
			 estado.classList.add('ok');
			 // Persistir en localStorage para mantener acceso entre sesiones del navegador
			 localStorage.setItem('accesoLove','1');
			 setTimeout(()=> { window.location.href = 'index.html'; }, 700);
		 } else {
			 estado.textContent = 'No coincide esa fecha... prueba otra.';
			 estado.classList.add('error');
			 btn.disabled = false; btn.style.opacity = 1;
			 input.value=''; input.focus();
		 }
	 }, 500);
});

// Migración previa: si existía en sessionStorage moverlo a localStorage
if(sessionStorage.getItem('accesoLove') === '1' && !localStorage.getItem('accesoLove')) {
	localStorage.setItem('accesoLove','1');
	sessionStorage.removeItem('accesoLove');
}

// Control de acceso persistente
const params = new URLSearchParams(window.location.search);
if(params.has('reset')){
	localStorage.removeItem('accesoLove');
	sessionStorage.removeItem('accesoLove');
	console.log('Acceso reiniciado (limpiado localStorage y sessionStorage)');
} else if(localStorage.getItem('accesoLove') === '1') {
	// Mostrar acceso directo opcional (estado anterior solicitado)
	const formWrap = document.getElementById('formAcceso');
	if(formWrap){
		const ya = document.createElement('div');
		ya.style.marginTop = '1rem';
		ya.innerHTML = '<button type="button" id="btnIrSitio" class="btn-love" style="width:100%;">Ir al sitio ❤</button><div class="estado" style="margin-top:.5rem; font-size:.75rem; opacity:.8;">Ya tienes acceso concedido, puedes volver cuando quieras.</div>';
		formWrap.insertAdjacentElement('afterend', ya);
		const btnGo = ya.querySelector('#btnIrSitio');
		btnGo.addEventListener('click', ()=> window.location.href = 'index.html');
	}
}

