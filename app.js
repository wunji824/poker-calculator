document.addEventListener('DOMContentLoaded', function() {
    const playerCountSelect = document.getElementById('player-count');
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const pokerForm = document.getElementById('poker-form');
    const playerButtonsDiv = document.getElementById('player-buttons');
    const nextButton2 = document.getElementById('next-button-2');

    // List of player names
    const playerNames = [
        'Armaan', 'Nikhith', 'Kunj', 'Varnith', 'Rahul', 'Ishaan', 'Louis',
        'Sahil', 'Aaryan', 'Shrey', 'Adi', 'Aryan', 'Karnav'
    ];

    // Sort player names alphabetically
    playerNames.sort();

    // Populate the dropdown with numbers 2 to 16
    for (let i = 2; i <= 16; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        playerCountSelect.appendChild(option);
    }

    // Handle the "Next" button click on Screen 1
    document.getElementById('next-button-1').addEventListener('click', function() {
        screen1.style.display = 'none';
        screen2.style.display = 'block';

        // Clear previous player buttons if any
        playerButtonsDiv.innerHTML = '';

        // Add buttons for each player
        playerNames.forEach(name => {
            const button = document.createElement('button');
            button.textContent = name;
            button.className = 'player-button';
            button.addEventListener('click', function() {
                const selectedButtons = document.querySelectorAll('.player-button.selected').length;
                
                if (button.classList.contains('selected')) {
                    // Unselect the player
                    button.classList.remove('selected');
                    button.style.backgroundColor = '#d3d3d3'; // Revert to gray
                    button.style.color = 'black'; // Revert text color to black
                } else if (selectedButtons < parseInt(playerCountSelect.value)) {
                    // Select the player if not exceeding the limit
                    button.classList.add('selected');
                    button.style.backgroundColor = '#28a745'; // Turn green
                    button.style.color = 'white'; // Turn text color to white
                }

                // Enable the "Next" button only if at least one player is selected
                nextButton2.disabled = document.querySelectorAll('.player-button.selected').length === 0;
            });
            playerButtonsDiv.appendChild(button);
        });
    });

    // Handle the "Next" button click on Screen 2
    nextButton2.addEventListener('click', function() {
        const selectedPlayers = Array.from(document.querySelectorAll('.player-button.selected')).map(button => button.textContent);
        screen2.style.display = 'none';
        screen3.style.display = 'block';

        // Clear previous player input fields if any
        pokerForm.innerHTML = '';

        // Dynamically add player input fields based on the selected names
        selectedPlayers.forEach((name, index) => {
            const playerFieldset = document.createElement('fieldset');
            playerFieldset.innerHTML = `
                <legend>Player ${index + 1}</legend>
                <label for="player${index + 1}-name">Name:</label>
                <input type="text" id="player${index + 1}-name" name="player${index + 1}-name" value="${name}" readonly><br>
                <label for="player${index + 1}-buyin">Buy-in:</label>
                <input type="number" id="player${index + 1}-buyin" name="player${index + 1}-buyin" required><br>
                <label for="player${index + 1}-final">End Stack:</label>
                <input type="number" id="player${index + 1}-final" name="player${index + 1}-final" required><br>
            `;
            pokerForm.appendChild(playerFieldset);
        });

        // Add remaining input fields if less than the total selected on Screen 1
        for (let i = selectedPlayers.length + 1; i <= parseInt(playerCountSelect.value); i++) {
            const playerFieldset = document.createElement('fieldset');
            playerFieldset.innerHTML = `
                <legend>Player ${i}</legend>
                <label for="player${i}-name">Name:</label>
                <input type="text" id="player${i}-name" name="player${i}-name" required><br>
                <label for="player${i}-buyin">Buy-in:</label>
                <input type="number" id="player${i}-buyin" name="player${i}-buyin" required><br>
                <label for="player${i}-final">End Stack:</label>
                <input type="number" id="player${i}-final" name="player${i}-final" required><br>
            `;
            pokerForm.appendChild(playerFieldset);
        }

        // Add the calculate button at the end of the form
        const calculateButton = document.createElement('button');
        calculateButton.type = 'submit';
        calculateButton.textContent = 'Calculate';
        pokerForm.appendChild(calculateButton);
    });

    // Handle the form submission to calculate results
    pokerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Clear previous results

        const playerCount = parseInt(playerCountSelect.value);
        let totalBuyin = 0;
        let totalFinal = 0;
        let results = [];

        for (let i = 1; i <= playerCount; i++) {
            const name = document.getElementById(`player${i}-name`).value;
            const buyin = parseFloat(document.getElementById(`player${i}-buyin`).value);
            const final = parseFloat(document.getElementById(`player${i}-final`).value);

            totalBuyin += buyin;
            totalFinal += final;

            const profit = final - buyin;
            const resultText = profit >= 0 ? `+$${profit}` : `-$${Math.abs(profit)}`;
            results.push({ name, resultText, profit });
        }

        if (totalBuyin !== totalFinal) {
            const difference = Math.abs(totalFinal - totalBuyin);
            const advice = totalFinal > totalBuyin
                ? `Subtract $${difference} from end stacks.`
                : `Add $${difference} to end stacks.`;
            resultDiv.innerHTML = advice;
        } else {
            // Sort results by profit, highest to lowest
            results.sort((a, b) => b.profit - a.profit);
            // Display sorted results with $ sign
            resultDiv.innerHTML = results.map(r => `${r.name}: ${r.resultText}`).join('<br>');
        }
    });
});

