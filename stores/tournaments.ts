import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios';
import { defineStore } from 'pinia';

const client = applyCaseMiddleware(axios.create());

interface TCAPIResponse {
  readonly id: number;
  readonly url: URL;
}

interface Institution extends TCAPIResponse {
  name: string;
  code: string;
  region: string;
}

enum BreakRule {
  Standard = 'standard',
  AIDA1996 = 'aida-1996',
  AIDA2016Easters = 'aida-2016-easters',
  AIDA2016Australs = 'aida-2016-australs',
  AIDA2019AustralsOpen = 'aida-2019-australs-open',
}

interface BreakCategory extends TCAPIResponse {
  name: string;
  slug: string;
  seq: number;
  breakSize: number;
  isGeneral: boolean;
  priority: number;
  limit: number;
  rule: BreakRule;
}

interface SpeakerCategory extends TCAPIResponse {
  name: string;
  slug: string;
  seq: number;
  limit: number;
  public: boolean;
}

interface Preference {
  readonly section: string;
  readonly name: string;
  readonly identifier: string;
  readonly default: string;
  value: string;
  readonly verboseName: string;
  readonly helpText: string;
  readonly additionalData: string;
  readonly field: string;
}

enum Gender {
  Undisclosed = null,
  Male = 'M',
  Female = 'F',
  Other = 'O',
}

interface Person extends TCAPIResponse {
  name: string;
  gender: Gender;
  email?: string;
  phone: string;
  anonymous: boolean;
  pronoun: string;
  urlKey?: string;
}

interface Speaker extends Person {
  categories: URL[];
}

interface Adjudicator extends Person {
  institution: string;
  baseScore: number;
  breaking: boolean;
  trainee: boolean;
  independent: boolean;
  adjCore: boolean;
  institutionConflicts: URL[];
  teamConflicts: URL[];
  adjudicatorConflicts: URL[];
}

interface Team extends TCAPIResponse {
  reference: string;
  shortReference: string;
  codeName: string;
  emoji: string;
  shortName: string;
  longName: string;
  institution?: URL;
  speakers: Speaker[];
  useInstitutionPrefix: boolean;
  breakCategories: URL[];
  institutionConflicts: URL[];
}

enum RoundStage {
  Preliminary = 'P',
  Elimination = 'E',
}

enum DrawType {
  Random = 'R',
  Manual = 'M',
  RoundRobin = 'D',
  PowerPaired = 'P',
  Elimination = 'E',
  Seeded = 'S',
}

enum DrawStatus {
  None = 'N',
  Draft = 'D',
  Confirmed = 'C',
  Released = 'R',
}

interface Motion extends TCAPIResponse {
  seq: number;
  text: string;
  reference: string;
  infoSlide: string;
}

interface Room extends TCAPIResponse {
  categories: URL[];
  readonly displayName: string;
  externalUrl: URL;
  name: string;
  priority: number;
}

enum RoomSuffixPosition {
  Prefix = 'P',
  None = '-',
  Suffix = 'S',
}

interface RoomCategory extends TCAPIResponse {
  venues: URL[];
  name: string;
  description: string;
  displayInVenueName: RoomSuffixPosition;
  displayInPublicTooltip: boolean;
}

interface Round extends TCAPIResponse {
  breakCategory: string;
  motions: Motion[];
  seq: number;
  completed: boolean;
  name: string;
  abbreviation: string;
  stage: RoundStage;
  drawType: DrawType;
  drawStatus: DrawStatus;
  feedbackWeight: number;
  silent: boolean;
  motionsReleased: boolean;
  startsAt: string;
  weight: number;
}

interface Tournament extends TCAPIResponse {
  currentRounds: URL[];
  name: string;
  shortName: string;
  slug: string;
  seq: number;
  active: boolean;
  rounds?: Round[];
  adjudicators?: Adjudicator[];
  teams?: Team[];
  breakCategories?: BreakCategory[];
  speakerCategories?: SpeakerCategory[];
  preferences?: Preference[];
  rooms: Room[];
  roomCategories: RoomCategory[];
}

export const useTournamentsStore = defineStore({
  id: 'tournaments-store',
  state: () => {
    return {
      _tournaments: [],
      _currentTournament: {},
      _institutions: [],
      _loading: {
        tournaments: null,
        rounds: null,
        institutions: null,
        breakCategories: null,
        preferences: null,
        adjudicators: null,
        speakerCategories: null,
      },
    };
  },
  actions: {
    async getTournaments() {
      this._loading.tournaments = true;
      this._loading.rounds = null;
      this._loading.breakCategories = null;
      this._loading.preferences = null;
      this._loading.adjudicators = null;
      this._loading.speakerCategories = null;

      /* const response = await client.get<Tournament[]>(
        'http://localhost:8000/api/v1/tournaments',
      );
      this.setTournaments(response.data); */
      this._loading.tournaments = false;
    },
    setTournaments(tournaments: Tournament[]) {
      this._tournaments = [...tournaments];
    },
    setCurrentTournament(slug: string) {
      this._currentTournament = this._tournaments.find((t) => t.slug === slug);
    },
    async getRoundsForCurrentTournament() {
      this._loading.rounds = true;
      /* const response = await client.get<Round[]>(
        this._currentTournament.links.rounds,
      );
      this._currentTournament.rounds = response?.data; */
      this._loading.rounds = false;
    },
    async getInstitutions() {
      this._loading.institutions = true;
      /* const response = await client.get<Institution[]>(
        'http://localhost:8000/api/v1/institutions',
        {
          headers: {
            Authorization: 'Token b6fba1387e1520e6b41f8b1241e9a0ea96091d8e',
          },
        },
      );
      this.setInstitutions(response.data); */
      this._loading.institutions = false;
    },
    setInstitutions(institutions: Institution[]) {
      this._institutions = [...institutions];
    },
    async getBreakCategories() {
      this._loading.breakCategories = true;
      /* const response = await client.get<BreakCategory[]>(
        this._currentTournament.links.breakCategories,
      );
      this._currentTournament.breakCategories = response?.data; */
      this._loading.breakCategories = false;
    },
    async getSpeakerCategories() {
      this._loading.speakerCategories = true;
      /* const response = await client.get<SpeakerCategory[]>(
        this._currentTournament.links.speakerCategories,
      );
      this._currentTournament.speakerCategories = response?.data; */
      this._loading.speakerCategories = false;
    },
    async getPreferences() {
      this._loading.preferences = true;
      /* const response = await client.get<Preference[]>(
        this._currentTournament.links.preferences,
      );
      this._currentTournament.preferences = response?.data; */
      this._loading.preferences = false;
    },
    async getAdjudicators() {
      this._loading.adjudicators = true;
      /* const response = await client.get<Adjudicator[]>(
        this._currentTournament.links.adjudicators,
      );
      this._currentTournament.adjudicators = response?.data; */
      this._loading.adjudicators = false;
    },
    addAdjudicator(adjudicator: Adjudicator) {
      /* const response = await client.post(
        this._currentTournament.links.adjudicators,
        adjudicator,
      );
      if (response.status === 201) {
        this._currentTournament.adjudicators.push(response.data);
      } */
    },
    async getTeams() {
      this._loading.teams = true;
      /* const response = await client.get<Team[]>(
        this._currentTournament.links.teams,
      );
      this._currentTournament.teams = response?.data; */
      this._loading.teams = false;
    },
    addTeam(team: Team) {
      /* const response = await client.post(
        this._currentTournament.links.teams,
        team,
      );
      if (response.status === 201) {
        this._currentTournament.teams.push(response.data);
      } */
    },
    addInstitution(institution: Institution) {
      /* const response = await client.post(
        'http://localhost:8000/api/v1/institutions',
        institution,
      );
      if (response.status === 201) {
        this.institutions.push(response.data);
      } */
    },
    async getRooms() {
      this._loading.rooms = true;
      this._loading.rooms = false;
    },
    async getRoomCategories() {
      this._loading.roomCategories = true;
      this._loading.roomCategories = false;
    },
    addRoom(room: Room) {
      //
    },
    addRoomCategory(roomCategory: RoomCategory) {
      //
    },
    async toggleAvailable(item: Room, round: Round) {
      await client.patch(round.url + '/availabilities', item.url);
    },
    createTournament(tournament: Tournament) {
      //
    },
    async getFeedbackQuestions() {
      this._loading.feedbackQuestions = true;
      this._loading.feedbackQuestions = false;
    },
    addFeedback(feedback) {
      //
    },
  },
  getters: {
    tournaments: (state) => state._tournaments,
    currentTournament: (state) => state._currentTournament,
    institutions: (state) => state._institutions,
    loading: (state) => state._loading,
  },
});
