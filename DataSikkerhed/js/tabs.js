/**
 * Tabs Manager
 * Håndterer browser tabs og tracking af brugerens adfærd
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser brugervalg fra localStorage
    const userChoices = JSON.parse(localStorage.getItem('userChoices')) || {
        score: 0,
        tabs: [],
        scenarios: {}
    };
    
    // Sikre at tabs-array eksisterer
    if (!userChoices.tabs || !Array.isArray(userChoices.tabs)) {
        userChoices.tabs = [];
    }
    
    // Fjern uønskede tabs (startside og opret login)
    userChoices.tabs = userChoices.tabs.filter(tab => {
        return tab.title !== 'Startside' && 
               !tab.title.includes('Opret Login') && 
               !tab.url.includes('index.html') && 
               !tab.url.includes('login.html');
    });
    
    // Log nuværende tabs til fejlsøgning
    console.log('Current tabs in localStorage:', userChoices.tabs);
    
    // Find tab container
    const tabsContainer = document.querySelector('.tabs-container');
    if (!tabsContainer) return; // Hvis der ikke er en tabs container, afslut
    
    // Få den aktuelle side
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let currentPageTitle = document.title || 'Side';
    const isSecurePage = window.location.href.includes('https') || window.location.href.includes('http');
    
    // Håndter Gmail - indbakke der erstatter Gmail - log ind
    const isGmailInbox = currentPage === 'gmail-inbox.html';
    if (isGmailInbox) {
        // Kig efter eksisterende Gmail login tab og erstat den
        const gmailLoginIndex = userChoices.tabs.findIndex(tab => 
            tab.title.includes('Gmail - Log ind') || tab.url.includes('gmail-login.html')
        );
        
        if (gmailLoginIndex !== -1) {
            console.log('Replacing Gmail login tab with inbox tab');
            userChoices.tabs[gmailLoginIndex] = {
                url: currentPage,
                title: currentPageTitle,
                isSecure: isSecurePage,
                active: true
            };
            
            // Sæt andre tabs til inaktive
            userChoices.tabs.forEach((tab, index) => {
                if (index !== gmailLoginIndex) {
                    tab.active = false;
                }
            });
            
            // Gem opdateringerne
            localStorage.setItem('userChoices', JSON.stringify(userChoices));
            
            // Log opdateringen
            console.log('Updated tabs:', userChoices.tabs);
        }
    }
    
    // Sikr at der altid eksisterer mindst én tab (startside)
    if (userChoices.tabs.length === 0) {
        userChoices.tabs.push({
            url: 'index.html',
            title: 'Startside',
            isSecure: true,
            active: false
        });
    }
    
    // Tjek om siden allerede eksisterer i tabs
    const existingTabIndex = userChoices.tabs.findIndex(tab => tab.url === currentPage);
    
    if (existingTabIndex === -1) {
        // Sæt alle tabs til inaktive
        userChoices.tabs.forEach(tab => tab.active = false);
        
        // Tilføj denne side som en ny tab
        userChoices.tabs.push({
            url: currentPage,
            title: currentPageTitle,
            isSecure: isSecurePage,
            active: true
        });
        
        console.log('Added new tab:', currentPage);
    } else {
        // Marker denne tab som aktiv
        userChoices.tabs.forEach((tab, index) => {
            tab.active = (index === existingTabIndex);
        });
        console.log('Set existing tab as active:', currentPage);
    }
    
    // Gem brugervalg
    localStorage.setItem('userChoices', JSON.stringify(userChoices));
    
    // Render tabs
    renderTabs();
    
    /**
     * Render browser tabs
     */
    function renderTabs() {
        if (!tabsContainer) {
            console.error('Tabs container not found');
            return;
        }
        
        console.log('Rendering tabs:', userChoices.tabs);
        
        // Ryd eksisterende tabs
        tabsContainer.innerHTML = '';
        
        // Sørg for at vi har mindst én tab at vise
        if (userChoices.tabs.length === 0) {
            console.log('No tabs found, creating default tab');
            userChoices.tabs.push({
                url: currentPage || 'index.html',
                title: currentPageTitle || 'Startside',
                isSecure: true,
                active: true
            });
        }
        
        // Tilføj hver tab
        userChoices.tabs.forEach((tab, index) => {
            const tabElement = document.createElement('div');
            tabElement.className = `browser-tab ${tab.active ? 'active' : ''}`;
            
            // Favicon baseret på sikkerhedsstatus
            const favicon = tab.isSecure ? 
                '<i class="fas fa-lock secure-icon"></i>' : 
                '<i class="fas fa-lock-open not-secure-icon"></i>';
            
            // Tilføj tab indhold
            tabElement.innerHTML = `
                ${favicon}
                <span class="tab-title">${tab.title}</span>
                ${index !== 0 ? '<span class="tab-close">&times;</span>' : ''}
            `;
            
            // Tilføj eventlistener for at skifte til denne tab
            tabElement.addEventListener('click', () => switchTab(index));
            
            // Tilføj eventlistener for at lukke denne tab
            const closeButton = tabElement.querySelector('.tab-close');
            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeTab(index);
                });
            }
            
            tabsContainer.appendChild(tabElement);
        });
    }
    
    /**
     * Skift til en anden tab
     */
    function switchTab(index) {
        const tab = userChoices.tabs[index];
        if (!tab) return;
        
        // Hvis det er den aktive tab, gør ingenting
        if (tab.active) return;
        
        // Redirect til den valgte tab
        window.location.href = tab.url;
    }
    
    /**
     * Luk en tab
     */
    function closeTab(index) {
        const tab = userChoices.tabs[index];
        if (!tab || index === 0) return; // Kan ikke lukke den første tab
        
        // Tjek om det er en Gmail log ind tab - den kan heller ikke lukkes
        if (tab.title.includes('Gmail - Log ind') || tab.url.includes('gmail-login.html')) {
            console.log('Cannot close Gmail login tab');
            return;
        }
        
        // Tjek om det er en usikker tab
        if (!tab.isSecure) {
            // Tilføj point for at lukke en usikker side
            userChoices.score += 0.5;
            
            // Opdater brugerens valg
            if (!userChoices.scenarios.tabManagement) {
                userChoices.scenarios.tabManagement = {};
            }
            userChoices.scenarios.tabManagement.closedInsecureTab = true;
        }
        
        // Fjern tabben
        userChoices.tabs.splice(index, 1);
        
        // Hvis den aktive tab blev lukket, aktiver den forrige
        const hasActiveTab = userChoices.tabs.some(tab => tab.active);
        if (!hasActiveTab && userChoices.tabs.length > 0) {
            userChoices.tabs[0].active = true;
        }
        
        // Gem brugervalg
        localStorage.setItem('userChoices', JSON.stringify(userChoices));
        
        // Genrender tabs
        renderTabs();
        
        // Hvis den aktive tab blev lukket, redirect til den nye aktive
        if (!hasActiveTab) {
            window.location.href = userChoices.tabs[0].url;
        }
    }
});
