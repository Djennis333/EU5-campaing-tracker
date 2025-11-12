// Campaign Data
let campaignData = {
    name: 'Rise of Three Nations',
    startDate: 1338,
    currentYear: 1338,
    events: [],
    nations: [],
    mechanics: []
};

let currentParticipants = [];
const STORAGE_KEY = 'EU5_CampaignData';

// Initialize the app
function initApp() {
    const startupScreen = document.getElementById('startupScreen');
    const mainApp = document.getElementById('mainApp');
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        try {
            campaignData = JSON.parse(savedData);
            startupScreen.style.display = 'none';
            mainApp.style.display = 'block';
            loadAppData();
        } catch (error) {
            console.error('Fout bij laden:', error);
            alert('Kon gegevens niet laden. Start nieuwe campaign.');
        }
    }
}

function startNewCampaign() {
    campaignData = {
        name: 'Rise of Three Nations',
        startDate: 1338,
        currentYear: 1338,
        events: [],
        nations: [],
        mechanics: []
    };
    
    document.getElementById('startupScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    saveCampaignData();
    loadAppData();
    showSection('setup');
}

function loadExistingCampaign() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            campaignData = JSON.parse(saved);
            document.getElementById('startupScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            loadAppData();
        } catch (error) {
            alert('Kon bestaande campaign niet laden');
        }
    } else {
        alert('Geen campaign gevonden. Start een nieuwe campaign.');
    }
}

// Save data
function saveCampaignData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaignData));
        console.log('✅ Campaign opgeslagen');
    } catch (error) {
        console.error('Fout bij opslaan:', error);
        alert('Kon gegevens niet opslaan. Je opslagruimte is mogelijk vol.');
    }
}

// Load all app data
function loadAppData() {
    renderDashboard();
    renderTimelineFilters();
    renderSetup();
    renderNationsSection();
    renderGlossary();
    updateWarsList();
}

// Reset to blank
function resetCampaign() {
    const confirmed = confirm('⚠️ WAARSCHUWING: Dit zal ALLE campaign gegevens verwijderen!\n\nWil je alles wissen?');
    
    if (confirmed) {
        const doubleConfirm = confirm('Dit is je LAATSTE waarschuwing. Alles zal weg zijn.\n\nContinueren?');
        
        if (doubleConfirm) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    }
}

// Export/Import
function exportCampaignAsJSON() {
    const dataStr = JSON.stringify(campaignData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EU5_Campaign_${campaignData.currentYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Campaign gedownload!');
}

function importCampaignFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                if (!importedData.nations || !importedData.events !== undefined) {
                    throw new Error('Ongeldig bestand');
                }
                
                campaignData = importedData;
                saveCampaignData();
                loadAppData();
                
                alert('✅ Campaign geïmporteerd!');
            } catch (error) {
                alert('❌ Fout bij importeren: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    event.target.classList.add('active');
}

// ===== DASHBOARD =====
function renderDashboard() {
    document.getElementById('totalEvents').textContent = campaignData.events.length;
    
    const wars = new Set();
    campaignData.events.forEach(event => {
        if (event.war_name) wars.add(event.war_name);
    });
    document.getElementById('totalWars').textContent = wars.size;
    
    document.getElementById('totalNations').textContent = campaignData.nations.length;
    document.getElementById('currentYear').textContent = campaignData.currentYear;
    
    const recentEvents = [...campaignData.events]
        .sort((a, b) => b.year - a.year)
        .slice(0, 5);
    
    const recentEventsList = document.getElementById('recentEventsList');
    recentEventsList.innerHTML = recentEvents.length === 0 
        ? '<p style="text-align: center; color: var(--color-text-secondary);">Nog geen events</p>'
        : recentEvents.map(event => `
        <div class="event-list-item">
            <div style="flex: 1;">
                <strong>${event.name}</strong><br>
                <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                    ${event.year} • ${event.nation} • ${event.event_type}
                </span>
            </div>
            <div class="event-actions">
                <button class="btn btn-secondary btn-small" onclick="showEventDetail(${event.id})">View</button>
                <button class="btn btn-danger btn-small" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// ===== SETUP =====
function renderSetup() {
    const campaignNameEl = document.getElementById('campaignName');
    const startYearEl = document.getElementById('startYear');
    const currentYearEl = document.getElementById('setupCurrentYear');
    
    campaignNameEl.value = campaignData.name;
    startYearEl.value = campaignData.startDate;
    currentYearEl.value = campaignData.currentYear;
    
    renderNationsSetup();
}

function updateCampaignSettings() {
    campaignData.name = document.getElementById('campaignName').value;
    campaignData.startDate = parseInt(document.getElementById('startYear').value);
    campaignData.currentYear = parseInt(document.getElementById('setupCurrentYear').value);
    
    saveCampaignData();
    alert('✅ Campaign instellingen opgeslagen!');
}

function renderNationsSetup() {
    const grid = document.getElementById('nationsSetupGrid');
    
    grid.innerHTML = campaignData.nations.map(nation => `
        <div class="setup-card">
            <div style="display: flex; align-items: center; gap: var(--space-8); margin-bottom: var(--space-12);">
                <div style="width: 30px; height: 30px; background-color: ${nation.color}; border-radius: var(--radius-base);"></div>
                <h3>${nation.name}</h3>
            </div>
            <p><strong>Speler:</strong> ${nation.player}</p>
            <p><strong>Cultuur:</strong> ${nation.culture}</p>
            <p><strong>Doelen:</strong> ${nation.goals}</p>
            <button class="btn btn-danger btn-small" onclick="deleteNation('${nation.name}')" style="margin-top: var(--space-12); width: 100%;">Delete Nation</button>
        </div>
    `).join('');
}

function openAddNationModal() {
    document.getElementById('addNationModal').classList.add('active');
}

function addNation(e) {
    e.preventDefault();
    
    const newNation = {
        name: document.getElementById('nationName').value,
        player: document.getElementById('nationPlayer').value,
        color: document.getElementById('nationColor').value,
        culture: document.getElementById('nationCulture').value,
        goals: document.getElementById('nationGoals').value
    };
    
    campaignData.nations.push(newNation);
    saveCampaignData();
    
    closeModal('addNationModal');
    renderNationsSetup();
    updateEventNationOptions();
    
    alert('✅ Nation toegevoegd!');
}

function deleteNation(nationName) {
    if (confirm(`Delete nation "${nationName}"?`)) {
        campaignData.nations = campaignData.nations.filter(n => n.name !== nationName);
        saveCampaignData();
        renderNationsSetup();
        updateEventNationOptions();
    }
}

// ===== TIMELINE =====
function renderTimelineFilters() {
    const select = document.getElementById('filterNation');
    select.innerHTML = '<option value="all">All Nations</option>' + 
        campaignData.nations.map(n => `<option value="${n.name}">${n.name}</option>`).join('');
}

function updateEventNationOptions() {
    const select = document.getElementById('eventNation');
    select.innerHTML = '<option value="">Select Nation</option>' + 
        campaignData.nations.map(n => `<option value="${n.name}">${n.name}</option>`).join('');
}

function renderTimeline() {
    const filtered = getFilteredEvents();
    const container = document.getElementById('timelineEvents');
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Geen events gevonden</p>';
        return;
    }
    
    const sorted = [...filtered].sort((a, b) => a.year - b.year);
    
    container.innerHTML = sorted.map(event => {
        const nationBadge = getNationBadgeClass(event.nation);
        const typeBadge = getTypeBadgeClass(event.event_type);
        
        return `
            <div class="timeline-event">
                <div class="timeline-event-header">
                    <span class="timeline-event-date">${event.year}</span>
                    <div class="event-badges">
                        <span class="badge ${nationBadge}">${event.nation}</span>
                        <span class="badge ${typeBadge}">${event.event_type}</span>
                    </div>
                </div>
                <h3 class="timeline-event-name">${event.name}</h3>
                <p class="timeline-event-description">${truncateText(event.description, 150)}</p>
                ${event.war_name ? `<div style="margin-top: var(--space-8);"><span class="badge badge-war">⚔️ ${event.war_name}</span></div>` : ''}
                <div style="margin-top: var(--space-12); display: flex; gap: var(--space-8);">
                    <button class="btn btn-secondary btn-small" onclick="showEventDetail(${event.id})">View</button>
                    <button class="btn btn-danger btn-small" onclick="deleteEvent(${event.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function getFilteredEvents() {
    const nation = document.getElementById('filterNation').value;
    const type = document.getElementById('filterType').value;
    const search = document.getElementById('searchTimeline').value.toLowerCase();
    
    return campaignData.events.filter(event => {
        const matchNation = nation === 'all' || event.nation === nation;
        const matchType = type === 'all' || event.event_type === type;
        const matchSearch = search === '' || 
            event.name.toLowerCase().includes(search) ||
            event.description.toLowerCase().includes(search);
        
        return matchNation && matchType && matchSearch;
    });
}

function filterTimeline() {
    renderTimeline();
}

// ===== WARS =====
function renderWars() {
    const wars = getWarsData();
    const grid = document.getElementById('warsGrid');
    
    if (wars.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--color-text-secondary);">Nog geen wars</p>';
        return;
    }
    
    grid.innerHTML = wars.map(war => {
        const duration = war.endYear ? `${war.startYear} - ${war.endYear}` : `${war.startYear} - Ongoing`;
        const statusClass = war.endYear ? 'completed' : 'ongoing';
        const statusText = war.endYear ? 'Completed' : 'Ongoing';
        
        return `
            <div class="war-card">
                <h3 class="war-name">${war.name}</h3>
                <p class="war-dates">${duration}</p>
                <span class="war-status ${statusClass}">${statusText}</span>
                <div class="war-events">
                    ${war.events.map(e => `
                        <div class="war-event-item">
                            <strong>${e.year}</strong> - ${e.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function getWarsData() {
    const warsMap = new Map();
    
    campaignData.events.forEach(event => {
        if (event.war_name) {
            if (!warsMap.has(event.war_name)) {
                warsMap.set(event.war_name, {
                    name: event.war_name,
                    startYear: null,
                    endYear: null,
                    events: []
                });
            }
            
            const war = warsMap.get(event.war_name);
            war.events.push(event);
            
            if (event.event_type === 'War Start') {
                if (!war.startYear || event.year < war.startYear) {
                    war.startYear = event.year;
                }
            }
            
            if (event.event_type === 'War End') {
                if (!war.endYear || event.year > war.endYear) {
                    war.endYear = event.year;
                }
            }
        }
    });
    
    return Array.from(warsMap.values()).sort((a, b) => a.startYear - b.startYear);
}

function updateWarsList() {
    const wars = getWarsData();
    const datalist = document.getElementById('existingWars');
    datalist.innerHTML = wars.map(war => `<option value="${war.name}">`).join('');
}

// ===== NATIONS =====
function renderNationsSection() {
    const grid = document.getElementById('nationsGrid');
    
    if (campaignData.nations.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary);">Setup nations in Setup tab</p>';
        return;
    }
    
    grid.innerHTML = campaignData.nations.map(nation => {
        const events = campaignData.events
            .filter(e => e.nation === nation.name)
            .sort((a, b) => b.year - a.year)
            .slice(0, 5);
        
        return `
            <div class="nation-card" style="border-left: 4px solid ${nation.color};">
                <div class="nation-header">
                    <div class="nation-flag" style="background-color: ${nation.color};"></div>
                    <div class="nation-info">
                        <h3>${nation.name}</h3>
                        <p class="nation-player">Player: ${nation.player}</p>
                    </div>
                </div>
                
                <div class="nation-section">
                    <h4>Cultuur</h4>
                    <p>${nation.culture}</p>
                </div>
                
                <div class="nation-section">
                    <h4>Doelen</h4>
                    <p>${nation.goals}</p>
                </div>
                
                <div class="nation-section">
                    <h4>Recente Events</h4>
                    <ul>
                        ${events.length === 0 ? '<li>Geen events</li>' : events.map(e => `<li>${e.year}: ${e.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
}

// ===== GLOSSARY =====
function renderGlossary() {
    renderGlossaryCategories();
    renderGlossaryList();
}

function renderGlossaryCategories() {
    const categories = ['All', ...new Set(campaignData.mechanics.map(m => m.category))];
    const container = document.getElementById('glossaryCategories');
    
    container.innerHTML = categories.map((cat, index) => {
        const active = index === 0 ? 'active' : '';
        return `<button class="category-btn ${active}" onclick="filterGlossaryByCategory('${cat}')">${cat}</button>`;
    }).join('');
}

function renderGlossaryList(filtered = null) {
    const mechanics = filtered || campaignData.mechanics;
    const container = document.getElementById('glossaryList');
    
    if (mechanics.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Geen mechanics</p>';
        return;
    }
    
    container.innerHTML = mechanics.map(mechanic => `
        <div class="glossary-item">
            <h3 class="glossary-term">${mechanic.term}</h3>
            <span class="glossary-category">${mechanic.category}</span>
            <p class="glossary-definition">${mechanic.definition}</p>
        </div>
    `).join('');
}

function filterGlossary() {
    const search = document.getElementById('glossarySearch').value.toLowerCase();
    const filtered = campaignData.mechanics.filter(m => 
        m.term.toLowerCase().includes(search) ||
        m.definition.toLowerCase().includes(search)
    );
    renderGlossaryList(filtered);
}

function filterGlossaryByCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const filtered = category === 'All' 
        ? campaignData.mechanics 
        : campaignData.mechanics.filter(m => m.category === category);
    
    renderGlossaryList(filtered);
}

function openAddMechanicModal() {
    document.getElementById('addMechanicModal').classList.add('active');
}

function addMechanic(e) {
    e.preventDefault();
    
    const newMechanic = {
        term: document.getElementById('mechanicTerm').value,
        category: document.getElementById('mechanicCategory').value,
        definition: document.getElementById('mechanicDefinition').value
    };
    
    campaignData.mechanics.push(newMechanic);
    saveCampaignData();
    
    closeModal('addMechanicModal');
    renderGlossary();
    
    alert('✅ Mechanic toegevoegd!');
}

// ===== EXPORT =====
function generateChronicle() {
    const exportPreview = document.getElementById('exportPreview');
    const wars = getWarsData();
    
    let html = `
        <h1>${campaignData.name}</h1>
        <h2>Rise of Three Nations</h2>
        <p><strong>Campaign Period:</strong> ${campaignData.startDate} - ${campaignData.currentYear}</p>
        <p><strong>Players:</strong> ${campaignData.nations.map(n => `${n.player} (${n.name})`).join(', ')}</p>
        
        <h2>Campaign Overview</h2>
        <p>This chronicle documents the campaign with ${campaignData.events.length} recorded events and ${wars.length} major wars.</p>
        
        <h2>The Nations</h2>
    `;
    
    campaignData.nations.forEach(nation => {
        html += `
            <h3>${nation.name}</h3>
            <p><strong>Played by:</strong> ${nation.player}</p>
            <p><strong>Primary Culture:</strong> ${nation.culture}</p>
            <p><strong>Goals:</strong> ${nation.goals}</p>
        `;
    });
    
    html += '<h2>Complete Timeline of Events</h2>';
    
    [...campaignData.events].sort((a, b) => a.year - b.year).forEach(event => {
        html += `
            <h3>${event.year} - ${event.name}</h3>
            <p><strong>Nation:</strong> ${event.nation} | <strong>Type:</strong> ${event.event_type}</p>
            ${event.war_name ? `<p><strong>War:</strong> ${event.war_name}</p>` : ''}
            <p>${event.description}</p>
            ${event.participants && event.participants.length > 0 ? `<p><strong>Participants:</strong> ${event.participants.join(', ')}</p>` : ''}
        `;
    });
    
    if (wars.length > 0) {
        html += '<h2>Wars Summary</h2>';
        
        wars.forEach(war => {
            const duration = war.endYear ? `${war.startYear} - ${war.endYear}` : `${war.startYear} - Ongoing`;
            
            html += `
                <h3>${war.name}</h3>
                <p><strong>Duration:</strong> ${duration}</p>
                <p><strong>Events:</strong></p>
                <ul>
                    ${war.events.map(e => `<li>${e.year} - ${e.name}</li>`).join('')}
                </ul>
            `;
        });
    }
    
    exportPreview.innerHTML = html;
}

function copyChronicle() {
    const text = document.getElementById('exportPreview').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function downloadChronicle() {
    const text = document.getElementById('exportPreview').innerText;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EU5_Chronicle_${campaignData.currentYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== EVENTS =====
function openAddEventModal() {
    document.getElementById('addEventModal').classList.add('active');
    currentParticipants = [];
    renderParticipants();
    updateEventNationOptions();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'addEventModal') {
        document.getElementById('addEventForm').reset();
        currentParticipants = [];
        renderParticipants();
    } else if (modalId === 'addMechanicModal') {
        document.getElementById('addMechanicForm').reset();
    } else if (modalId === 'addNationModal') {
        document.getElementById('addNationForm').reset();
    }
}

function toggleWarName() {
    const eventType = document.getElementById('eventType').value;
    const warNameGroup = document.getElementById('warNameGroup');
    
    if (eventType === 'War Start' || eventType === 'War End') {
        warNameGroup.style.display = 'block';
    } else {
        warNameGroup.style.display = 'none';
    }
}

function addParticipant() {
    const input = document.getElementById('participantInput');
    const participant = input.value.trim();
    
    if (participant && !currentParticipants.includes(participant)) {
        currentParticipants.push(participant);
        renderParticipants();
        input.value = '';
    }
}

function removeParticipant(index) {
    currentParticipants.splice(index, 1);
    renderParticipants();
}

function renderParticipants() {
    const list = document.getElementById('participantsList');
    list.innerHTML = currentParticipants.map((p, index) => `
        <span class="participant-tag">
            ${p}
            <button type="button" onclick="removeParticipant(${index})">&times;</button>
        </span>
    `).join('');
}

function addEvent(e) {
    e.preventDefault();
    
    const newEvent = {
        id: Date.now(),
        year: parseInt(document.getElementById('eventYear').value),
        nation: document.getElementById('eventNation').value,
        event_type: document.getElementById('eventType').value,
        name: document.getElementById('eventName').value,
        description: document.getElementById('eventDescription').value,
        participants: [...currentParticipants],
        war_name: document.getElementById('warName').value || null
    };
    
    campaignData.events.push(newEvent);
    
    if (newEvent.year > campaignData.currentYear) {
        campaignData.currentYear = newEvent.year;
    }
    
    saveCampaignData();
    
    closeModal('addEventModal');
    updateWarsList();
    renderDashboard();
    
    alert('✅ Event added!');
}

function addEventAndContinue() {
    const form = document.getElementById('addEventForm');
    
    if (form.checkValidity()) {
        const newEvent = {
            id: Date.now(),
            year: parseInt(document.getElementById('eventYear').value),
            nation: document.getElementById('eventNation').value,
            event_type: document.getElementById('eventType').value,
            name: document.getElementById('eventName').value,
            description: document.getElementById('eventDescription').value,
            participants: [...currentParticipants],
            war_name: document.getElementById('warName').value || null
        };
        
        campaignData.events.push(newEvent);
        
        if (newEvent.year > campaignData.currentYear) {
            campaignData.currentYear = newEvent.year;
        }
        
        saveCampaignData();
        
        form.reset();
        currentParticipants = [];
        renderParticipants();
        updateWarsList();
        renderDashboard();
        
        alert('✅ Event added! Add another.');
    } else {
        form.reportValidity();
    }
}

function deleteEvent(eventId) {
    if (confirm('Delete this event?')) {
        campaignData.events = campaignData.events.filter(e => e.id !== eventId);
        saveCampaignData();
        renderDashboard();
        renderTimeline();
        renderWars();
        renderNationsSection();
        updateWarsList();
        alert('✅ Event deleted!');
    }
}

function showEventDetail(eventId) {
    const event = campaignData.events.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventDetailModal');
    const titleEl = document.getElementById('detailEventName');
    const contentEl = document.getElementById('eventDetailContent');
    
    titleEl.textContent = event.name;
    
    contentEl.innerHTML = `
        <div style="margin-bottom: var(--space-16);">
            <p><strong>Date:</strong> ${event.year}</p>
            <p><strong>Nation:</strong> ${event.nation}</p>
            <p><strong>Event Type:</strong> ${event.event_type}</p>
            ${event.war_name ? `<p><strong>War:</strong> ${event.war_name}</p>` : ''}
        </div>
        <div style="margin-bottom: var(--space-16);">
            <h4 style="margin-bottom: var(--space-8);">Description</h4>
            <p>${event.description}</p>
        </div>
        ${event.participants && event.participants.length > 0 ? `
            <div>
                <h4 style="margin-bottom: var(--space-8);">Participants</h4>
                <p>${event.participants.join(', ')}</p>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

// Utility functions
function getNationBadgeClass(nation) {
    const nationObj = campaignData.nations.find(n => n.name === nation);
    if (!nationObj) return 'badge-political';
    return 'badge-political';
}

function getTypeBadgeClass(type) {
    if (type.includes('War')) return 'badge-war';
    if (type === 'Economic') return 'badge-economic';
    if (type === 'Political') return 'badge-political';
    if (type === 'Formation') return 'badge-formation';
    if (type === 'Crisis') return 'badge-crisis';
    return 'badge-political';
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initApp);

// Allow enter key for participants
document.addEventListener('DOMContentLoaded', () => {
    const participantInput = document.getElementById('participantInput');
    if (participantInput) {
        participantInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addParticipant();
            }
        });
    }
});
