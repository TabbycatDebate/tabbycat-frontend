import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios';
import { defineStore } from 'pinia';

const client = applyCaseMiddleware(axios.create());
const baseUrl = import.meta.env.VITE_TABBYCAT_URL;
const token = import.meta.env.VITE_TABBYCAT_KEY;
client.defaults.headers.common.Authorization = `Token ${token}`;

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

enum AnswerType {
  BOOLEAN_CHECKBOX = 'bc',
  BOOLEAN_SELECT = 'bs',
  INTEGER_TEXTBOX = 'i',
  INTEGER_SCALE = 'is',
  FLOAT = 'f',
  TEXT = 't',
  LONGTEXT = 'tl',
  SINGLE_SELECT = 'ss',
  MULTIPLE_SELECT = 'ms',
}

enum SubmitterType {
  TABROOM = 'T',
  PUBLIC = 'P',
}

interface FeedbackQuestion extends TCAPIResponse {
  choices: string[];
  seq: number;
  text: string;
  name: string;
  reference: string;
  from_adj: boolean;
  from_team: boolean;
  answer_type: AnswerType;
  required: boolean;
  min_value: string;
  max_value: string;
}

interface FeedbackAnswer {
  question: URL;
  answer: Any;
}

interface Feedback extends TCAPIResponse {
  adjudicator: string;
  source: string;
  debate: string;
  answers: FeedbackAnswer[];
  timestamp: Date;
  version: number;
  submitter_type: SubmitterType;
  confirmed: boolean;
  confirm_timestamp: Date;
  ip_address: string;
  score: number;
  ignored: boolean;
  participant_submitter: URL;
  private_url: boolean;
  submitter: number;
  confirmer: number;
}

export const useTournamentsStore = defineStore({
  id: 'tournaments-store',
  state: () => ({
    _tournaments: [],
    _currentTournament: null,
    _institutions: [],
    _loading: {
      tournaments: null,
      rounds: null,
      institutions: null,
      breakCategories: null,
      preferences: null,
      adjudicators: null,
      speakerCategories: null,
      feedbackQuestions: null,
      teams: null,
      speakers: null,
    },
  }),
  actions: {
    async getTournaments() {
      this._loading.tournaments = true;
      this._loading.rounds = null;
      this._loading.breakCategories = null;
      this._loading.preferences = null;
      this._loading.adjudicators = null;
      this._loading.speakerCategories = null;
      this._loading.feedbackQuestions = null;
      this._loading.teams = null;

      const response = await client.get<Tournament[]>(
        `${baseUrl}/api/v1/tournaments`,
      );
      this._tournaments = response?.data;
      this._loading.tournaments = false;
    },
    setTournaments(tournaments: Tournament[]) {
      this._tournaments = [...tournaments];
    },
    setCurrentTournament(slug: string) {
      this._currentTournament = this._tournaments.find((t) => t.slug === slug);
    },
    async getRoundsForCurrentTournament() {
      if (this._loading.rounds === false) {
        return;
      }
      this._loading.rounds = true;
      const response = await client.get<Round[]>(
        this._currentTournament.links.rounds,
      );
      this._currentTournament.rounds = response?.data;
      this._loading.rounds = false;
    },
    async getInstitutions() {
      if (this._loading.institutions === false) {
        return;
      }
      this._loading.institutions = true;
      const response = await client.get<Institution[]>(
        `${baseUrl}/api/v1/institutions`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      this.setInstitutions(response.data);
      this._loading.institutions = false;
    },
    setInstitutions(institutions: Institution[]) {
      this._institutions = [...institutions];
    },
    async getBreakCategories() {
      if (this._loading.breakCategories === false) {
        return;
      }
      this._loading.breakCategories = true;
      const response = await client.get<BreakCategory[]>(
        this._currentTournament.links.breakCategories,
      );
      this._currentTournament.breakCategories = response?.data;
      this._loading.breakCategories = false;
    },
    async getSpeakerCategories() {
      if (this._loading.speakerCategories === false) {
        return;
      }
      this._loading.speakerCategories = true;
      const response = await client.get<SpeakerCategory[]>(
        this._currentTournament.links.speakerCategories,
      );
      this._currentTournament.speakerCategories = response?.data;
      this._loading.speakerCategories = false;
    },
    async getPreferences() {
      if (this._loading.preferences === false) {
        return;
      }
      this._loading.preferences = true;
      const response = await client.get<Preference[]>(
        this._currentTournament.links.preferences,
      );
      this._currentTournament.preferences = Object.fromEntries(
        Object.entries(
          groupBy(response?.data ?? [], ({ section }) => section),
        ).map(([key, val]) => [
          key,
          Object.fromEntries(
            Object.entries(groupBy(val, ({ name }) => name)).map(
              ([key, val]) => [key, val[0]],
            ),
          ),
        ]),
      );
      this._loading.preferences = false;
    },
    async getAdjudicators() {
      if (this._loading.adjudicators === false) {
        return;
      }
      this._loading.adjudicators = true;
      const response = await client.get<Adjudicator[]>(
        this._currentTournament.links.adjudicators,
      );
      this._currentTournament.adjudicators = response?.data;
      this._loading.adjudicators = false;
    },
    async addAdjudicator(adjudicator: Adjudicator) {
      const response = await client.post(
        this._currentTournament.links.adjudicators,
        adjudicator,
      );
      if (response.status === 201) {
        this._currentTournament.adjudicators.push(response.data);
      }
    },
    async getTeams() {
      if (this._loading.teams === false) {
        return;
      }
      this._loading.teams = true;
      const response = await client.get<Team[]>(
        this._currentTournament.links.teams,
      );
      this._currentTournament.teams = response?.data;
      this._loading.teams = false;
    },
    async getSpeakers() {
      if (this._loading.speakers === false) {
        return;
      }
      if (this._loading.teams === false) {
        this._currentTournament.speakers = this._currentTournament.teams.reduce(
          (acc, team) => acc.concat(team.speakers),
          [],
        );
        this._loading.speakers = false;
      } else {
        this._loading.speakers = true;
        const response = await client.get<Speaker[]>(
          this._currentTournament.links.speakers,
        );
        this._currentTournament.speakers = response?.data;
        this._loading.speakers = false;
      }
    },
    async addTeam(team: Team) {
      const response = await client.post(
        this._currentTournament.links.teams,
        team,
      );
      if (response.status === 201) {
        this._currentTournament.teams.push(response.data);
      }
    },
    async addInstitution(institution: Institution) {
      const response = await client.post(
        `${baseUrl}/api/v1/institutions`,
        institution,
      );
      if (response.status === 201) {
        this.institutions.push(response.data);
      }
    },
    async getRooms() {
      if (this._loading.rooms === false) {
        return;
      }
      this._loading.rooms = true;
      const response = await client.get<Room[]>(
        this._currentTournament.links.venues,
      );
      this._currentTournament.rooms = response?.data;
      this._loading.rooms = false;
    },
    async getRoomCategories() {
      if (this._loading.roomCategories === false) {
        return;
      }
      this._loading.roomCategories = true;
      const response = await client.get<RoomCategory[]>(
        this._currentTournament.links.venueCategories,
      );
      this._currentTournament.roomCategories = response?.data;
      this._loading.roomCategories = false;
    },
    async addRoom(room: Room) {
      const response = await client.post(
        this._currentTournament.links.rooms,
        room,
      );
      if (response.status === 201) {
        this._currentTournament.rooms.push(response.data);
      }
    },
    async addRoomCategory(roomCategory: RoomCategory) {
      const response = await client.post(
        this._currentTournament.links.roomCategories,
        roomCategory,
      );
      if (response.status === 201) {
        this._currentTournament.roomCategories.push(response.data);
      }
    },
    async toggleAvailable(item: Room, round: Round) {
      await client.patch(`${round.url}/availabilities`, item.url);
    },
    async createTournament(tournament: Tournament) {
      const response = await client.post(
        `${baseUrl}/api/v1/tournaments`,
        tournament,
      );
      if (response.status === 201) {
        this.tournaments.push(response.data);
      }
    },
    async getFeedbackQuestions() {
      if (this._loading.feedbackQuestions === false) {
        return;
      }
      this._loading.feedbackQuestions = true;
      const response = await client.get<FeedbackQuestion[]>(
        this._currentTournament.links.feedbackQuestions,
      );
      this._currentTournament.feedbackQuestions = response?.data;
      this._loading.feedbackQuestions = false;
    },
    async addFeedback(feedback: Feedback) {
      const response = await client.post(
        this._currentTournament.links.feedback,
        feedback,
      );
      if (response.status === 201) {
        this._currentTournament.feedback.push(response.data);
      }
    },
    async getRoundAvailabilities(round: Round) {
      round.availabilities =
        (await client.get(`${round.url}/availabilities?venues=true`))?.data ??
        [];
    },
    async updateAdjudicator(adjudicator: Adjudicator) {
      const url = adjudicator.url;
      delete adjudicator.url;
      delete adjudicator.id;
      delete adjudicator._links;
      const response = await client.post<Adjudicator[]>(url, adjudicator);
      this._currentTournament.adjudicators.splice(
        this._currentTournament.adjudicators.findIndex(
          (adj) => adj.url === url,
        ),
        1,
        response?.data,
      );
    },
  },
  getters: {
    tournaments: (state) => state._tournaments,
    currentTournament: (state) => state._currentTournament,
    institutions: (state) => state._institutions,
    loading: (state) => state._loading,
  },
});
