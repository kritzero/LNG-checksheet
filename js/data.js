const MASTER_SITES = [
  {
    "name": "Em Power",
    "instruments": [
      {
        "tag": "LT-101A",
        "description": "TankA Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "LT-101B",
        "description": "TankB Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "PT-101A",
        "description": "TankA Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-101B",
        "description": "TankB Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "TT-101",
        "description": "Evap Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "TT-102",
        "description": "Outlet Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "PT-102",
        "description": "Evap Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-103",
        "description": "Outlet Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "Gas Detector A",
        "description": "Gas Detector A",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "Gas Detector B",
        "description": "Gas Detector B",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "Flame detector",
        "description": "Flame Detector",
        "unit": "on/off",
        "checkType": "flame"
      }
    ],
    "valves": [
      {
        "tag": "ESD-101A",
        "description": "TankA-fill-liquid",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-102A",
        "description": "TankA-fill-gas",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-103A",
        "description": "TankA-Out",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-105A",
        "description": "TankA-Bypass",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ACV-101A",
        "description": "TankA-PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-101B",
        "description": "TankB-fill-liquid",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-102B",
        "description": "TankB-fill-gas",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-103B",
        "description": "TankB-Out",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-105B",
        "description": "TankB-Bypass",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ACV-101B",
        "description": "TankB-PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ACV-002A",
        "description": "Evap-A",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ACV-002B",
        "description": "Evap-B",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD-106",
        "description": "Final outlet",
        "unit": "on/off",
        "checkType": "valve"
      }
    ]
  },
  {
    "name": "Estival",
    "instruments": [
      {
        "tag": "LT-101",
        "description": "Tank Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "PT-101",
        "description": "Tank Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-102",
        "description": "Outlet Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-103",
        "description": "Supply Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "TT-101",
        "description": "Outlet Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "Gas Detector",
        "description": "Gas Detector",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "FDT-001",
        "description": "Flame Detector",
        "unit": "on/off",
        "checkType": "flame"
      }
    ],
    "valves": [
      {
        "tag": "AV-PBC",
        "description": "PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1A",
        "description": "Evap-A",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1B",
        "description": "Evap-B",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-2",
        "description": "Final outlet",
        "unit": "on/off",
        "checkType": "valve"
      }
    ]
  },
  {
    "name": "Fitesa",
    "instruments": [
      {
        "tag": "LT-1",
        "description": "Tank Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "PT-1",
        "description": "Tank Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-2",
        "description": "Evap Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-3",
        "description": "Outlet Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "TT-1",
        "description": "Evap Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "TT-2",
        "description": "Outlet Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "GDT-001",
        "description": "Gas Detector",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "FDT-001",
        "description": "Flame Detector",
        "unit": "on/off",
        "checkType": "flame"
      }
    ],
    "valves": [
      {
        "tag": "AV-1.1",
        "description": "Tank-out",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1.2",
        "description": "PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1.3",
        "description": "Tank-fill-gas",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1.4",
        "description": "Tank-fill-liquid",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1.5",
        "description": "Tank-bypass",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1.6",
        "description": "Evap1",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-1.7",
        "description": "Evap2",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESV-1",
        "description": "Final outlet",
        "unit": "on/off",
        "checkType": "valve"
      }
    ]
  },
  {
    "name": "Allotek",
    "instruments": [
      {
        "tag": "LT-101",
        "description": "Tank Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "PT-101",
        "description": "Tank Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-102",
        "description": "Evap Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-103",
        "description": "Outlet Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "TT-101",
        "description": "Evap Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "TT-102",
        "description": "Outlet Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "GDT-001",
        "description": "Gas Detector",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "FDT-001",
        "description": "Flame Detector",
        "unit": "on/off",
        "checkType": "flame"
      }
    ],
    "valves": [
      {
        "tag": "AV-001",
        "description": "Tank-fill-gas",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-002",
        "description": "Tank-fill-liquid",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-003",
        "description": "PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-004",
        "description": "Tank-out",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-005",
        "description": "Bypass Tank",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-006A",
        "description": "Evap1",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-006B",
        "description": "Evap2",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-007",
        "description": "Final outlet",
        "unit": "on/off",
        "checkType": "valve"
      }
    ]
  },
  {
    "name": "Oatside",
    "instruments": [
      {
        "tag": "LT101A",
        "description": "Tank Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "PT101A",
        "description": "Tank Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT102",
        "description": "Evap Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT103",
        "description": "Outlet Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT104",
        "description": "Supply Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "TT101",
        "description": "Evap Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "TT102",
        "description": "Outlet Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "Gas Detector",
        "description": "Gas Detector",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "FDT-001",
        "description": "Flame Detector",
        "unit": "on/off",
        "checkType": "flame"
      }
    ],
    "valves": [
      {
        "tag": "RA21",
        "description": "PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD101",
        "description": "Tank-out",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "VA17",
        "description": "Auto-Vent",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV14-A",
        "description": "Bypass Tank",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ACV104A",
        "description": "Evap1",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ACV104B",
        "description": "Evap2",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "ESD102",
        "description": "Final outlet",
        "unit": "on/off",
        "checkType": "valve"
      }
    ]
  },
  {
    "name": "Jinsung",
    "instruments": [
      {
        "tag": "LT-01",
        "description": "Tank Level",
        "unit": "mmH2O",
        "checkType": "photo"
      },
      {
        "tag": "PT-01",
        "description": "Tank Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-02",
        "description": "Supply Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "PT-003",
        "description": "Outlet Pressure",
        "unit": "psi",
        "checkType": "photo"
      },
      {
        "tag": "TT-001",
        "description": "Outlet Temp",
        "unit": "°C",
        "checkType": "photo"
      },
      {
        "tag": "GDT-001",
        "description": "Gas Detector",
        "unit": "%(LEL)",
        "checkType": "photo"
      },
      {
        "tag": "FDT-001",
        "description": "Flame Detector",
        "unit": "on/off",
        "checkType": "flame"
      }
    ],
    "valves": [
      {
        "tag": "AV-V9",
        "description": "PBC",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-002A",
        "description": "Evap-A",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-002B",
        "description": "Evap-B",
        "unit": "on/off",
        "checkType": "valve"
      },
      {
        "tag": "AV-ESV",
        "description": "Final outlet",
        "unit": "on/off",
        "checkType": "valve"
      }
    ]
  }
];
