const BUILDINGS = {
    // RESOURCE / TERRAIN
    'road': { name: 'Strada', type: 'infra', cost: 0, color: '#333' },
    'tree': { name: 'Albero', type: 'nature', cost: 50, color: '#4CAF50' },
    'park': { name: 'Parco', type: 'nature', cost: 1000, color: '#8BC34A' },

    // RESIDENTIAL
    'house': { name: 'Casa', type: 'res', cost: 15000, income: 250, pollution: 0, color: '#FFC107', level: 1 }, // Starter: ROI 60 days
    'apartment': { name: 'Appartamento', type: 'res', cost: 60000, income: 800, pollution: 0, color: '#FF9800', level: 2 }, // ROI 75 days
    'villa': { name: 'Villa', type: 'res', cost: 250000, income: 2500, pollution: 0, color: '#FF5722', level: 5 }, // Luxury
    'skyscraper': { name: 'Grattacielo', type: 'res', cost: 800000, income: 7000, pollution: 2, color: '#795548', level: 8 },
    'skyscraper_lux': { name: 'Grattacielo Lusso', type: 'res', cost: 2500000, income: 25000, pollution: 1, color: '#3E2723', level: 12 },

    // COMMERCIAL
    'kiosk': { name: 'Chiosco', type: 'com', cost: 5000, income: 100, pollution: 0, color: '#03A9F4', level: 1 }, // Best Starter: ROI 50 days
    'shop': { name: 'Negozio', type: 'com', cost: 40000, income: 600, pollution: 1, color: '#039BE5', level: 2 }, // ROI 66 days
    'restaurant': { name: 'Ristorante', type: 'com', cost: 120000, income: 1500, pollution: 2, color: '#0288D1', level: 3 },
    'supermarket': { name: 'Supermercato', type: 'com', cost: 300000, income: 3500, pollution: 3, color: '#0277BD', level: 4 },
    'outlet': { name: 'Outlet Center', type: 'com', cost: 600000, income: 6500, pollution: 3, color: '#01579B', level: 6 },
    'cinema_priv': { name: 'Cinema Privato', type: 'com', cost: 900000, income: 9000, pollution: 2, color: '#1A237E', level: 7 },
    'hotel': { name: 'Hotel', type: 'com', cost: 1500000, income: 14000, pollution: 2, color: '#283593', level: 8 },
    'hostel': { name: 'Ostello', type: 'com', cost: 80000, income: 900, pollution: 1, color: '#5C6BC0', level: 3 },
    'bb': { name: 'B&B', type: 'com', cost: 200000, income: 2200, pollution: 0, color: '#7986CB', level: 4 },
    'mall': { name: 'Centro Commerciale', type: 'com', cost: 3500000, income: 40000, pollution: 4, color: '#303F9F', level: 11 }, // Endgame Beast

    // INDUSTRIAL (High Risk/Income)
    'workshop': { name: 'Officina', type: 'ind', cost: 30000, income: 400, pollution: 3, color: '#9E9E9E', level: 1 }, // Good starter ind
    'warehouse': { name: 'Magazzino', type: 'ind', cost: 80000, income: 1000, pollution: 2, color: '#757575', level: 2 },
    'factory': { name: 'Fabbrica', type: 'ind', cost: 180000, income: 2500, pollution: 6, color: '#616161', level: 3 },
    'power_coal': { name: 'Centrale Carbone', type: 'ind', cost: 500000, income: 6000, pollution: 9, color: '#424242', level: 6 },
    'factory_high': { name: 'Fabbrica High-Tech', type: 'ind', cost: 1000000, income: 11000, pollution: 1, color: '#607D8B', level: 8 },
    'power_hydro': { name: 'Centrale Idro', type: 'ind', cost: 1200000, income: 13000, pollution: 0, color: '#00BCD4', level: 9 },
    'factory_auto': { name: 'Fabbrica Auto', type: 'ind', cost: 2000000, income: 22000, pollution: 2, color: '#455A64', level: 10 },
    'power_nuke': { name: 'Centrale Nucleare', type: 'ind', cost: 5000000, income: 60000, pollution: 0, color: '#8BC34A', level: 15 }, // Ultimate
    'refinery': { name: 'Raffineria', type: 'ind', cost: 3000000, income: 35000, pollution: 10, color: '#212121', level: 12 },

    // SPECIAL
    'casino': { name: 'Casinò', type: 'spec', cost: 4000000, income: 50000, pollution: 3, color: '#E91E63', level: 14 },
    'hospital_priv': { name: 'Ospedale Privato', type: 'spec', cost: 1500000, income: 16000, pollution: 1, color: '#F48FB1', level: 9 },
    'school_priv': { name: 'Scuola Privata', type: 'spec', cost: 800000, income: 8500, pollution: 0, color: '#CE93D8', level: 7 },

    // PUBLIC (Non-purchasable normally)
    'town_hall': { name: 'Municipio', type: 'pub', cost: 0, income: 0, color: '#9C27B0' },
    'bank': { name: 'Banca', type: 'pub', cost: 0, income: 0, color: '#673AB7' },
    'hospital': { name: 'Ospedale', type: 'pub', cost: 0, income: 0, color: '#E91E63' },
    'police': { name: 'Carabinieri', type: 'pub', cost: 0, income: 0, color: '#3F51B5' },
    'fire': { name: 'Vigili Fuoco', type: 'pub', cost: 0, income: 0, color: '#D32F2F' },
    'school': { name: 'Scuola', type: 'pub', cost: 0, income: 0, color: '#FFEB3B' },
    'university': { name: 'Università', type: 'pub', cost: 0, income: 0, color: '#FFC107' }, // Start using university
    'job_center': { name: 'Centro Impiego', type: 'pub', cost: 0, income: 0, color: '#795548' },
    'stadium': { name: 'Stadio', type: 'pub', cost: 0, income: 0, color: '#4CAF50' },
    'weather': { name: 'Stazione Meteo', type: 'pub', cost: 0, income: 0, color: '#00BCD4' },

    // NEW UNIQUE
    'port': { name: 'Porto', type: 'pub', cost: 0, income: 0, color: '#01579B' },
    'airport': { name: 'Aeroporto', type: 'pub', cost: 0, income: 0, color: '#607D8B' },
    'ruins': { name: 'Rovine Antiche', type: 'pub', cost: 0, income: 0, color: '#8D6E63' },
    'cathedral': { name: 'Duomo', type: 'pub', cost: 0, income: 0, color: '#795548' },
    'power_plant': { name: 'Centrale Elettrica', type: 'pub', cost: 0, income: 0, color: '#212121' },
    'pub': { name: 'Pub', type: 'com', cost: 80000, income: 2000, pollution: 1, color: '#FF5722', level: 2 },
    'notary': { name: 'Notaio', type: 'pub', cost: 0, income: 0, color: '#795548' },
    'car_dealer': { name: 'Concessionaria', type: 'com', cost: 500000, income: 8000, pollution: 2, color: '#FF9800', level: 5 }
};
