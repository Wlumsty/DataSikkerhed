/**
 * Main JavaScript file for the DataSikkerhed project
 * Handles home page functionality and initial navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Start button click handler
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            // Navigate to the login page
            window.location.href = 'login.html';
        });
    }

    // Setup localStorage if it doesn't exist
    if (!localStorage.getItem('userChoices')) {
        // Initialize user choices object
        const userChoices = {
            login: {
                created: false,
                email: '',
                password: ''
            },
            scenarios: {
                gmailLogin: {
                    attempted: false,
                    usedCorrectCredentials: false
                },
                dbaScenario: {
                    attempted: false,
                    clickedAd: false,
                    reportedAsSpam: false,
                    providedPersonalInfo: false
                },
                facebookScenario: {
                    attempted: false,
                    clickedFakeLink: false,
                    usedCorrectLogin: false
                }
            },
            score: 0,
            maxScore: 3,
            completed: false
        };

        // Save to localStorage
        localStorage.setItem('userChoices', JSON.stringify(userChoices));
    }
});
