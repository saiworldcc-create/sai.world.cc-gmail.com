const XLSX = require('xlsx');

/**
 * Standardized output format:
 * {
 *   zones: ['Zone 1', 'Zone 2', ...],
 *   rates: {
 *     'Zone 1': { '0.5': 2452, '1': 3059, ... },
 *     'Zone 2': { '0.5': 2322, '1': 3043, ... },
 *     ...
 *   }
 * }
 */

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(buffer) {
  const text = buffer.toString('utf-8');
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());

  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row.');
  }

  // First row is headers: Weight/Destination, Zone1, Zone2, ...
  const headers = lines[0].split(',').map(h => h.trim());
  const zones = headers.slice(1); // Skip the first column (weight/destination)

  if (zones.length === 0) {
    throw new Error('No zone columns found in CSV header.');
  }

  const rates = {};
  for (const zone of zones) {
    rates[zone] = {};
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    const weight = cols[0].replace(/\s*kg\s*/i, '').trim();

    if (!weight || isNaN(parseFloat(weight))) continue;

    for (let j = 0; j < zones.length; j++) {
      const rawVal = (cols[j + 1] || '').replace(/[",\s]/g, '');
      const val = parseInt(rawVal, 10);
      if (!isNaN(val)) {
        rates[zones[j]][weight] = val;
      }
    }
  }

  const weightCount = Object.keys(rates[zones[0]] || {}).length;
  if (weightCount === 0) {
    throw new Error('No valid rate data rows found in CSV.');
  }

  return { zones, rates };
}

// ─── Excel Parser ─────────────────────────────────────────────────────────────
function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  // Use the first sheet
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('Excel file has no sheets.');

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length < 2) {
    throw new Error('Excel sheet must have at least a header row and one data row.');
  }

  // Find the header row — first row that contains "zone" or "destination" or weight-like headers
  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i].map(c => String(c).toLowerCase().trim());
    if (
      row.some(c => c.includes('zone') || c.includes('destination') || c.includes('weight') || c.includes('500'))
    ) {
      headerRowIdx = i;
      break;
    }
  }

  const headerRow = rows[headerRowIdx].map(c => String(c).trim());
  const zones = headerRow.slice(1).filter(z => z.length > 0);

  if (zones.length === 0) {
    throw new Error('No zone/destination columns found in Excel header row.');
  }

  const rates = {};
  for (const zone of zones) {
    rates[zone] = {};
  }

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const weight = String(row[0]).replace(/[,\s]*kg\s*/i, '').replace(/,/g, '').trim();
    if (!weight || isNaN(parseFloat(weight))) continue;

    for (let j = 0; j < zones.length; j++) {
      const rawVal = String(row[j + 1] || '').replace(/[,\s"]/g, '');
      const val = parseInt(rawVal, 10);
      if (!isNaN(val)) {
        rates[zones[j]][weight] = val;
      }
    }
  }

  const weightCount = Object.keys(rates[zones[0]] || {}).length;
  if (weightCount === 0) {
    throw new Error('No valid rate data rows found in Excel.');
  }

  return { zones, rates };
}

// ─── PDF Parser ───────────────────────────────────────────────────────────────
async function parsePDF(buffer, carrier) {
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  const text = data.text;

  if (!text || text.trim().length < 50) {
    throw new Error('Could not extract meaningful text from the PDF.');
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  if (carrier === 'self') {
    return parseSelfRatesPDF(lines);
  }

  // Strategy: Look for lines that match rate table rows
  // A rate row typically starts with a destination name or weight number,
  // followed by multiple numeric values separated by whitespace.
  const isDestinationBased = detectDestinationBased(lines);

  if (isDestinationBased) {
    return parseDestinationBasedPDF(lines, carrier);
  } else {
    return parseWeightBasedPDF(lines, carrier);
  }
}

function parseSelfRatesPDF(lines) {
  const zones = [];
  const rates = {};
  const regions = {};
  const weightBrackets = ['0.5', 'add0.5', '6.0', '8.0', '11.0', '16.0', '21.0', '26.0']; 
  
  const regionMapping = {
    // AFRICA
    'Botswana': 'AFRICA', 'Mauritius - Celero EXP': 'AFRICA', 'Ghana': 'AFRICA', 'Kenya - Duty Paid': 'AFRICA',
    'Malawi': 'AFRICA', 'Mozambique ( Duty Extra)': 'AFRICA', 'Nigeria (Duty Paid)': 'AFRICA',
    'Madagascar': 'AFRICA', 'Reunion Island': 'AFRICA', 'Mayotte': 'AFRICA', 'Seychelles': 'AFRICA',
    'Comoros': 'AFRICA', 'Tanzania (Duty Paid)': 'AFRICA', 'Uganda (Duty Paid)': 'AFRICA',
    'Zambia (Duty Paid)': 'AFRICA', 'Zimbabwe': 'AFRICA',
    // FAREAST
    'Singapore': 'FAREAST', 'Malaysia - DUTY PAID': 'FAREAST', 'Malaysia - REMOTE': 'FAREAST', 'Hongkong': 'FAREAST',
    'Thailand (Food Not Allowed)': 'FAREAST', 'Thailand (Food Duty Paid)': 'FAREAST', 'PHILIPPINES': 'FAREAST', 'CHINA (Company to Company Only)': 'FAREAST',
    // ASIA
    'Bhutan Duty Paid': 'ASIA', 'Nepal': 'ASIA', 'Sri Lanka': 'ASIA', 'Sri Lanka Duty Paid': 'ASIA',
    // GULF COUNTRIES
    'UAE': 'GULF COUNTRIES', 'Oman': 'GULF COUNTRIES', 'Qatar': 'GULF COUNTRIES', 'Bahrain': 'GULF COUNTRIES',
    'Kuwait': 'GULF COUNTRIES', 'Saudi Arabia': 'GULF COUNTRIES', 'Iran': 'GULF COUNTRIES',
    // UK SPECIAL RATES
    'United Kingdom': 'UK SPECIAL RATES(Ex-Hyderabad)', 'Northern Ireland(BT1-BT99)': 'UK SPECIAL RATES(Ex-Hyderabad)',
    'Isle of Man / Wight': 'UK SPECIAL RATES(Ex-Hyderabad)', 'JERSEY / GUERNSEY / CHANNEL ISLAND': 'UK SPECIAL RATES(Ex-Hyderabad)',
    'CHANNEL ISLAND': 'UK SPECIAL RATES(Ex-Hyderabad)', 'Scotland': 'UK SPECIAL RATES(Ex-Hyderabad)', 'Glasgow': 'UK SPECIAL RATES(Ex-Hyderabad)', 'Edinburgh': 'UK SPECIAL RATES(Ex-Hyderabad)',
    // DDP(Delivered Duty Paid)-(Ex-Hyderabad)
    'Austria': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Belgium': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Bulgaria': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Bosnia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Croatia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Czech Republic': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)',
    'Denmark': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Estonia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Finland': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'France': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'GERMANY': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Greece': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)',
    'Hungary': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Ireland': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Iceland': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Italy': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Latvia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Lithuania': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Liechtenstein': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Luxembourg': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)',
    'Malta': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Monaco': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Netherlands': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Norway': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Poland': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Portugal': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Romania': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)',
    'Slovakia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Slovenia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Spain': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Sweden': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Switzerland': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Serbia': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)', 'Serbia & Montenegro': 'DDP(Delivered Duty Paid)-(Ex-Hyderabad)',
    // AUSTRALIA (Ex-Hyderabad)
    'Zone-1': 'AUSTRALIA (Ex-Hyderabad)', 'Zone-2': 'AUSTRALIA (Ex-Hyderabad)', 'Zone-3': 'AUSTRALIA (Ex-Hyderabad)',
    // NEW ZEALAND
    'NEW ZEALAND (AKL)': 'NEW ZEALAND', 'NEW ZEALAND (OTHERS)': 'NEW ZEALAND', 'NEW ZEALAND (REST)': 'NEW ZEALAND',
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.includes('Note:') || line.includes('MANDATORY') || line.includes('SERVICE') || line.includes('WILL BE FWD') || line.includes('ALLOWED')) continue;
    
    let dest = null;
    let numStr = null;
    
    // Check if fused (e.g. Botswana2156 740 1012, or Kenya - Duty Paid****    475)
    const fusedMatch = line.match(/^([A-Za-z\s\-()&]+?)\s*([\d*,\-]{2,}(?:\s+[\d*,\-]+)*)/);
    if (fusedMatch) {
      dest = fusedMatch[1].replace(/SELF$/i, '').trim();
      numStr = fusedMatch[2];
    } else if (line.match(/^[\d*,\-]{2,}/) && i > 0) {
      // Numbers on new line, destination on previous line
      const prevLine = lines[i - 1].trim();
      if (!prevLine.match(/^[\d*,\-]{2,}/) && !prevLine.includes('Note:')) {
        dest = prevLine.replace(/SELF$/i, '').replace(/Ex-Hyderabad$/i, '').trim();
        numStr = line;
      }
    }
    
    if (dest && numStr) {
      dest = dest.replace(/^\(/, '').replace(/\)$/, '').trim();
      if (dest.toLowerCase() === 'paid') dest = 'Thailand (Food Duty Paid)'; 
      if (dest.toLowerCase() === 'food not allowed') dest = 'Thailand (Food Not Allowed)';

      // Expand fused hyphens like '--440' into '- - 440'
      numStr = numStr.replace(/--/g, '- - ');

      const numbers = numStr.split(/\s+/).map(n => {
        if (n.includes('*') || n === '-') return 0;
        return parseInt(n.replace(/,/g, ''), 10);
      }).filter(n => !isNaN(n));
      if (numbers.length >= 2 && dest.length > 2) {
        if (!zones.includes(dest)) zones.push(dest);
        rates[dest] = {};
        
        let assignedRegion = 'OTHER';
        // Case-insensitive lookup
        for (const [key, region] of Object.entries(regionMapping)) {
          if (dest.toLowerCase() === key.toLowerCase()) {
            assignedRegion = region;
            break;
          }
        }
        regions[dest] = assignedRegion;

        for (let j = 0; j < Math.min(numbers.length, weightBrackets.length); j++) {
          rates[dest][weightBrackets[j]] = numbers[j];
        }
      }
    }
  }

  if (zones.length === 0) {
    throw new Error('Could not extract any rate data from the Sai Self PDF.');
  }

  return { zones, rates, regions };
}

function detectDestinationBased(lines) {
  // If we find lines that have destination/country names followed by numbers
  // like "Botswana 2156 740 1012 804 847 847 847"
  let destCount = 0;
  let weightCount = 0;

  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts.length >= 4) {
      // Check if first part is a number (weight-based) or text (destination-based)
      if (!isNaN(parseFloat(parts[0]))) {
        weightCount++;
      } else if (isNaN(parseFloat(parts[0])) && parts.slice(1).some(p => !isNaN(parseInt(p.replace(/,/g, ''), 10)))) {
        destCount++;
      }
    }
  }

  return destCount > weightCount;
}

function parseDestinationBasedPDF(lines, carrier) {
  // Look for header row containing weight brackets like "500 gms", "ADD 500gm", "6+", "9+", etc.
  let headerLine = null;
  let headerIdx = -1;
  
  // Common weight headers in DHL PDFs
  const weightPatterns = ['500', 'ADD', 'Destination'];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Destination') || 
        (lines[i].includes('500') && lines[i].match(/\d\+/))) {
      headerLine = lines[i];
      headerIdx = i;
      break;
    }
  }

  // Extract weight bracket names from header
  let weightBrackets = [];
  if (headerLine) {
    // Parse header for weight brackets
    const headerParts = headerLine.split(/\s{2,}|\t/).map(h => h.trim()).filter(h => h.length > 0);
    weightBrackets = headerParts.filter(h => h !== 'Destination' && h !== 'Mention Service');
  }

  // If we couldn't find a good header, use default DHL weight brackets
  if (weightBrackets.length === 0) {
    weightBrackets = ['500 gms', 'ADD 500gm', '6+', '9+', '11+', '16+', '21+', '26+'];
  }

  // Parse destination rows
  const zones = [];
  const rates = {};

  for (let i = (headerIdx >= 0 ? headerIdx + 1 : 0); i < lines.length; i++) {
    const line = lines[i];
    // Skip non-data lines
    if (line.includes('Note:') || line.includes('MANDATORY') || line.length < 10) continue;

    // Extract destination name and numbers
    const match = line.match(/^([A-Za-z\s\-()]+?)\s+([\d,]+(?:\s+[\d,*]+)*)/);
    if (!match) continue;

    const destination = match[1].trim();
    const numStr = match[2];
    const numbers = numStr.split(/\s+/)
      .map(n => n.replace(/,/g, '').replace(/\*/g, ''))
      .filter(n => !isNaN(parseInt(n, 10)))
      .map(n => parseInt(n, 10));

    if (numbers.length >= 2 && destination.length > 1) {
      zones.push(destination);
      rates[destination] = {};
      for (let j = 0; j < Math.min(numbers.length, weightBrackets.length); j++) {
        rates[destination][weightBrackets[j]] = numbers[j];
      }
    }
  }

  if (zones.length === 0) {
    throw new Error('Could not extract any rate data from the PDF. Try uploading as Excel/CSV instead.');
  }

  return { zones, rates };
}

function parseWeightBasedPDF(lines, carrier) {
  let zoneNames = [];
  let dataStartIdx = 0;

  if (carrier === 'ups') {
    zoneNames = [
      'ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6', 'ZONE 7', 'ZONE 8', 'ZONE 9', 
      'US', 'CA', 'AU', 'NZ', 'SG', 'PL , CZ , RO , HU', 'DE', 
      'Zone 6A Specials - (NC/MU/MV)', 
      'Zone 7A Specials - (NE/VI/NT/GD/GT/DJ/CW/PY/GM/AW/GY/CR/CG/RE/WS/MQ/TT/HT/BO/BM/SC/UY/LC/BS/GP/CM/VG/PA/CI/SL/SR/JM/AR)'
    ];
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      if (parts.length >= 5 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1].replace(/,/g, '')))) {
        dataStartIdx = i;
        break;
      }
    }
  } else {
    for (let i = 0; i < Math.min(lines.length, 15); i++) {
      const line = lines[i];
      if (line.match(/zone/i) || line.match(/^[\w\s]+(\s+[\w\s]+){3,}$/)) {
        // Fix for fused zone headers (e.g. "Zone 9 Zone 10 Zone 11")
        // Extract all occurrences of "Zone \d+" or "KGZone \d+[A-Z]?"
        // Use positive lookahead (?=Zone|$) to strictly match without eating the next "Zone"
        const matches = line.match(/(?:KG)?Zone\s*\d+(?:A)?(?=Zone|$)/gi);
        if (matches && matches.length >= 3) {
          zoneNames = matches.map(z => z.replace(/^KG/i, '').trim());
          dataStartIdx = i + 1;
          break;
        } else {
          const parts = line.split(/\s{2,}|\t/).map(p => p.trim()).filter(p => p.length > 0);
          if (parts.length >= 3) {
            zoneNames = parts.filter(p => isNaN(parseFloat(p.replace(/,/g, ''))));
            dataStartIdx = i + 1;
            break;
          }
        }
      }
    }

    if (zoneNames.length === 0) {
      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split(/\s+/);
        if (parts.length >= 3 && !isNaN(parseFloat(parts[0]))) {
          const numCols = parts.length - 1;
          for (let j = 1; j <= numCols; j++) {
            zoneNames.push(`Zone ${j}`);
          }
          dataStartIdx = i;
          break;
        }
      }
    }
  }

  if (zoneNames.length === 0) {
    throw new Error('Could not determine zone columns from PDF.');
  }

  const rates = {};
  for (const z of zoneNames) {
    rates[z] = {};
  }

  let expectedWeight = 0.5;

  for (let i = dataStartIdx; i < lines.length; i++) {
    let lineStr = lines[i].trim();
    if (!lineStr) continue;

    // Check if the line belongs to a new section (e.g. "Non-documents from 0.5 KG")
    if (lineStr.match(/[a-zA-Z]/) && !lineStr.match(/^[\d.]/)) {
      expectedWeight = 0.5; // Reset expected weight for new section
      continue;
    }

    let parts = lineStr.split(/\s+/);
    if (parts.length < 2) continue;

    let rawFirst = parts[0];
    let weightStr = "";
    let firstValStr = "";

    let exp1 = expectedWeight.toString();
    let exp2 = expectedWeight.toFixed(1);

    if (rawFirst.startsWith(exp1) && rawFirst.length > exp1.length) {
      weightStr = exp1;
      firstValStr = rawFirst.substring(exp1.length);
    } else if (rawFirst.startsWith(exp2) && rawFirst.length > exp2.length) {
      weightStr = exp2;
      firstValStr = rawFirst.substring(exp2.length);
    } else {
      const match = rawFirst.match(/^(\d+(?:\.\d+)?)([\d,]+)$/);
      if (match && match[1] && match[2]) {
         weightStr = match[1];
         firstValStr = match[2];
      } else {
         weightStr = rawFirst;
      }
    }

    if (firstValStr) {
      parts[0] = weightStr;
      parts.splice(1, 0, firstValStr);
    }

    const weight = parts[0].replace(/,/g, '');
    if (isNaN(parseFloat(weight))) continue;

    expectedWeight = parseFloat(weight) + 0.5;

    let colIdx = 1;
    for (let j = 0; j < zoneNames.length; j++) {
      if (colIdx >= parts.length) break;
      const val = parts[colIdx].replace(/,/g, '');
      if (!isNaN(parseFloat(val))) {
        rates[zoneNames[j]][weight] = parseFloat(val);
      }
      colIdx++;
    }
  }

  const weightCount = Object.keys(rates[zoneNames[0]] || {}).length;
  if (weightCount === 0) {
    throw new Error('No valid rate rows found in PDF. Try uploading as Excel/CSV instead.');
  }

  return { zones: zoneNames, rates };
}

module.exports = { parseCSV, parseExcel, parsePDF };
