
const API = {
  async login(username, password) {
    return { ok: Boolean(username && password), user: { username } };
  },

  async analyzePhoto(file, instrument) {
    let value;
    if (instrument.unit === "°C") value = (Math.random() * 40 - 10).toFixed(1);
    else if (instrument.unit === "%(LEL)") value = (Math.random() * 100).toFixed(1);
    else if (instrument.unit === "mmH2O") value = (Math.random() * 900 + 100).toFixed(0);
    else value = (Math.random() * 150 + 20).toFixed(1);

    return { ok: true, value, confidence: "High" };
  },

  async submitChecksheet(payload) {
    console.log("Submit payload:", payload);
    return { ok: true };
  }
};
