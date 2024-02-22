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
  {
    fileName: 'venue_categories',
    name: 'Room Categories',
    api: 'venue-categories',
    columns: [
      { name: 'Name', field: 'name', required: true, type: 'string' },
      { name: 'Description', field: 'description', type: 'string' },
      /* {
        name: 'Display in room name',
        field: 'display_in_venue_name',
        type: 'string',
        default: RoomSuffixPosition.None,
        choices: [
          { name: RoomSuffixPosition.None, label: 'Do not show' },
          { name: RoomSuffixPosition.Prefix, label: 'As prefix' },
          { name: RoomSuffixPosition.Suffix, label: 'As suffix' },
        ],
      }, */
      {
        name: 'Display in public tooltip',
        field: 'display_in_public_tooltip',
        type: 'boolean',
        default: false,
      },
      {
        name: 'Rooms',
        field: 'rooms',
        type: 'string',
        transform: (data, tournament) =>
          data.split(';').map((d) => tournament.venues[d.trim()]),
        default: '',
      },
    ],
    identifier: 'name',
  },
  {
    fileName: 'venues',
    name: 'Rooms',
    api: 'venues',
    columns: [
      { name: 'Name', field: 'name', required: true, type: 'string' },
      { name: 'Priority', field: 'priority', required: true, type: 'number' },
      { name: 'External URL', field: 'external_url', type: 'string' },
      {
        name: 'Categories',
        field: 'categories',
        type: 'string',
        transform: (data, tournament) =>
          data.split(';').map((d) => tournament['venue-categories'][d.trim()]),
        default: '',
      },
    ],
    identifier: 'name',
  },
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
