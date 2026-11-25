# Forside A/B — hvad vi kan måle

To versioner af forsiden ligger på hver sin URL:

| Version | URL           | Rådgiverens note ved den markerede linje                                    |
| ------- | ------------- | --------------------------------------------------------------------------- |
| A       | `/`           | "Kan du betale 8.000 kr. i morgen? Hvis ikke, er forsikringen billig det forkerte sted." |
| B       | `/forside-b`  | "En dækket skade koster 20.000 kr. I dette eksempel betaler du selv 8.000 kr." |

Alt andet er identisk: samme overskrift, samme illustrerede police, samme
markerede beløb, samme tre indgange. Kun noten skifter.

`/forside-b` er `noindex` og står i `robots.txt`, så den ikke konkurrerer med
forsiden i søgeresultaterne.

## Kan den eksisterende tracking skelne A fra B?

Ja, hele vejen fra landingsbesøg til trin 2 — uden nye events.

Variantnavnet udledes af den URL, besøget startede på. `heroVariantForPath()`
(`src/lib/analytics/heroVariant.ts`) er det ene sted, mapningen findes, så
dimensionen betyder det samme på alle events.

**Dimensionen `hero_variant` ligger nu på events, vi allerede sendte:**

| Event              | Rolle i målingen        | Hvor variant kommer fra        |
| ------------------ | ----------------------- | ------------------------------ |
| `page_view`        | nævneren (landingsbesøg) | `pathname`                     |
| `lead_flow_started`| indgang til flowet      | first-touch `landing_page`     |
| `lead_step_viewed` | tælleren (trin 2)       | first-touch `landing_page`     |

Ingen nye events, og ingen dobbelttælling:

- `page_view` sendes én gang pr. navigation.
- `lead_step_viewed` sendes én gang pr. session pr. trin (`viewedSteps`-ref i
  `LeadFunnel`), så en bruger, der går frem og tilbage, tælles én gang.
- `hero_variant` er `undefined` på alle andre sider, så en filtrering på den
  kan ikke komme til at samle trafik op, der ikke kom fra en af forsiderne.

**Serverside** gemmer `lead_events` allerede `landing_page` på hvert trin, så
det samme kan regnes uden om tag manager:

```sql
-- Andel af flow-start pr. version, der nåede trin 2
select landing_page,
       count(distinct session_id) filter (where event_type = 'lead_flow_started') as startede,
       count(distinct session_id) filter (where event_type = 'lead_step_viewed'
                                           and step_index >= 1)                   as naaede_trin_2
from lead_events
where landing_page in ('/', '/forside-b')
group by landing_page;
```

### Det eneste, serveren ikke kan svare på

Selve landingsbesøget. Vi logger ikke sidevisninger i databasen — med vilje.
Nævneren "landingsbesøg pr. version" findes derfor kun i tag manager/GA4 via
`page_view` + `hero_variant`. Serversiden kan regne alt fra flow-start og
frem.

### Den vigtigere måling bagefter

Når lead-lagringen er verificeret mod et rigtigt Supabase-projekt, er tallet,
der betyder noget, ikke trin 2 men gemte, kontaktbare leads. `leads` har
allerede `landing_page`:

```sql
select landing_page, count(*) as leads
from leads
where landing_page in ('/', '/forside-b')
group by landing_page;
```

### Hvad der ikke er sat op

Trafikfordelingen. Begge versioner er bygget og målbare i preview, men intet
splitter trafik mellem dem endnu. Det er en beslutning, ikke en manglende
implementering — en 50/50-fordeling kan laves på annonceniveau (to
annoncesæt, hver sin URL) uden kodeændringer, eller i en edge-rewrite hvis
den skal gælde organisk trafik.

### Bemærkning til sammenligning over tid

Indgangenes `cta_label` skiftede i denne release ("Sammenlign mine
forsikringer" og "Få et modbud til mit firma"). Sammenligninger på tværs af
udgivelsen skal derfor bruge `cta_location`, som er uændret.
