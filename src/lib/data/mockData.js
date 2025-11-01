// Dati fittizi per il tuo calcetto
export const liveMatches = [
  {
    id: 1,
    league: "Serie A Calcetto",
    score: "3:2",
    quarter: "2° Tempo",
    teams: {
      home: { name: "SCARPARI FC", logo: "🔴" },
      away: { name: "DRAGHI FC", logo: "🔵" }
    },
    players: [
      { name: "Marco Rossi", stats: "2 Gol" },
      { name: "Luca Bianchi", stats: "1 Assist" }
    ]
  }
];

export const upcomingMatches = [
  {
    id: 2,
    league: "Torneio Amatoriale",
    time: "20:30",
    date: "Oggi",
    homeTeam: "SCARPARI FC",
    awayTeam: "LEONI FC"
  },
  {
    id: 3, 
    league: "Campionetto",
    time: "21:15",
    date: "Domani",
    homeTeam: "SCARPARI FC",
    awayTeam: "AQUILE FC"
  }
];

export const teamStats = [
  { title: "Partite Giocate", value: "12", trend: "+2" },
  { title: "Vittorie", value: "8", trend: "+3" },
  { title: "Gol Fatti", value: "24", trend: "+5" },
  { title: "Clean Sheets", value: "4", trend: "+1" }
];
