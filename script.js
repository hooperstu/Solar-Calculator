// Define peak sun hours for each region
const regionSunlightHours = {
    south: 4,
    midlands: 3.5,
    north: 3
};

// Default sunlight hours
let averageSunlightHours = 4; 

// Update sunlight hours based on selected region
function updateSunlightHours() {
    const regionSelect = document.getElementById('regionSelect').value;

    if (regionSelect in regionSunlightHours) {
        averageSunlightHours = regionSunlightHours[regionSelect];
    } else {
        averageSunlightHours = 0; // Set to 0 or a default if no region is selected
    }
}


function calculateSolar() {
    // Get the input values
    const panelWattage = parseFloat(document.getElementById('panelWattage').value);
    const panelCount = parseFloat(document.getElementById('panelCount').value);
    let degradationRate = parseFloat(document.getElementById('degradationRate').value) / 100;
    const regionSelect = document.getElementById('regionSelect').value;

    // Clear previous error messages
    document.getElementById('panelWattageError').innerText = '';
    document.getElementById('panelCountError').innerText = '';
    document.getElementById('degradationRateError').innerText = '';
    document.getElementById('regionError').innerText = '';

    let isValid = true;

    // Validate panel wattage
    if (isNaN(panelWattage) || panelWattage <= 0) {
        document.getElementById('panelWattageError').innerText = 'Please enter a valid panel wattage greater than 0.';
        isValid = false;
    }

    // Validate panel count
    if (isNaN(panelCount) || panelCount <= 0) {
        document.getElementById('panelCountError').innerText = 'Please enter a valid number of panels greater than 0.';
        isValid = false;
    }

    // Validate degradation rate
    if (isNaN(degradationRate) || degradationRate < 0) {
        document.getElementById('degradationRateError').innerText = 'Please enter a valid degradation rate (Recommended: 0.5%).';
        degradationRate = 0.005; // Default to 0.5% if invalid
    }

    // Validate region selection
    if (regionSelect === "") {
        document.getElementById('regionError').innerText = 'Please select a region to proceed.';
        isValid = false;
    } else {
        // Update sunlight hours if region is selected
        updateSunlightHours();
    }

    // If any input is invalid, stop the calculation
    if (!isValid) {
        document.getElementById('result').style.display = "none";
        return;
    }

    // Calculate total system power (in kW)
    const totalSystemPowerKW = (panelWattage * panelCount) / 1000;

    // Estimate initial daily energy production (using averageSunlightHours from the selected region)
    const initialDailyEnergyProduction = totalSystemPowerKW * averageSunlightHours; // kWh/day

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
        <h4>Estimated Annual Energy Production Over 10 Years (With ${(degradationRate * 100).toFixed(2)}% Compounded Degradation)</h4>
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
    document.getElementById('result').style.display = "block";
}
