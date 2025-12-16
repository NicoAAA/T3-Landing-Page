// src/utils/fashion-math.js
/**
 * Procesa los datos de noticias de moda para obtener:
 * 1. Años únicos planos.
 * 2. Lógica para las tiras de números (Digit Strips).      
 * 3. Agrupación de posts por año para la vista estándar.
 * 
 * @param {Array} newsItems - Array de objetos de noticias con al menos una propiedad 'year'.
 * @returns {Object} - Objeto con años únicos, tiras de dígitos, mapeos y posts agrupados por año.
 */

export function processFashionData(newsItems) {
  // 1. Obtener años únicos planos
  const uniqueYears = [...new Set(newsItems.map((item) => item.year))].sort();

  // 2. Lógica compleja para las tiras de números (Digit Strips)
  const digitColumns = Array.from({ length: 4 }, (_, colIndex) => {
    const strip = []; 
    const mapping = []; 
    let lastDigit = null;
    let currentStripIndex = -1;

    uniqueYears.forEach((year) => {
      const yearStr = String(year);
      const digit = yearStr[colIndex]; 
      if (digit !== lastDigit) {
        strip.push(digit);
        currentStripIndex++;
        lastDigit = digit;
      }
      mapping.push(currentStripIndex);
    });
    return { strip, mapping };
  });

  const clientMappings = digitColumns.map(col => col.mapping);

  // 3. Lógica para agrupar posts para la vista estándar
  const postsByYear = newsItems.reduce((acc, post) => {
    if (!acc[post.year]) acc[post.year] = [];
    acc[post.year].push(post);
    return acc;
  }, {});

  const sortedYears = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return {
    uniqueYears,
    digitColumns,
    clientMappings,
    postsByYear,
    sortedYears
  };
}