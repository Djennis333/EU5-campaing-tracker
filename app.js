// Campaign Data
let campaignData = {
    name: 'Rise of Three Nations',
    startDate: 1338,
    currentYear: 1386,
    events: [],
    nations: [],
    mechanics: []
};

// Temporary storage for form participants
let currentParticipants = [];

// Timeline canvas state
let timelineCanvas = null;
let timelineCtx = null;
let timelineState = {
    startYear: 1337,
    endYear: 1837,
    viewStart: 1337,
    viewEnd: 1837,
    isDragging: false,
    lastX: 0,
    hoveredEvent: null
};

// Initialize the app
function initApp() {
    loadInitialData();
    renderDashboard();
    initInteractiveTimeline();
    renderTimeline();
    renderWars();
    renderNations();
    renderGlossary();
    updateWarsList();
}

// Load initial campaign data
function loadInitialData() {
    // Load nations
    campaignData.nations = [
        {
            name: 'Holland/Netherlands',
            player: 'Dennis',
            color: '#FF6B35',
            culture: 'Dutch',
            goals: 'Unite the Netherlands, build trading empire, establish colonies'
        },
        {
            name: 'Castile',
            player: 'Maikel',
            color: '#F4D03F',
            culture: 'Castilian',
            goals: 'Unite Iberia as Spain, economic dominance'
        },
        {
            name: 'Mali',
            player: 'Eddo',
            color: '#27AE60',
            culture: 'Malian',
            goals: 'Economic power through wealth, prepare for European colonization'
        }
    ];

    // Load events
    campaignData.events = [
        {
            id: 1,
            date: '1338',
            year: 1338,
            nation: 'Castile',
            event_type: 'War Start',
            name: 'Granada Campaign Begins',
            description: 'Castile invades Granada to complete the Reconquista. The war proves more difficult than expected due to mountainous terrain and Granada\'s fortifications.',
            participants: ['Castile', 'Granada'],
            war_name: 'The Granada War'
        },
        {
            id: 2,
            date: '1338',
            year: 1338,
            nation: 'Holland',
            event_type: 'War Start',
            name: 'Dutch Consolidation Begins',
            description: 'Holland begins systematic conquest of neighboring Dutch provinces to forge a united Netherlands.',
            participants: ['Holland', 'Gelders', 'Utrecht', 'Frisia'],
            war_name: 'Wars of Dutch Unification'
        },
        {
            id: 3,
            date: '1338',
            year: 1338,
            nation: 'Mali',
            event_type: 'Expansion',
            name: 'Vassalization Strategy Initiated',
            description: 'Mali begins expanding through vassalization of smaller tribal nations rather than direct conquest.',
            participants: ['Mali']
        },
        {
            id: 4,
            date: '1345',
            year: 1345,
            nation: 'Castile',
            event_type: 'War End',
            name: 'Granada Falls',
            description: 'After 8 years of brutal warfare including an invasion of Morocco, Granada finally surrenders. Victory comes at tremendous cost in manpower and gold.',
            participants: ['Castile', 'Granada', 'Marinids'],
            war_name: 'The Granada War'
        },
        {
            id: 5,
            date: '1350',
            year: 1350,
            nation: 'Castile',
            event_type: 'War Start',
            name: 'Aragon Conquest Begins',
            description: 'Castile launches campaign to conquer Aragon, a major Mediterranean power. This war will determine whether Spain can be united.',
            participants: ['Castile', 'Aragon'],
            war_name: 'The Aragon War'
        },
        {
            id: 6,
            date: '1355',
            year: 1355,
            nation: 'Castile',
            event_type: 'War End',
            name: 'Aragon Destroyed',
            description: 'After 5 years of warfare, Aragon is shattered. Castile annexes almost all Aragonese territory, bringing Spain within reach.',
            participants: ['Castile', 'Aragon'],
            war_name: 'The Aragon War'
        },
        {
            id: 7,
            date: '1364',
            year: 1364,
            nation: 'Castile',
            event_type: 'War Start',
            name: 'Coalition War Declared',
            description: 'European powers form massive coalition against Castile. France, Portugal, and Papal States lead alliance of 110,000 troops against Castile\'s 40,000.',
            participants: ['Castile', 'France', 'Portugal', 'Papal States'],
            war_name: 'The Coalition War of 1364'
        },
        {
            id: 8,
            date: '1364',
            year: 1364,
            nation: 'Castile',
            event_type: 'War End',
            name: 'Castile Survives Coalition',
            description: 'Through desperate fighting and tactical victories against Portugal, Castile negotiates survivable peace. Catalonia released as independent nation and war reparations paid.',
            participants: ['Castile', 'France', 'Portugal', 'Papal States'],
            war_name: 'The Coalition War of 1364'
        },
        {
            id: 9,
            date: '1368',
            year: 1368,
            nation: 'Holland',
            event_type: 'Political',
            name: 'Holland Becomes Duchy',
            description: 'Holland achieves significant milestone by becoming a Duchy, increasing prestige and governmental capacity.',
            participants: ['Holland']
        },
        {
            id: 10,
            date: '1377',
            year: 1377,
            nation: 'Holland',
            event_type: 'Formation',
            name: 'Netherlands Formed',
            description: 'After annexing Frisia, Dennis formally proclaims the Duchy of the Netherlands. The fractured Dutch lands are finally united.',
            participants: ['Holland']
        },
        {
            id: 11,
            date: '1379',
            year: 1379,
            nation: 'Holland',
            event_type: 'Economic',
            name: 'Infrastructure Project Begins',
            description: 'Netherlands begins ambitious road network construction connecting The Hague, Amsterdam, and Utrecht. Project financed through loans.',
            participants: ['Holland']
        },
        {
            id: 12,
            date: '1379',
            year: 1379,
            nation: 'Holland',
            event_type: 'Crisis',
            name: 'Food Market Crash',
            description: 'Catastrophic food market collapse devastates Dutch agricultural revenues. Unable to service debt, Netherlands declares first bankruptcy.',
            participants: ['Holland']
        },
        {
            id: 13,
            date: '1379',
            year: 1379,
            nation: 'Holland',
            event_type: 'Economic',
            name: 'Bankruptcy Death Spiral Begins',
            description: 'Bankruptcy penalties prevent positive revenue, forcing repeated bankruptcies. Netherlands enters recursive economic crisis.',
            participants: ['Holland']
        },
        {
            id: 14,
            date: '1379',
            year: 1379,
            nation: 'Castile',
            event_type: 'Diplomatic',
            name: 'Castilian Bailout',
            description: 'Maikel provides emergency financial support: 280 gold loan at 2% interest plus 4.8 gold/month. Lifeline saves Netherlands from collapse.',
            participants: ['Castile', 'Holland']
        },
        {
            id: 15,
            date: '1383',
            year: 1383,
            nation: 'Holland',
            event_type: 'War Start',
            name: 'Tax Revolt Erupts',
            description: 'Massive civil war breaks out across Netherlands due to crushing taxation. Rebel armies rise in multiple provinces simultaneously.',
            participants: ['Holland', 'Dutch Rebels'],
            war_name: 'The Dutch Tax Revolt'
        },
        {
            id: 16,
            date: '1383',
            year: 1383,
            nation: 'Holland',
            event_type: 'War End',
            name: 'Revolt Crushed',
            description: 'With support from defensive league allies (Münster, Luxembourg, Trier) and Denmark, loyalist forces crush the rebellion.',
            participants: ['Holland', 'Münster', 'Luxembourg', 'Trier', 'Denmark'],
            war_name: 'The Dutch Tax Revolt'
        },
        {
            id: 17,
            date: '1386',
            year: 1386,
            nation: 'Holland',
            event_type: 'Economic',
            name: 'Bankruptcy Penalties Expire',
            description: 'Netherlands finally emerges from bankruptcy crisis. Economy stabilizes and recovery begins.',
            participants: ['Holland']
        }
    ];

    // Load mechanics
    campaignData.mechanics = [
        {
            term: 'Pops',
            category: 'Core System',
            definition: 'Population groups defined by culture, religion, societal class, and location. The fundamental unit driving economy, military, and stability.'
        },
        {
            term: 'Estates',
            category: 'Internal Politics',
            definition: 'Political factions (Nobility, Clergy, Burghers, Commoners) that control portions of national power and tax base. Must be kept satisfied.'
        },
        {
            term: 'Control',
            category: 'Governance',
            definition: 'State\'s ability to exert authority over a location. Radiates from capital. Low control reduces tax income and slows conversion.'
        },
        {
            term: 'Proximity',
            category: 'Governance',
            definition: 'Measure of travel ease from capital to location. Determines control effectiveness. Improved by roads and geography.'
        },
        {
            term: 'Market',
            category: 'Economy',
            definition: 'Dynamic collection of locations trading goods. Each has a Market Capital. Supply and demand determine prices.'
        },
        {
            term: 'Levies',
            category: 'Military',
            definition: 'Raised peasant armies drawn directly from Pops. Casualties deplete home population. Cheaper but less effective than regulars.'
        },
        {
            term: 'Regulars',
            category: 'Military',
            definition: 'Professional soldiers requiring manpower and goods for maintenance. More effective than levies but expensive.'
        },
        {
            term: 'Bankruptcy',
            category: 'Economy',
            definition: 'Catastrophic economic event causing building downgrades, stability loss, military capacity reduction. Can trigger death spiral.'
        },
        {
            term: 'Coalition',
            category: 'Diplomacy',
            definition: 'Alliance of nations formed against overly aggressive power. Can lead to overwhelming defensive wars.'
        },
        {
            term: 'Siege',
            category: 'Military',
            definition: 'Process of capturing fortified locations. Progresses in phases with dice rolls. Artillery and breaches accelerate progress.'
        },
        {
            term: 'Development',
            category: 'Economy',
            definition: 'Measure of location cultivation. Increases population capacity and building slots. Grows through Prosperity.'
        },
        {
            term: 'Prosperity',
            category: 'Economy',
            definition: 'Accrues in stable, well-fed locations. Increases Development. Rapidly destroyed by sieges, disease, and low satisfaction.'
        }
    ];

    // Update current year to latest event
    const latestEvent = campaignData.events.reduce((max, event) => 
        event.year > max ? event.year : max, 1338);
    campaignData.currentYear = latestEvent;
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Set active nav button
    event.target.classList.add('active');
    
    // Refresh section content if needed
    if (sectionId === 'timeline') {
        renderTimeline();
        setTimeout(() => {
            if (!timelineCanvas) initInteractiveTimeline();
            else drawTimeline();
        }, 50);
    } else if (sectionId === 'wars') {
        renderWars();
    } else if (sectionId === 'nations') {
        renderNations();
    } else if (sectionId === 'glossary') {
        renderGlossary();
    } else if (sectionId === 'dashboard') {
        renderDashboard();
    }
}

// Dashboard Functions
function renderDashboard() {
    document.getElementById('totalEvents').textContent = campaignData.events.length;
    
    // Count unique wars
    const wars = new Set();
    campaignData.events.forEach(event => {
        if (event.war_name) wars.add(event.war_name);
    });
    document.getElementById('totalWars').textContent = wars.size;
    
    document.getElementById('totalNations').textContent = campaignData.nations.length;
    document.getElementById('currentYear').textContent = campaignData.currentYear;
    
    // Render recent events (last 5)
    const recentEvents = [...campaignData.events]
        .sort((a, b) => b.year - a.year)
        .slice(0, 5);
    
    const recentEventsList = document.getElementById('recentEventsList');
    recentEventsList.innerHTML = recentEvents.map(event => {
        const icon = getEventIcon(event.event_type);
        return `
        <div class="event-list-item">
            <div>
                <span style="font-size: 20px; margin-right: 8px;">${icon}</span>
                <strong>${event.name}</strong><br>
                <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                    📅 ${event.year} • ${event.nation} • ${event.event_type}
                </span>
            </div>
            <button class="btn btn-secondary" style="padding: var(--space-4) var(--space-12);" onclick="showEventDetail(${event.id})">
                View
            </button>
        </div>
    `}).join('');
}

// Interactive Timeline Canvas Functions
function initInteractiveTimeline() {
    timelineCanvas = document.getElementById('interactiveTimeline');
    if (!timelineCanvas) return;
    
    timelineCtx = timelineCanvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    timelineCanvas.addEventListener('mousedown', handleTimelineMouseDown);
    timelineCanvas.addEventListener('mousemove', handleTimelineMouseMove);
    timelineCanvas.addEventListener('mouseup', handleTimelineMouseUp);
    timelineCanvas.addEventListener('mouseleave', handleTimelineMouseUp);
    timelineCanvas.addEventListener('wheel', handleTimelineWheel, { passive: false });
    timelineCanvas.addEventListener('click', handleTimelineClick);
    
    // Draw initial timeline
    drawTimeline();
}

function resizeCanvas() {
    if (!timelineCanvas) return;
    const rect = timelineCanvas.parentElement.getBoundingClientRect();
    timelineCanvas.width = rect.width - 48;
    timelineCanvas.height = 400;
    drawTimeline();
}

function drawTimeline() {
    if (!timelineCtx) return;
    
    const canvas = timelineCanvas;
    const ctx = timelineCtx;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#252525');
    bgGradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw timeline axis
    const margin = 60;
    const timelineY = height / 2;
    const timelineWidth = width - margin * 2;
    
    // Main timeline line
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, timelineY);
    ctx.lineTo(width - margin, timelineY);
    ctx.stroke();
    
    // Draw year markers and labels
    const yearRange = timelineState.viewEnd - timelineState.viewStart;
    const yearStep = yearRange > 100 ? 50 : yearRange > 50 ? 25 : 10;
    
    ctx.font = '12px Georgia, serif';
    ctx.fillStyle = '#A0A0A0';
    ctx.textAlign = 'center';
    
    for (let year = Math.ceil(timelineState.viewStart / yearStep) * yearStep; year <= timelineState.viewEnd; year += yearStep) {
        const x = yearToX(year, margin, timelineWidth);
        
        // Tick mark
        ctx.strokeStyle = '#D4A574';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, timelineY - 10);
        ctx.lineTo(x, timelineY + 10);
        ctx.stroke();
        
        // Year label
        ctx.fillText(year.toString(), x, timelineY + 30);
    }
    
    // Draw connecting lines for wars
    const wars = getWarsData();
    wars.forEach(war => {
        if (war.startYear && war.endYear) {
            const startX = yearToX(war.startYear, margin, timelineWidth);
            const endX = yearToX(war.endYear, margin, timelineWidth);
            
            if (startX >= margin && endX <= width - margin) {
                ctx.strokeStyle = 'rgba(196, 30, 58, 0.3)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(startX, timelineY);
                ctx.lineTo(endX, timelineY);
                ctx.stroke();
            }
        }
    });
    
    // Draw event dots
    const filteredEvents = getFilteredEvents();
    
    filteredEvents.forEach(event => {
        const x = yearToX(event.year, margin, timelineWidth);
        if (x < margin || x > width - margin) return;
        
        const isHovered = timelineState.hoveredEvent && timelineState.hoveredEvent.id === event.id;
        const radius = isHovered ? 10 : getEventRadius(event);
        
        // Event dot with gradient
        const dotGradient = ctx.createRadialGradient(x, timelineY, 0, x, timelineY, radius);
        const baseColor = getEventColor(event);
        dotGradient.addColorStop(0, baseColor);
        dotGradient.addColorStop(0.7, baseColor);
        dotGradient.addColorStop(1, adjustColorBrightness(baseColor, -30));
        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(x, timelineY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect on hover
        if (isHovered) {
            ctx.strokeStyle = getEventColor(event);
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(x, timelineY, radius + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            // Draw tooltip
            drawTooltip(ctx, event, x, timelineY - 20);
        }
        
        // Border
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, timelineY, radius, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    // Draw decorative corners
    drawDecorativeCorners(ctx, width, height);
}

function drawTooltip(ctx, event, x, y) {
    const icon = getEventIcon(event.event_type);
    ctx.font = 'bold 13px Georgia, serif';
    const text = `${icon} ${event.year}: ${event.name}`;
    const metrics = ctx.measureText(text);
    const padding = 10;
    const tooltipWidth = metrics.width + padding * 2;
    const tooltipHeight = 28;
    
    // Position tooltip
    let tooltipX = x - tooltipWidth / 2;
    if (tooltipX < 10) tooltipX = 10;
    if (tooltipX + tooltipWidth > timelineCanvas.width - 10) tooltipX = timelineCanvas.width - tooltipWidth - 10;
    
    // Draw background with gradient
    const gradient = ctx.createLinearGradient(tooltipX, y - tooltipHeight, tooltipX, y);
    gradient.addColorStop(0, 'rgba(42, 42, 42, 0.98)');
    gradient.addColorStop(1, 'rgba(37, 37, 37, 0.98)');
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(tooltipX, y - tooltipHeight, tooltipWidth, tooltipHeight, 6);
    ctx.fill();
    ctx.stroke();
    
    // Add inner glow
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tooltipX + 1, y - tooltipHeight + 1, tooltipWidth - 2, tooltipHeight - 2, 5);
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = '#D4A574';
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.fillText(text, tooltipX + tooltipWidth / 2, y - 9);
}

function drawDecorativeCorners(ctx, width, height) {
    const cornerSize = 20;
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 2;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(10, 10 + cornerSize);
    ctx.lineTo(10, 10);
    ctx.lineTo(10 + cornerSize, 10);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - 10 - cornerSize, 10);
    ctx.lineTo(width - 10, 10);
    ctx.lineTo(width - 10, 10 + cornerSize);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(10, height - 10 - cornerSize);
    ctx.lineTo(10, height - 10);
    ctx.lineTo(10 + cornerSize, height - 10);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - 10 - cornerSize, height - 10);
    ctx.lineTo(width - 10, height - 10);
    ctx.lineTo(width - 10, height - 10 - cornerSize);
    ctx.stroke();
}

function yearToX(year, margin, timelineWidth) {
    const range = timelineState.viewEnd - timelineState.viewStart;
    const progress = (year - timelineState.viewStart) / range;
    return margin + progress * timelineWidth;
}

function xToYear(x, margin, timelineWidth) {
    const progress = (x - margin) / timelineWidth;
    const range = timelineState.viewEnd - timelineState.viewStart;
    return timelineState.viewStart + progress * range;
}

function getEventRadius(event) {
    if (event.event_type === 'War Start' || event.event_type === 'War End') return 8;
    if (event.event_type === 'Formation' || event.event_type === 'Crisis') return 7;
    return 6;
}

function getEventColor(event) {
    const colors = {
        'War Start': '#C41E3A',
        'War End': '#50C878',
        'Economic': '#FFD700',
        'Political': '#3B5998',
        'Formation': '#50C878',
        'Crisis': '#D35400',
        'Diplomatic': '#9B59B6',
        'Expansion': '#CD7F32',
        'Cultural': '#8B4789',
        'Religious': '#8B4789'
    };
    return colors[event.event_type] || '#3B5998';
}

function adjustColorBrightness(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function handleTimelineMouseDown(e) {
    timelineState.isDragging = true;
    timelineState.lastX = e.offsetX;
}

function handleTimelineMouseMove(e) {
    const margin = 60;
    const timelineWidth = timelineCanvas.width - margin * 2;
    
    // Check for hovered event
    const year = xToYear(e.offsetX, margin, timelineWidth);
    const threshold = 15;
    
    let foundHover = null;
    const filteredEvents = getFilteredEvents();
    
    for (const event of filteredEvents) {
        const x = yearToX(event.year, margin, timelineWidth);
        const distance = Math.abs(e.offsetX - x);
        
        if (distance < threshold) {
            foundHover = event;
            break;
        }
    }
    
    if (foundHover !== timelineState.hoveredEvent) {
        timelineState.hoveredEvent = foundHover;
        drawTimeline();
    }
    
    // Handle dragging
    if (timelineState.isDragging) {
        const deltaX = e.offsetX - timelineState.lastX;
        const range = timelineState.viewEnd - timelineState.viewStart;
        const yearDelta = -(deltaX / timelineWidth) * range;
        
        timelineState.viewStart += yearDelta;
        timelineState.viewEnd += yearDelta;
        
        // Clamp to bounds
        if (timelineState.viewStart < timelineState.startYear) {
            timelineState.viewEnd += timelineState.startYear - timelineState.viewStart;
            timelineState.viewStart = timelineState.startYear;
        }
        if (timelineState.viewEnd > timelineState.endYear) {
            timelineState.viewStart -= timelineState.viewEnd - timelineState.endYear;
            timelineState.viewEnd = timelineState.endYear;
        }
        
        timelineState.lastX = e.offsetX;
        drawTimeline();
    }
}

function handleTimelineMouseUp(e) {
    timelineState.isDragging = false;
}

function handleTimelineWheel(e) {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const range = timelineState.viewEnd - timelineState.viewStart;
    const newRange = range * zoomFactor;
    
    // Clamp range
    if (newRange < 10 || newRange > 500) return;
    
    const center = (timelineState.viewStart + timelineState.viewEnd) / 2;
    timelineState.viewStart = center - newRange / 2;
    timelineState.viewEnd = center + newRange / 2;
    
    // Clamp to bounds
    if (timelineState.viewStart < timelineState.startYear) {
        timelineState.viewEnd += timelineState.startYear - timelineState.viewStart;
        timelineState.viewStart = timelineState.startYear;
    }
    if (timelineState.viewEnd > timelineState.endYear) {
        timelineState.viewStart -= timelineState.viewEnd - timelineState.endYear;
        timelineState.viewEnd = timelineState.endYear;
    }
    
    drawTimeline();
}

function handleTimelineClick(e) {
    if (timelineState.hoveredEvent) {
        showEventDetail(timelineState.hoveredEvent.id);
    }
}

function resetTimelineZoom() {
    timelineState.viewStart = timelineState.startYear;
    timelineState.viewEnd = timelineState.endYear;
    drawTimeline();
}

function zoomToCentury(century) {
    const startYear = century * 100;
    const endYear = startYear + 100;
    
    timelineState.viewStart = Math.max(startYear, timelineState.startYear);
    timelineState.viewEnd = Math.min(endYear, timelineState.endYear);
    
    drawTimeline();
}

// Timeline Functions
function renderTimeline() {
    const filteredEvents = getFilteredEvents();
    const timelineEvents = document.getElementById('timelineEvents');
    
    if (filteredEvents.length === 0) {
        timelineEvents.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No events match your filters.</p>';
        return;
    }
    
    const sortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year);
    
    timelineEvents.innerHTML = sortedEvents.map(event => {
        const nationBadge = getNationBadgeClass(event.nation);
        const typeBadge = getTypeBadgeClass(event.event_type);
        const icon = getEventIcon(event.event_type);
        
        return `
            <div class="timeline-event" onclick="showEventDetail(${event.id})">
                <div class="timeline-event-header">
                    <span class="timeline-event-date">📅 ${event.year}</span>
                    <div class="event-badges">
                        <span class="badge ${nationBadge}">${event.nation}</span>
                        <span class="badge ${typeBadge}">${icon} ${event.event_type}</span>
                    </div>
                </div>
                <h3 class="timeline-event-name">${event.name}</h3>
                <p class="timeline-event-description">${truncateText(event.description, 150)}</p>
                ${event.war_name ? `<div style="margin-top: var(--space-8);"><span class="badge badge-war">⚔️ ${event.war_name}</span></div>` : ''}
            </div>
        `;
    }).join('');
}

function getFilteredEvents() {
    const nationFilter = document.getElementById('filterNation').value;
    const typeFilter = document.getElementById('filterType').value;
    const searchTerm = document.getElementById('searchTimeline').value.toLowerCase();
    
    return campaignData.events.filter(event => {
        const matchesNation = nationFilter === 'all' || event.nation.includes(nationFilter);
        const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
        const matchesSearch = searchTerm === '' || 
            event.name.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            (event.war_name && event.war_name.toLowerCase().includes(searchTerm));
        
        return matchesNation && matchesType && matchesSearch;
    });
}

function filterTimeline() {
    renderTimeline();
    drawTimeline();
}

// Wars Functions
function renderWars() {
    const wars = getWarsData();
    const warsGrid = document.getElementById('warsGrid');
    
    if (wars.length === 0) {
        warsGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1/-1;">No wars recorded yet.</p>';
        return;
    }
    
    warsGrid.innerHTML = wars.map(war => {
        const duration = war.endYear ? `${war.startYear} - ${war.endYear}` : `${war.startYear} - Ongoing`;
        const statusClass = war.endYear ? 'completed' : 'ongoing';
        const statusText = war.endYear ? '🏆 Completed' : '⚔️ Ongoing';
        const yearCount = war.endYear ? war.endYear - war.startYear : 'Ongoing';
        
        return `
            <div class="war-card">
                <div class="war-card-header">
                    <h3 class="war-name">⚔️ ${war.name}</h3>
                    <div class="war-dates">📅 ${duration}</div>
                    ${war.endYear ? `<div class="war-dates">⏱️ Duration: ${war.endYear - war.startYear} years</div>` : ''}
                    <span class="war-status ${statusClass}">${statusText}</span>
                </div>
                <div class="war-events">
                    ${war.events.map(event => {
                        const icon = getEventIcon(event.event_type);
                        return `
                        <div class="war-event-item">
                            ${icon} <strong>${event.year}</strong> - ${event.name}<br>
                            <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs);">
                                ${truncateText(event.description, 100)}
                            </span>
                        </div>
                    `}).join('')}
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

// Nations Functions
function renderNations() {
    const nationsGrid = document.getElementById('nationsGrid');
    
    nationsGrid.innerHTML = campaignData.nations.map(nation => {
        const nationEvents = campaignData.events
            .filter(e => e.nation.includes(nation.name.split('/')[0]))
            .sort((a, b) => b.year - a.year)
            .slice(0, 5);
        
        return `
            <div class="nation-card" style="border-left: 4px solid ${nation.color};">
                <div class="nation-header">
                    <div class="nation-flag" style="background-color: ${nation.color};"></div>
                    <div class="nation-info">
                        <h3>🏰 ${nation.name}</h3>
                        <p class="nation-player">👤 Player: ${nation.player}</p>
                    </div>
                </div>
                
                <div class="nation-section">
                    <h4>🌍 Primary Culture</h4>
                    <p>${nation.culture}</p>
                </div>
                
                <div class="nation-section">
                    <h4>🎯 National Goals</h4>
                    <p>${nation.goals}</p>
                </div>
                
                <div class="nation-section">
                    <h4>📜 Recent Events</h4>
                    <ul>
                        ${nationEvents.map(e => {
                            const icon = getEventIcon(e.event_type);
                            return `<li>${icon} ${e.year}: ${e.name}</li>`;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
}

// Glossary Functions
function renderGlossary() {
    renderGlossaryCategories();
    renderGlossaryList();
}

function renderGlossaryCategories() {
    const categories = ['All', ...new Set(campaignData.mechanics.map(m => m.category))];
    const categoriesContainer = document.getElementById('glossaryCategories');
    
    categoriesContainer.innerHTML = categories.map((cat, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `<button class="category-btn ${activeClass}" onclick="filterGlossaryByCategory('${cat}')">${cat}</button>`;
    }).join('');
}

function renderGlossaryList(filteredMechanics = null) {
    const mechanics = filteredMechanics || campaignData.mechanics;
    const glossaryList = document.getElementById('glossaryList');
    
    if (mechanics.length === 0) {
        glossaryList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No mechanics found.</p>';
        return;
    }
    
    const categoryIcons = {
        'Core System': '⚙️',
        'Governance': '🏛️',
        'Economy': '💰',
        'Military': '⚔️',
        'Diplomacy': '🤝',
        'Internal Politics': '🗃️'
    };
    
    glossaryList.innerHTML = mechanics.map(mechanic => {
        const icon = categoryIcons[mechanic.category] || '📚';
        return `
        <div class="glossary-item">
            <h3 class="glossary-term">${icon} ${mechanic.term}</h3>
            <span class="glossary-category">${mechanic.category}</span>
            <p class="glossary-definition">${mechanic.definition}</p>
        </div>
    `}).join('');
}

function filterGlossary() {
    const searchTerm = document.getElementById('glossarySearch').value.toLowerCase();
    const filtered = campaignData.mechanics.filter(m => 
        m.term.toLowerCase().includes(searchTerm) ||
        m.definition.toLowerCase().includes(searchTerm)
    );
    renderGlossaryList(filtered);
}

function filterGlossaryByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const filtered = category === 'All' 
        ? campaignData.mechanics 
        : campaignData.mechanics.filter(m => m.category === category);
    
    renderGlossaryList(filtered);
}

// Export Functions
function generateChronicle() {
    const exportPreview = document.getElementById('exportPreview');
    const wars = getWarsData();
    
    let chronicleHTML = `
        <h1>EU5 Campaign Chronicle</h1>
        <h2>Rise of Three Nations</h2>
        <p><strong>Campaign Period:</strong> ${campaignData.startDate} - ${campaignData.currentYear}</p>
        <p><strong>Players:</strong> ${campaignData.nations.map(n => `${n.player} (${n.name})`).join(', ')}</p>
        
        <h2>Campaign Overview</h2>
        <p>This chronicle documents the epic journey of three player nations in Europa Universalis 5, beginning in ${campaignData.startDate}. 
        Through ${campaignData.events.length} recorded events and ${wars.length} major wars, the campaign has unfolded into a rich tapestry of conquest, 
        diplomacy, economic struggle, and triumph.</p>
        
        <h2>The Nations</h2>
    `;
    
    campaignData.nations.forEach(nation => {
        chronicleHTML += `
            <h3>${nation.name}</h3>
            <p><strong>Played by:</strong> ${nation.player}</p>
            <p><strong>Primary Culture:</strong> ${nation.culture}</p>
            <p><strong>Goals:</strong> ${nation.goals}</p>
        `;
    });
    
    chronicleHTML += '<h2>Complete Timeline of Events</h2>';
    
    const sortedEvents = [...campaignData.events].sort((a, b) => a.year - b.year);
    
    sortedEvents.forEach(event => {
        chronicleHTML += `
            <h3>${event.year} - ${event.name}</h3>
            <p><strong>Nation:</strong> ${event.nation} | <strong>Type:</strong> ${event.event_type}</p>
            ${event.war_name ? `<p><strong>War:</strong> ${event.war_name}</p>` : ''}
            <p>${event.description}</p>
            ${event.participants && event.participants.length > 0 ? `<p><strong>Participants:</strong> ${event.participants.join(', ')}</p>` : ''}
        `;
    });
    
    if (wars.length > 0) {
        chronicleHTML += '<h2>Wars Summary</h2>';
        
        wars.forEach(war => {
            const duration = war.endYear ? `${war.startYear} - ${war.endYear}` : `${war.startYear} - Ongoing`;
            const status = war.endYear ? 'Completed' : 'Ongoing';
            
            chronicleHTML += `
                <h3>${war.name}</h3>
                <p><strong>Duration:</strong> ${duration} (${status})</p>
                <p><strong>Events:</strong></p>
                <ul>
                    ${war.events.map(e => `<li><strong>${e.year}</strong> - ${e.name}: ${e.description}</li>`).join('')}
                </ul>
            `;
        });
    }
    
    exportPreview.innerHTML = chronicleHTML;
}

function copyChronicle() {
    const exportPreview = document.getElementById('exportPreview');
    const text = exportPreview.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Chronicle copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function downloadChronicle() {
    const exportPreview = document.getElementById('exportPreview');
    const text = exportPreview.innerText;
    
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

// Modal Functions
function openAddEventModal() {
    document.getElementById('addEventModal').classList.add('active');
    currentParticipants = [];
    renderParticipants();
}

function openAddMechanicModal() {
    document.getElementById('addMechanicModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'addEventModal') {
        document.getElementById('addEventForm').reset();
        currentParticipants = [];
        renderParticipants();
    } else if (modalId === 'addMechanicModal') {
        document.getElementById('addMechanicForm').reset();
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

function updateWarsList() {
    const wars = getWarsData();
    const existingWars = document.getElementById('existingWars');
    existingWars.innerHTML = wars.map(war => `<option value="${war.name}">`).join('');
}

// Participant Management
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
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = currentParticipants.map((p, index) => `
        <span class="participant-tag">
            ${p}
            <button type="button" onclick="removeParticipant(${index})">&times;</button>
        </span>
    `).join('');
}

// Add Event
function addEvent(event) {
    event.preventDefault();
    
    const newEvent = {
        id: campaignData.events.length + 1,
        year: parseInt(document.getElementById('eventYear').value),
        date: document.getElementById('eventYear').value,
        nation: document.getElementById('eventNation').value,
        event_type: document.getElementById('eventType').value,
        name: document.getElementById('eventName').value,
        description: document.getElementById('eventDescription').value,
        participants: [...currentParticipants]
    };
    
    const warName = document.getElementById('warName').value;
    if (warName) {
        newEvent.war_name = warName;
    }
    
    campaignData.events.push(newEvent);
    
    // Update current year if needed
    if (newEvent.year > campaignData.currentYear) {
        campaignData.currentYear = newEvent.year;
    }
    
    closeModal('addEventModal');
    updateWarsList();
    renderDashboard();
    renderTimeline();
    renderWars();
    
    alert('Event added successfully!');
}

function addEventAndContinue() {
    const form = document.getElementById('addEventForm');
    
    if (form.checkValidity()) {
        const newEvent = {
            id: campaignData.events.length + 1,
            year: parseInt(document.getElementById('eventYear').value),
            date: document.getElementById('eventYear').value,
            nation: document.getElementById('eventNation').value,
            event_type: document.getElementById('eventType').value,
            name: document.getElementById('eventName').value,
            description: document.getElementById('eventDescription').value,
            participants: [...currentParticipants]
        };
        
        const warName = document.getElementById('warName').value;
        if (warName) {
            newEvent.war_name = warName;
        }
        
        campaignData.events.push(newEvent);
        
        if (newEvent.year > campaignData.currentYear) {
            campaignData.currentYear = newEvent.year;
        }
        
        // Clear form but keep modal open
        document.getElementById('addEventForm').reset();
        currentParticipants = [];
        renderParticipants();
        updateWarsList();
        renderDashboard();
        renderTimeline();
        renderWars();
        drawTimeline();
        
        alert('Event added! Add another event.');
    } else {
        form.reportValidity();
    }
}

// Add Mechanic
function addMechanic(event) {
    event.preventDefault();
    
    const newMechanic = {
        term: document.getElementById('mechanicTerm').value,
        category: document.getElementById('mechanicCategory').value,
        definition: document.getElementById('mechanicDefinition').value
    };
    
    campaignData.mechanics.push(newMechanic);
    
    closeModal('addMechanicModal');
    renderGlossary();
    
    alert('Mechanic added successfully!');
}

// Event Detail Modal
function showEventDetail(eventId) {
    const event = campaignData.events.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventDetailModal');
    const titleEl = document.getElementById('detailEventName');
    const contentEl = document.getElementById('eventDetailContent');
    
    titleEl.textContent = event.name;
    
    const icon = getEventIcon(event.event_type);
    contentEl.innerHTML = `
        <div style="margin-bottom: var(--space-16);">
            <p><strong>📅 Date:</strong> ${event.year}</p>
            <p><strong>🎯 Nation:</strong> ${event.nation}</p>
            <p><strong>📊 Event Type:</strong> ${icon} ${event.event_type}</p>
            ${event.war_name ? `<p><strong>⚔️ War:</strong> ${event.war_name}</p>` : ''}
        </div>
        <div style="margin-bottom: var(--space-16);">
            <h4 style="margin-bottom: var(--space-8);">Description</h4>
            <p>${event.description}</p>
        </div>
        ${event.participants && event.participants.length > 0 ? `
            <div>
                <h4 style="margin-bottom: var(--space-8);">Participants</h4>
                <p>👥 ${event.participants.join(', ')}</p>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

// Event type icons (Unicode emoji and symbols)
function getEventIcon(eventType) {
    const icons = {
        'War Start': '⚔️',
        'War End': '🏆',
        'Economic': '💰',
        'Political': '🏛️',
        'Formation': '✨',
        'Crisis': '🔴',
        'Diplomatic': '🤝',
        'Expansion': '📍',
        'Cultural': '🎭',
        'Religious': '✝️',
        'Technological': '🔬'
    };
    return icons[eventType] || '📋';
}

// Utility Functions
function getNationBadgeClass(nation) {
    if (nation.includes('Holland') || nation.includes('Netherlands')) return 'badge-holland';
    if (nation.includes('Castile')) return 'badge-castile';
    if (nation.includes('Mali')) return 'badge-mali';
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

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', initApp);

// Allow enter key to add participants
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
// localSave.js
// Generic persistent save/load for ANY JS app using a simple object

function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocal(key, fallback = null) {
    const raw = localStorage.getItem(key);
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Failed to parse saved data for key', key, e);
        }
    }
    return fallback;
}
// Example use:
// saveToLocal('eu5Campaign', campaignData);
// let loaded = loadFromLocal('eu5Campaign');
