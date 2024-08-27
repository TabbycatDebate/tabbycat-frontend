<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useTournamentsStore } from '~/stores/tournaments';

const { t } = useI18n();

const tournamentsStore = useTournamentsStore();
tournamentsStore.getTeams();
const { currentTournament } = storeToRefs(tournamentsStore);

const donationLink = computed(() => `https://opencollective.com/tabbycat/contribute/licensing-29466/checkout?amount=${tournamentsStore.currentTournament?.teams?.length}`)

const languageText = t('base.footer.language');
const selectingLanguage = ref(false);
</script>

<template>
  <footer>
    <div class="blocks">
      <div>
        <h6>
          <template v-if="currentTournament">
            {{
              $t('base.footer.runsOn', {
                tournament: currentTournament.shortName,
                version: null,
                versionName: null,
              })
            }}
          </template>
          <template v-else>
            {{
              $t('base.footer.runsOnNoTournament', {
                version: null,
                versionName: null,
              })
            }}
          </template>
        </h6>
        <p>
          {{ $t('base.footer.license') }}
          <template v-if="currentTournament?.teams?.length > 0">
            <i18n-t keypath="base.footer.suggestedDonation.text">
              <template #link>
                <a
                  :href="donationLink"
                >
                  <i18n-t keypath="base.footer.suggestedDonation.link">
                    <template #amount>
                      <strong>{{ currentTournament.teams.length }}$</strong>
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
        <h6>
          {% blocktrans trimmed %}Still timing debates with the stopwatch app?{%
          endblocktrans %}
        </h6>
        <p>
          {% blocktrans trimmed %} Using an app designed for debate timekeeping
          makes speaking and adjudicating easier! Check out
          <a
            href="https://itunes.apple.com/app/apple-store/id1156065589?pt=814172&ct=Tabbycat%20Installs&mt=8"
            >Timekept</a
          >
          (iPhone/iPad) or
          <a
            href="https://play.google.com/store/apps/details?id=net.czlee.debatekeeper&referrer=utm_source%3Dtabbycat%26utm_medium%3Dfooter"
            >Debatekeeper</a
          >
          (Android). {% endblocktrans %}
        </p>
      </div>

      <div>
        <h6>
          {{ $t('base.footer.organisation.title') }}
        </h6>
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
            <a
              href="#"
              data-toggle="modal"
              data-target="#setLanguageModal"
            >
              Language
              <template
                v-if="LANGUAGE_CODE != 'en' && languageText != 'Language'"
              >
                / {{ languageText }}
              </template>
            </a>
          </li>
          <li>
            <Icon type="Github" size="18" />
            <a
             
              href="https://github.com/TabbycatDebate/tabbycat/"
            >
              {{ $t('base.footer.github') }}
            </a>
          </li>
          <li>
            <Icon type="Book" size="18" />
            <a
             
              href="https://tabbycat.readthedocs.io/en/stable/"
            >
              {{ $t('base.footer.documentation') }}
            </a>
          </li>
          <li>
            <Icon type="HelpCircle" size="18" />
            <a
             
              href="https://tabbycat.readthedocs.io/en/stable/about/support.html"
            >
              {{ $t('base.footer.support') }}
            </a>
          </li>
          <li>
            <Icon type="Facebook" size="18" />
            <a
             
              href="https://www.facebook.com/TabbycatDebate/"
            >
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
        <button type="submit">
          {{ $t('base.footer.selectLanguage') }}
        </button>
      </Dialog>
  </footer>
</template>

<style scoped>
footer {
  background: var(--background-inset-color);
  border-top: 1px solid var(--border-color);
  padding: .5rem 1rem;

  .blocks {
    display: flex;
  }

  .links {
    justify-content: center;
    display: flex;

    li {
      padding: .5rem;
      display: flex;
      gap: 0.25rem;
    }
  }
}
</style>
