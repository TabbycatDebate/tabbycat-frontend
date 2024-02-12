export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string,
) =>
  array.reduce(
    (acc, value, index, array) => {
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    },
    {} as { [key: string]: T[] },
  );

export const csvFileNames = [
  { fileName: 'venue_categories', name: 'Room Categories' },
  { fileName: 'venues', name: 'Rooms' },
  { fileName: 'institutions', name: 'Institutions' },
  { fileName: 'break_categories', name: 'Break Categories' },
  { fileName: 'speaker_categories', name: 'Speaker Categories' },
  { fileName: 'teams', name: 'Teams' },
  { fileName: 'speakers', name: 'Speakers' },
  { fileName: 'adjudicators', name: 'Adjudicators' },
  { fileName: 'scores', name: 'Adjudicator Scores' },
  { fileName: 'rounds', name: 'Rounds' },
  { fileName: 'motions', name: 'Motions' },
  { fileName: 'sides', name: 'Sides' },
  { fileName: 'adj_feedback_questions', name: 'Feedback Questions' },
  { fileName: 'adj_venue_constraints', name: 'Adjudicator Room Constraints' },
  { fileName: 'team_venue_constraints', name: 'Team Room Constraints' },
  { fileName: 'team_conflicts', name: 'Team-Adjudicator Conflicts' },
  {
    fileName: 'institution_conflicts',
    name: 'Adjudicator-Institution Conflicts',
  },
  {
    fileName: 'adjudicator_conflicts',
    name: 'Adjudicator-Adjudicator Conflicts',
  },
  {
    fileName: 'team_institution_conflicts',
    name: 'Team-Institution Conflicts',
  },
];

export const csvNameMapping = Object.fromEntries(
  csvFileNames.map(({ fileName, name }) => [fileName, name]),
);
