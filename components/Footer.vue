<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const { data: rootData } = await useAPI('root');

const currentTournament = useState('currentTournamentSlug');
const nTeams = ref(0);
const tournamentName = ref(null);
if (currentTournament.value) {
  const { data: teamsData } = await useAPI('teams');
  const { data: tournamentData } = await useAPI(
    'tournaments',
    {},
    { tournamentSlug: currentTournament.value },
  );
  nTeams.value = teamsData.value.length;
  tournamentName.value = tournamentData.value.shortName;
}

const donationLink = computed(
  () =>
    `https://opencollective.com/tabbycat/contribute/licensing-29466/checkout?amount=${nTeams.value}`,
);

const languageText = computed(() => t('base.footer.language'));
const selectingLanguage = ref(false);
const languageChangeTo = ref(locale.value);

function changeLanguage() {
  locale.value = languageChangeTo.value;
  selectingLanguage.value = false;
}
</script>

<template>
  <footer>
    <div class="blocks">
      <div>
        <h5>
          <template v-if="currentTournament">
            {{
              $t('base.footer.runsOn', {
                tournament: tournamentName,
                version: rootData.version,
                versionName: rootData.versionName,
              })
            }}
          </template>
          <template v-else>
            {{
              $t('base.footer.runsOnNoTournament', {
                version: rootData.version,
                versionName: rootData.versionName,
              })
            }}
          </template>
        </h5>
        <p>
          {{ $t('base.footer.license') }}
          <template v-if="nTeams > 0">
            <i18n-t keypath="base.footer.suggestedDonation.text">
              <template #link>
                <a :href="donationLink">
                  <i18n-t keypath="base.footer.suggestedDonation.link">
                    <template #amount>
                      <strong>{{ nTeams }}$</strong>
                    </template>
                  </i18n-t>
                </a>
              </template>
            </i18n-t>
          </template>
          <template v-else>
            <i18n-t keypath="base.footer.donation.text">
              <template #link>
                <a href="https://opencollective.com/tabbycat">
                  {{ $t('base.footer.donation.link') }}
                </a>
              </template>
            </i18n-t>
          </template>
        </p>
      </div>

      <div>
        <h5>Still timing debates with the stopwatch app?</h5>
        <p>
          Using an app designed for debate timekeeping makes speaking and
          adjudicating easier! Check out
          <a
            href="https://itunes.apple.com/app/apple-store/id1156065589?pt=814172&ct=Tabbycat%20Installs&mt=8"
            >Timekept</a
          >
          (iPhone/iPad) or
          <a
            href="https://play.google.com/store/apps/details?id=net.czlee.debatekeeper&referrer=utm_source%3Dtabbycat%26utm_medium%3Dfooter"
            >Debatekeeper</a
          >
          (Android).
        </p>
      </div>

      <div>
        <h5>
          {{ $t('base.footer.organisation.title') }}
        </h5>
        <p>
          <i18n-t keypath="base.footer.organisation.text">
            <template #association>
              <a href="https://tabbycat-debate.org/">
                {{ $t('base.footer.organisation.association') }}
              </a>
            </template>
          </i18n-t>
        </p>
      </div>
    </div>

    <ul class="links">
      <li>
        <Icon type="Languages" size="18" />
        <button class="link" @click="selectingLanguage = true">
          Language
          <template v-if="$i18n.locale != 'en' && languageText != 'Language'">
            / {{ languageText }}
          </template>
        </button>
      </li>
      <li>
        <Icon type="Github" size="18" />
        <a href="https://github.com/TabbycatDebate/tabbycat/">
          {{ $t('base.footer.github') }}
        </a>
      </li>
      <li>
        <Icon type="Book" size="18" />
        <a href="https://tabbycat.readthedocs.io/en/stable/">
          {{ $t('base.footer.documentation') }}
        </a>
      </li>
      <li>
        <Icon type="HelpCircle" size="18" />
        <a href="https://tabbycat.readthedocs.io/en/stable/about/support.html">
          {{ $t('base.footer.support') }}
        </a>
      </li>
      <li>
        <Icon type="Facebook" size="18" />
        <a href="https://www.facebook.com/TabbycatDebate/">
          {{ $t('base.footer.facebook') }}
        </a>
      </li>
      <li>
        <Icon type="UploadCloud" size="18" />
        <a
          href="https://github.com/TabbycatDebate/tabbycat#%EF%B8%8F-installation"
        >
          {{ $t('base.footer.setUp') }}
        </a>
      </li>
    </ul>
    <Dialog
      v-model:visible="selectingLanguage"
      :style="{ width: '450px' }"
      :modal="true"
      :header="$t('base.footer.changeLanguage')"
    >
      <form @submit.prevent="changeLanguage">
        <select v-model="languageChangeTo" class="form-control">
          <option
            v-for="localeCode in $i18n.availableLocales"
            :key="`locale-${localeCode}`"
            :value="localeCode"
          >
            {{ t(`languages.${localeCode}`) }}
          </option>
        </select>
        <button class="form-control btn-success" type="submit">
          {{ $t('base.footer.selectLanguage') }}
        </button>
      </form>
    </Dialog>
  </footer>
</template>

<style scoped>
footer {
  background: var(--background-inset-color);
  border-top: 1px solid var(--border-color);
  padding: 1rem 1rem 0.5rem 1rem;
  font-size: 0.875rem;

  .blocks {
    display: flex;

    > div {
      padding-right: 15px;
      padding-left: 15px;
    }
  }

  .links {
    justify-content: center;
    display: flex;
    padding-top: 1rem;

    li {
      padding: 0.5rem;
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }
  }
}
</style>
