/**
 * Documentation Page
 *
 * User guide for Visitor Tracker Dashboard with tabs for different sections.
 */

import { useState } from 'react';
import {
  BookOpen,
  Users,
  FolderKanban,
  BarChart3,
  Code,
  Plug,
  CheckCircle2,
  Info,
  AlertCircle,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Monitor,
  Smartphone,
} from 'lucide-react';

type TabId = 'overview' | 'visitors' | 'projects' | 'statistics' | 'integration' | 'api';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Översikt', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'visitors', label: 'Besökare', icon: <Users className="h-5 w-5" /> },
  { id: 'projects', label: 'Projekt', icon: <FolderKanban className="h-5 w-5" /> },
  { id: 'statistics', label: 'Statistik', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'integration', label: 'Integration', icon: <Plug className="h-5 w-5" /> },
  { id: 'api', label: 'API', icon: <Code className="h-5 w-5" /> },
];

// Reusable components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2 ml-4">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </span>
          <span className="text-gray-700 pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-blue-800">{children}</div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800">{children}</div>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CodeBlock({ code, language = 'html' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? 'Kopierat!' : 'Kopiera'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Tab content components
function OverviewContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <Section title="Välkommen till Visitor Tracker">
        <p className="text-gray-600 mb-4">
          Visitor Tracker är ett realtidsverktyg för att övervaka och analysera besökare på dina webbplatser.
          Se vem som besöker dina sidor, vilka sidor de tittar på, och få insikter om deras beteende.
        </p>
        <FeatureList
          items={[
            'Realtidsövervakning av aktiva besökare',
            'Detaljerad information om varje besökare (enhet, webbläsare, OS)',
            'Projektbaserad organisation för flera webbplatser',
            'Statistik och analyser över tid',
            'Alias-funktion för att namnge återkommande besökare',
            'Enkel integration med en rad kod',
          ]}
        />
      </Section>

      <Section title="Hur det fungerar">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold">1. Lägg till tracker-skriptet på din webbplats</span>
          </div>
          <div className="ml-6 flex items-center gap-2 text-gray-600 mb-2">
            <ChevronRight className="h-4 w-4" />
            <span>2. Besökare registreras automatiskt när de besöker sidan</span>
          </div>
          <div className="ml-6 flex items-center gap-2 text-gray-600 mb-2">
            <ChevronRight className="h-4 w-4" />
            <span>3. Se besökarna i realtid på din dashboard</span>
          </div>
          <div className="ml-6 flex items-center gap-2 text-gray-600">
            <ChevronRight className="h-4 w-4" />
            <span>4. Analysera statistik för att förstå ditt trafikmönster</span>
          </div>
        </div>
      </Section>

      <Section title="Snabbstart">
        <StepList
          steps={[
            'Skapa ett projekt för din webbplats under "Projekt"',
            'Kopiera tracker-skriptet som visas',
            'Lägg till skriptet i din webbplats <head> eller före </body>',
            'Gå till Dashboard för att se besökare i realtid',
          ]}
        />
      </Section>

      <Section title="Navigering">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Dashboard</span>
            </div>
            <p className="text-sm text-gray-600">
              Huvudvyn med aktiva besökare i realtid. Klicka på ett besökarkort för detaljer.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FolderKanban className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Projekt</span>
            </div>
            <p className="text-sm text-gray-600">
              Hantera dina webbplatser/appar. Skapa nya projekt och få tracker-koden.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Statistik</span>
            </div>
            <p className="text-sm text-gray-600">
              Analysera besöksdata över tid med grafer och diagram.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Dokumentation</span>
            </div>
            <p className="text-sm text-gray-600">
              Du är här! Läs om alla funktioner och hur du använder systemet.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function VisitorsContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <Section title="Besökarkort">
        <p className="text-gray-600 mb-4">
          Varje aktiv besökare visas som ett kort på dashboarden. Kortet innehåller viktig information
          om besökaren och uppdateras i realtid.
        </p>

        <SubSection title="Information på kortet">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">Besökar-ID / Alias</span>
                <p className="text-sm text-gray-600">Unikt ID eller ditt anpassade namn</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">IP-adress</span>
                <p className="text-sm text-gray-600">Besökarens publika IP</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Monitor className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">Operativsystem</span>
                <p className="text-sm text-gray-600">Windows, macOS, Linux, Android, iOS</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Eye className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">Nuvarande sida</span>
                <p className="text-sm text-gray-600">Vilken URL besökaren tittar på</p>
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection title="Status-indikator">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-700"><strong>Grön</strong> - Aktiv just nu</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-700"><strong>Gul</strong> - Inaktiv (ingen aktivitet senaste 30s)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className="text-gray-700"><strong>Grå</strong> - Lämnat sidan</span>
            </div>
          </div>
        </SubSection>
      </Section>

      <Section title="Besökardetaljer">
        <p className="text-gray-600 mb-4">
          Klicka på ett besökarkort för att öppna detaljvyn med fullständig information.
        </p>
        <FeatureList
          items={[
            'Fullständigt besökar-ID',
            'IP-adress och geografisk information',
            'Webbläsare och version',
            'Operativsystem och enhet',
            'Skärmupplösning',
            'Nuvarande sida med tidsstämpel',
            'Möjlighet att sätta alias',
          ]}
        />
      </Section>

      <Section title="Alias-funktion">
        <p className="text-gray-600 mb-4">
          Ge dina besökare meningsfulla namn istället för automatiska ID:n. Alias sparas och visas
          nästa gång samma besökare återkommer.
        </p>
        <StepList
          steps={[
            'Klicka på ett besökarkort för att öppna detaljvyn',
            'Klicka på penn-ikonen bredvid besökarnamnet',
            'Skriv in ett alias (t.ex. "Kollega Lisa" eller "Kund ABC")',
            'Klicka på Spara eller tryck Enter',
          ]}
        />
        <InfoBox>
          Alias identifieras via en kombination av IP-adress och webbläsar-fingerprint.
          Samma besökare får samma alias även om de byter sida eller kommer tillbaka senare.
        </InfoBox>
      </Section>

      <Section title="Realtidsuppdateringar">
        <p className="text-gray-600 mb-4">
          Dashboard uppdateras automatiskt med Server-Sent Events (SSE). Du behöver inte ladda om sidan
          för att se nya besökare eller uppdateringar.
        </p>
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-800">Live-anslutning aktiv</span>
        </div>
      </Section>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <Section title="Vad är ett projekt?">
        <p className="text-gray-600 mb-4">
          Ett projekt representerar en webbplats eller app som du vill spåra. Varje projekt har en
          unik tracking-kod som du lägger till på din sajt.
        </p>
        <InfoBox>
          Du kan skapa flera projekt för att hålla isär olika webbplatser eller miljöer
          (t.ex. produktion vs staging).
        </InfoBox>
      </Section>

      <Section title="Skapa ett nytt projekt">
        <StepList
          steps={[
            'Gå till "Projekt" i menyn',
            'Klicka på "+ Nytt projekt"',
            'Fyll i projektnamn (t.ex. "Min Webbshop")',
            'Valfritt: Lägg till domän för att filtrera tracking',
            'Klicka på Skapa',
          ]}
        />
      </Section>

      <Section title="Projektinställningar">
        <p className="text-gray-600 mb-4">
          Klicka på kugghjulet på ett projekt för att redigera inställningar.
        </p>

        <SubSection title="Grundinställningar">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                Namn
              </span>
              <span className="text-gray-600">Visningsnamn för projektet i dashboarden</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                Domän
              </span>
              <span className="text-gray-600">Begränsa tracking till en specifik domän</span>
            </div>
          </div>
        </SubSection>

        <SubSection title="Notifikationer">
          <p className="text-gray-600 mb-3">
            Konfigurera hur du vill bli notifierad när en ny besökare anländer.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                Webbläsarnotiser
              </span>
              <span className="text-gray-600">Visa notiser i webbläsaren (kräver tillåtelse)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                Ljudnotis
              </span>
              <span className="text-gray-600">Spela ett ljud när nya besökare anländer</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                ntfy-notiser
              </span>
              <span className="text-gray-600">Push-notiser till din telefon via ntfy.sh</span>
            </div>
          </div>
        </SubSection>

        <SubSection title="ntfy - Mobilnotiser">
          <p className="text-gray-600 mb-3">
            Med ntfy kan du få push-notiser direkt till din telefon när någon besöker din sajt.
          </p>
          <StepList
            steps={[
              'Aktivera "ntfy-notiser" i projektinställningarna',
              'Ange ett unikt topic-namn (t.ex. "mina-besokare")',
              'Installera ntfy-appen på din telefon (Android/iOS)',
              'Prenumerera på samma topic i appen',
            ]}
          />
          <InfoBox>
            När du anger ett topic visas en påminnelse med direktlänk till ntfy.sh där du kan
            prenumerera på topic:et i din webbläsare eller app.
          </InfoBox>
        </SubSection>
      </Section>

      <Section title="Tracker-kod">
        <p className="text-gray-600 mb-4">
          Varje projekt har en unik tracker-kod. Kopiera koden och lägg till den på din webbplats.
        </p>
        <CodeBlock
          code={`<!-- Visitor Tracker -->
<script
  src="https://qrplan.eu/widget/tracker.js"
  data-project-id="DITT_PROJEKT_ID">
</script>`}
          language="html"
        />
        <WarningBox>
          Ersätt DITT_PROJEKT_ID med det faktiska ID:t som visas i projektinställningarna.
        </WarningBox>
      </Section>

      <Section title="Filtrera på dashboard">
        <p className="text-gray-600 mb-4">
          Om du har flera projekt kan du filtrera dashboarden för att bara se besökare från ett
          specifikt projekt.
        </p>
        <StepList
          steps={[
            'På Dashboard, titta på "Aktiva sajter" kortet',
            'Välj ett projekt i dropdown-menyn',
            'Dashboarden visar nu bara besökare från det projektet',
          ]}
        />
      </Section>
    </div>
  );
}

function StatisticsContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <Section title="Statistiköversikt">
        <p className="text-gray-600 mb-4">
          Statistiksidan ger dig insikter om dina besökare över tid. Analysera trender, se vilka
          enheter som används mest, och förstå ditt trafikmönster.
        </p>
      </Section>

      <Section title="Datumintervall">
        <p className="text-gray-600 mb-4">
          Välj vilket tidsintervall du vill analysera med datumväljaren.
        </p>
        <FeatureList
          items={[
            'Senaste 7 dagarna (standard)',
            'Senaste 30 dagarna',
            'Anpassat intervall',
          ]}
        />
      </Section>

      <Section title="Tillgängliga diagram">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Besök per dag</span>
            </div>
            <p className="text-sm text-gray-600">
              Stapeldiagram som visar antal besök för varje dag i valt intervall.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="h-5 w-5 text-green-600" />
              <span className="font-medium">Operativsystem</span>
            </div>
            <p className="text-sm text-gray-600">
              Cirkeldiagram med fördelning av Windows, macOS, Linux, etc.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Webbläsare</span>
            </div>
            <p className="text-sm text-gray-600">
              Cirkeldiagram med fördelning av Chrome, Firefox, Safari, etc.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Enhetstyp</span>
            </div>
            <p className="text-sm text-gray-600">
              Cirkeldiagram med Desktop vs Mobil vs Tablet.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Sammanfattning">
        <p className="text-gray-600 mb-4">
          Överst på statistiksidan visas nyckeltal för valt intervall:
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">1,234</div>
            <div className="text-sm text-blue-600">Totala besök</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">456</div>
            <div className="text-sm text-green-600">Unika besökare</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">3</div>
            <div className="text-sm text-purple-600">Aktiva projekt</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function IntegrationContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <Section title="Snabbinstallation">
        <p className="text-gray-600 mb-4">
          Lägg till Visitor Tracker på din webbplats med en enda rad kod.
        </p>

        <SubSection title="Med projekt-ID (rekommenderat)">
          <p className="text-gray-600 mb-2">
            Använd detta när du har skapat ett projekt i dashboarden:
          </p>
          <CodeBlock
            code={`<script src="https://qrplan.eu/widget/tracker.js" data-project-id="3"></script>`}
            language="html"
          />
        </SubSection>

        <SubSection title="Med domän">
          <p className="text-gray-600 mb-2">
            Alternativt kan du använda domännamnet för automatisk matchning:
          </p>
          <CodeBlock
            code={`<script src="https://qrplan.eu/widget/tracker.js" data-domain="dindomän.se"></script>`}
            language="html"
          />
        </SubSection>
      </Section>

      <Section title="Placering">
        <p className="text-gray-600 mb-4">
          Skriptet kan placeras antingen i <code>&lt;head&gt;</code> eller före <code>&lt;/body&gt;</code>.
        </p>

        <SubSection title="I head (tidigast möjlig tracking)">
          <CodeBlock
            code={`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Min sida</title>
  <!-- Visitor Tracker -->
  <script src="https://qrplan.eu/widget/tracker.js" data-project-id="3"></script>
</head>
<body>
  ...
</body>
</html>`}
            language="html"
          />
        </SubSection>

        <SubSection title="Före body-slut (bättre sidladdning)">
          <CodeBlock
            code={`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Min sida</title>
</head>
<body>
  ...
  <!-- Visitor Tracker -->
  <script src="https://qrplan.eu/widget/tracker.js" data-project-id="3"></script>
</body>
</html>`}
            language="html"
          />
        </SubSection>
      </Section>

      <Section title="Ramverk-specifik integration">
        <SubSection title="React / Next.js">
          <CodeBlock
            code={`// I _app.tsx eller layout.tsx
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://qrplan.eu/widget/tracker.js"
        data-project-id="3"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}`}
            language="tsx"
          />
        </SubSection>

        <SubSection title="Vue.js / Nuxt">
          <CodeBlock
            code={`<!-- I nuxt.config.ts -->
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: 'https://qrplan.eu/widget/tracker.js',
          'data-project-id': '3'
        }
      ]
    }
  }
})`}
            language="typescript"
          />
        </SubSection>

        <SubSection title="WordPress">
          <p className="text-gray-600 mb-2">
            Lägg till i functions.php eller använd ett plugin som "Insert Headers and Footers":
          </p>
          <CodeBlock
            code={`function add_visitor_tracker() {
    echo '<script src="https://qrplan.eu/widget/tracker.js" data-project-id="3"></script>';
}
add_action('wp_head', 'add_visitor_tracker');`}
            language="php"
          />
        </SubSection>
      </Section>

      <Section title="Felsökning">
        <WarningBox>
          Om besökare inte visas, kontrollera följande:
        </WarningBox>
        <FeatureList
          items={[
            'Att projekt-ID är korrekt (kontrollera i Projekt-sidan)',
            'Att skriptet laddas (kolla Network-fliken i DevTools)',
            'Att det inte finns Content Security Policy som blockerar skriptet',
            'Att projektet är aktivt i dashboarden',
          ]}
        />
      </Section>
    </div>
  );
}

function ApiContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <Section title="API-dokumentation">
        <p className="text-gray-600 mb-4">
          Visitor Tracker erbjuder ett REST API för att hämta data programmatiskt.
          API:et kräver autentisering via session (inloggad användare).
        </p>
        <InfoBox>
          API:et är tillgängligt på <code>https://qrplan.eu/api/visitors/</code>
        </InfoBox>
      </Section>

      <Section title="Endpoints">
        <SubSection title="GET /api/visitors">
          <p className="text-gray-600 mb-2">Hämta alla aktiva besökare.</p>
          <CodeBlock
            code={`GET https://qrplan.eu/api/visitors

// Response
{
  "visitors": [
    {
      "id": 1,
      "visitor_id": "abc123...",
      "alias": "Kollega Lisa",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "os": "Windows 10/11",
      "browser": "Chrome",
      "device_type": "Desktop",
      "current_url": "https://example.com/page",
      "is_active": true,
      "last_seen": "2024-01-15T10:30:00Z"
    }
  ]
}`}
            language="json"
          />
        </SubSection>

        <SubSection title="GET /api/visitors/statistics">
          <p className="text-gray-600 mb-2">Hämta aggregerad statistik.</p>
          <CodeBlock
            code={`GET https://qrplan.eu/api/visitors/statistics?from=2024-01-01&to=2024-01-31

// Response
{
  "period": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  },
  "summary": {
    "total_visits": 1234,
    "unique_visitors": 456,
    "total_projects": 3
  },
  "by_date": [...],
  "by_os": [...],
  "by_browser": [...],
  "by_device": [...]
}`}
            language="json"
          />
        </SubSection>

        <SubSection title="GET /api/visitors/projects">
          <p className="text-gray-600 mb-2">Hämta alla projekt.</p>
          <CodeBlock
            code={`GET https://qrplan.eu/api/visitors/projects

// Response
{
  "projects": [
    {
      "id": 1,
      "name": "Min Webbplats",
      "domain": "example.com",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`}
            language="json"
          />
        </SubSection>

        <SubSection title="PUT /api/visitors/{id}">
          <p className="text-gray-600 mb-2">Uppdatera en besökare (t.ex. sätt alias).</p>
          <CodeBlock
            code={`PUT https://qrplan.eu/api/visitors/123
Content-Type: application/json

{
  "alias": "Kollega Lisa"
}

// Response
{
  "success": true,
  "visitor": { ... }
}`}
            language="json"
          />
        </SubSection>

        <SubSection title="GET /api/visitors/events (SSE)">
          <p className="text-gray-600 mb-2">
            Server-Sent Events för realtidsuppdateringar.
          </p>
          <CodeBlock
            code={`const eventSource = new EventSource('https://qrplan.eu/api/visitors/events');

eventSource.addEventListener('visitor_update', (event) => {
  const data = JSON.parse(event.data);
  console.log('Besökare uppdaterad:', data);
});

eventSource.addEventListener('visitor_leave', (event) => {
  const data = JSON.parse(event.data);
  console.log('Besökare lämnade:', data);
});`}
            language="javascript"
          />
        </SubSection>
      </Section>

      <Section title="Felhantering">
        <p className="text-gray-600 mb-4">
          API:et returnerar standardiserade felmeddelanden:
        </p>
        <CodeBlock
          code={`// 401 Unauthorized
{
  "error": "Not authenticated"
}

// 404 Not Found
{
  "error": "Visitor not found"
}

// 500 Server Error
{
  "error": "Internal server error"
}`}
          language="json"
        />
      </Section>

      <Section title="Länkar">
        <div className="space-y-2">
          <a
            href="https://qrplan.eu/CLAUDE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800"
          >
            <ExternalLink className="h-4 w-4" />
            Teknisk dokumentation (CLAUDE.md)
          </a>
        </div>
      </Section>
    </div>
  );
}

export function Documentation() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'visitors':
        return <VisitorsContent />;
      case 'projects':
        return <ProjectsContent />;
      case 'statistics':
        return <StatisticsContent />;
      case 'integration':
        return <IntegrationContent />;
      case 'api':
        return <ApiContent />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dokumentation</h1>

      {/* Tabs - scrollable on mobile */}
      <div className="border-b border-gray-200 mb-6 -mx-4 px-4 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default Documentation;
