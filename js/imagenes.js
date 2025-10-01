// Array único de imágenes raíz (excluye subcarpeta comida)
const IMAGENES_RAIZ = [
  'img/imagen1.jpeg','img/imagen2.jpeg','img/imagen3.jpeg','img/imagen4.jpeg','img/imagen5.jpeg',
  'img/imagen6.jpeg','img/imagen7.jpeg','img/imagen8.jpeg','img/imagen9.jpeg','img/imagen10.jpeg',
  'img/imagen11.jpeg','img/imagen12.jpeg','img/imagen13.jpeg','img/imagen14.jpeg','img/imagen18.jpeg',
  'img/imagen19.jpeg','img/imagen21.jpeg','img/imagen23.jpeg','img/imagen24.jpeg','img/imagen25.jpeg',
  'img/imagen26.jpeg','img/imagen28.jpeg'
];

// Imágenes de subcarpeta comida
const IMAGENES_COMIDA = [
  'img/comida/imagen15.jpeg','img/comida/imagen16.jpeg','img/comida/imagen17.jpeg','img/comida/imagen20.jpeg',
  'img/comida/imagen22.jpeg','img/comida/imagen27.jpeg','img/comida/imagen8.jpeg','img/comida/imagen9.jpeg'
];

// Devuelve una copia barajada (Fisher-Yates)
function barajarImagenes(arr = IMAGENES_RAIZ) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Toma n primeras al azar sin modificar el original
function tomarAleatorias(n, arr = IMAGENES_RAIZ) {
  return barajarImagenes(arr).slice(0, n);
}

// Generar títulos simples
function generarTitulos(prefix = 'Recuerdo', arr = IMAGENES_RAIZ) {
  return arr.map((_, i) => `${prefix} #${i + 1}`);
}
