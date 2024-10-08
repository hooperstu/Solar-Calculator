function calculateSolar() {
    // Get the input values
    const panelWattage = parseFloat(document.getElementById('panelWattage').value);
    const panelCount = parseFloat(document.getElementById('panelCount').value);

    // Set a fixed degradation rate (e.g., 0.5% per year)
    const degradationRate = 0.005;

    // Check if inputs are valid
    if (isNaN(panelWattage) || isNaN(panelCount) || panelWattage <= 0 || panelCount <= 0) {
        document.getElementById('result').innerHTML = '<p style="color:red;">Please enter valid values for panel wattage and number of panels.</p>';
        return;
    }

    // Calculate total system power (in kW)
    const totalSystemPowerKW = (panelWattage * panelCount) / 1000;

    // Estimate initial daily energy production (assuming 4 hours of peak sunlight)
    const initialDailyEnergyProduction = totalSystemPowerKW * 4; // kWh/day

    // Estimate initial annual energy production
    const initialAnnualEnergyProduction = initialDailyEnergyProduction * 365; // kWh/year

    // Calculate energy production over 10 years, factoring in degradation
    let energyProductionOverTime = [];
    for (let year = 1; year <= 10; year++) {
        // Calculate degraded production for the current year
        const degradedProduction = initialAnnualEnergyProduction * Math.pow(1 - degradationRate, year);
        energyProductionOverTime.push({
            year: year,
            annualProduction: degradedProduction.toFixed(2)
        });
    }

    // Display the results
    let resultHTML = `
        <h3>Calculation Results</h3>
        <p><strong>Total System Power:</strong> ${totalSystemPowerKW.toFixed(2)} kW</p>
        <p><strong>Initial Estimated Daily Energy Production:</strong> ${initialDailyEnergyProduction.toFixed(2)} kWh/day</p>
        <p><strong>Initial Estimated Annual Energy Production:</strong> ${initialAnnualEnergyProduction.toFixed(2)} kWh/year</p>
        <h4>Estimated Annual Energy Production Over 10 Years (With 0.5% Degradation)</h4>
        <table class="result-table">
            <tr>
                <th>Year</th>
                <th>Annual Energy Production (kWh)</th>
            </tr>
    `;

    // Add yearly data to the table
    energyProductionOverTime.forEach((data) => {
        resultHTML += `
            <tr>
                <td>${data.year}</td>
                <td>${data.annualProduction}</td>
            </tr>
        `;
    });

    resultHTML += `</table>`;
    document.getElementById('result').innerHTML = resultHTML;
}
