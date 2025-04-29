import { getLiveMatches, formatMatchTime } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const matchesContainer = document.getElementById('matches-container');
    const leagueSelect = document.getElementById('league-select');
    const refreshBtn = document.getElementById('refresh-btn');
    const lastUpdateEl = document.getElementById('last-update');

    let currentLeague = 'all';

    // Cargar partidos iniciales
    await loadMatches(currentLeague);

    // Evento para cambiar de liga
    leagueSelect.addEventListener('change', async (e) => {
        currentLeague = e.target.value;
        await loadMatches(currentLeague);
    });

    // Evento para actualizar
    refreshBtn.addEventListener('click', async () => {
        await loadMatches(currentLeague);
    });

    // Función para cargar y mostrar partidos
    async function loadMatches(league) {
        try {
            // Mostrar loading
            matchesContainer.innerHTML = '';
            document.getElementById('loading').style.display = 'block';

            // Obtener partidos
            const matches = await getLiveMatches(league);

            // Ocultar loading
            document.getElementById('loading').style.display = 'none';

            // Mostrar partidos
            if (matches.length === 0) {
                matchesContainer.innerHTML = '<p class="no-matches">No hay partidos en vivo en este momento.</p>';
            } else {
                matches.forEach(match => {
                    matchesContainer.appendChild(createMatchCard(match));
                });
            }

            // Actualizar última actualización
            lastUpdateEl.textContent = `Última actualización: ${new Date().toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error al cargar partidos:', error);
            matchesContainer.innerHTML = '<p class="error">Error al cargar los partidos. Intenta nuevamente.</p>';
            document.getElementById('loading').style.display = 'none';
        }
    }

    // Función para crear tarjeta de partido
    function createMatchCard(match) {
        const card = document.createElement('div');
        card.className = 'match-card';

        const competitionName = match.competition?.name || 'Partido';
        const matchday = match.matchday ? ` - Jornada ${match.matchday}` : '';

        card.innerHTML = `
            <div class="match-header">
                <span>${competitionName}${matchday}</span>
                <span class="match-time">${formatMatchTime(match.utcDate)}</span>
            </div>
            <div class="teams">
                <div class="team">
                    <img src="${match.homeTeam.crest || 'https://via.placeholder.com/40'}" alt="${match.homeTeam.name}">
                    <span>${match.homeTeam.shortName || match.homeTeam.name}</span>
                </div>
                <div class="score">
                    ${match.score.fullTime.home ?? '-'} - ${match.score.fullTime.away ?? '-'}
                </div>
                <div class="team">
                    <img src="${match.awayTeam.crest || 'https://via.placeholder.com/40'}" alt="${match.awayTeam.name}">
                    <span>${match.awayTeam.shortName || match.awayTeam.name}</span>
                </div>
            </div>
            <div class="match-status">
                ${match.status === 'IN_PLAY' ? '<span class="live-badge">EN VIVO</span>' : 'MEDIO TIEMPO'}
                ${match.minute ? ` - Min ${match.minute}` : ''}
            </div>
        `;

        return card;
    }

    // Actualizar cada minuto
    setInterval(async () => {
        await loadMatches(currentLeague);
    }, 60000);
});