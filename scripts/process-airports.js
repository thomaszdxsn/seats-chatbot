const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/tmp/airports.csv';
const outputPath = path.join(__dirname, '..', 'src', 'data', 'airports.json');

console.log('Processing airports CSV file...');

// Read and parse CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

console.log('Headers:', headers);
console.log(`Total lines: ${lines.length}`);

// Process airports data
const airports = {};
let processedCount = 0;
let validIataCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const columns = line.split(',');
  if (columns.length < 11) continue;
  
  const iataCode = columns[0].trim();
  const icaoCode = columns[1].trim();
  const airportName = columns[2].trim();
  const country = columns[9].trim();
  const city = columns[10].trim();
  
  processedCount++;
  
  // Only include airports with valid 3-letter IATA codes
  if (iataCode && iataCode.match(/^[A-Z]{3}$/)) {
    validIataCount++;
    airports[iataCode] = {
      iata: iataCode,
      icao: icaoCode || undefined,
      name: airportName,
      city: city || undefined,
      country: country || undefined
    };
  }
}

console.log(`Processed ${processedCount} airports`);
console.log(`Found ${validIataCount} airports with valid IATA codes`);

// Create output directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write the airports data as JSON
fs.writeFileSync(outputPath, JSON.stringify(airports, null, 2), 'utf8');

console.log(`Airports data saved to: ${outputPath}`);

// Create a sample of major airports for system prompt
const majorAirports = {
  // China
  'PEK': airports['PEK'], // Beijing Capital
  'PVG': airports['PVG'], // Shanghai Pudong  
  'CAN': airports['CAN'], // Guangzhou
  'SZX': airports['SZX'], // Shenzhen
  'CTU': airports['CTU'], // Chengdu
  'XIY': airports['XIY'], // Xi'an
  'HGH': airports['HGH'], // Hangzhou
  'NKG': airports['NKG'], // Nanjing
  'WUH': airports['WUH'], // Wuhan
  'SHA': airports['SHA'], // Shanghai Hongqiao
  
  // Japan
  'NRT': airports['NRT'], // Tokyo Narita
  'HND': airports['HND'], // Tokyo Haneda
  'KIX': airports['KIX'], // Osaka Kansai
  'ITM': airports['ITM'], // Osaka Itami
  'NGO': airports['NGO'], // Nagoya
  'FUK': airports['FUK'], // Fukuoka
  'SPK': airports['SPK'], // Sapporo
  
  // USA
  'LAX': airports['LAX'], // Los Angeles
  'JFK': airports['JFK'], // New York JFK
  'LGA': airports['LGA'], // New York LaGuardia
  'SFO': airports['SFO'], // San Francisco
  'ORD': airports['ORD'], // Chicago
  'MIA': airports['MIA'], // Miami
  'DFW': airports['DFW'], // Dallas
  'LAS': airports['LAS'], // Las Vegas
  'SEA': airports['SEA'], // Seattle
  'BOS': airports['BOS'], // Boston
  
  // Europe
  'LHR': airports['LHR'], // London Heathrow
  'CDG': airports['CDG'], // Paris Charles de Gaulle
  'FRA': airports['FRA'], // Frankfurt
  'AMS': airports['AMS'], // Amsterdam
  'ZUR': airports['ZUR'], // Zurich
  'FCO': airports['FCO'], // Rome
  'MAD': airports['MAD'], // Madrid
  'BCN': airports['BCN'], // Barcelona
  'MUC': airports['MUC'], // Munich
  'VIE': airports['VIE'], // Vienna
  
  // Other Asia
  'ICN': airports['ICN'], // Seoul Incheon
  'GMP': airports['GMP'], // Seoul Gimpo
  'SIN': airports['SIN'], // Singapore
  'BKK': airports['BKK'], // Bangkok
  'HKG': airports['HKG'], // Hong Kong
  'TPE': airports['TPE'], // Taipei
  'KUL': airports['KUL'], // Kuala Lumpur
  'CGK': airports['CGK'], // Jakarta
  'MNL': airports['MNL'], // Manila
  'DEL': airports['DEL'], // Delhi
  'BOM': airports['BOM'], // Mumbai
};

// Remove undefined entries
Object.keys(majorAirports).forEach(key => {
  if (!majorAirports[key]) {
    delete majorAirports[key];
  }
});

const majorAirportsPath = path.join(__dirname, '..', 'src', 'data', 'major-airports.json');
fs.writeFileSync(majorAirportsPath, JSON.stringify(majorAirports, null, 2), 'utf8');

console.log(`Major airports data saved to: ${majorAirportsPath}`);
console.log(`Total major airports: ${Object.keys(majorAirports).length}`);