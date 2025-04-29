// Configuración de la API
const API_KEY = '8b1f2c86b7dc4ae0ab64de792726f227'; // Regístrate en football-data.org para obtener una key
const BASE_URL = 'https://api.football-data.org/v4';

// Función para obtener partidos en vivo
export async function getLiveMatches(league = 'all') {
    try {
        let url = `${BASE_URL}/matches`;

        // Si no es "all", filtrar por competición
        if (league !== 'all') {
            url += `?competitions=${league}`;
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.matches.filter(match => match.status === 'IN_PLAY' || match.status === 'PAUSED');
    } catch (error) {
        console.error('Error al obtener partidos en vivo:', error);
        return [];
    }
}

// Función para formatear la fecha
export function formatMatchTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}




