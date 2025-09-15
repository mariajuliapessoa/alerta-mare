const fs = require('fs');
const path = require('path');

const pastaJsons = path.join(__dirname, 'public', 'jsons');

const diasPorMes = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
};

function corrigirData(indexInicial, mesInicial, anoInicial) {
  let dia = 1;
  let mes = mesInicial;
  let ano = anoInicial;

  return function () {
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

    dia++;

    if (dia > diasPorMes[mes]) {
      dia = 1;
      mes++;
      if (mes > 12) {
        mes = 1;
        ano++;
      }
    }

    return dataFormatada;
  };
}

const arquivos = fs.readdirSync(pastaJsons).filter(file => file.toLowerCase().endsWith('.json'));
console.log('Arquivos encontrados:', arquivos);

arquivos.forEach(file => {
  const filePath = path.join(pastaJsons, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const geraData = corrigirData(0, 1, 2025); 

  data.forEach((item, index) => {
    const antiga = item.data;
    item.data = geraData();
    console.log(`Arquivo: ${file} | Item ${index} | Data antiga: ${antiga} | Nova: ${item.data}`);
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
});

console.log('Todas as datas foram corrigidas com sucesso!');
