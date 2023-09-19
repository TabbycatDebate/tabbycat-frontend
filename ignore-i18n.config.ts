export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome',
      nav: {
        overview: 'Overview',
        newTournament: 'New tournament',
      },
      feedback: {
        name: 'Feedback',
        longName: 'Adjudicator Feedback',
      },
      settings: {
        name: 'Settings',
      },
      participants: {
        name: 'Participant | Participants',
        team: 'Team | Teams',
        adjudicator: 'Adjudicator | Adjudicators',
        institution: 'Institution | Institutions',
      },
      rooms: {
        name: 'Rooms',
      },
      checkins: {
        name: 'Checkins',
      },
      standings: {
        name: 'Standings',
      },
      breakQual: {
        name: 'Breaks',
      },
    },
    fr: {
      welcome: 'Bienvenue',
      nav: {
        overview: "Vue d'ensemble",
        newTournament: 'Nouveau tournoi',
      },
      feedback: {
        name: 'Évaluations',
        longName: 'Évaluations de juge',
      },
      settings: {
        name: 'Réglages',
      },
      participants: {
        name: 'Participant | Participants',
        team: 'Équipe | Équipes',
        adjudicator: 'Juge | Juges',
        institution: 'Institution | Institutions',
      },
      rooms: {
        name: 'Salles',
      },
      checkins: {
        name: 'Enregistrements',
      },
      standings: {
        name: 'Classements',
      },
      breakQual: {
        name: 'Qualifications',
      },
    },
  },
}));
