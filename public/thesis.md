# HISTORICAL ASSESSMENT AND FUTURE PROJECTIONS OF THERMAL COMFORT ACROSS NIGERIA'S ECOLOGICAL ZONES (1980–2060)

**Suggested Alternative Title:** Historical Assessment and Future Projections of Heat Stress Hazards and Survivability Limits Across Nigeria's Ecological Zones (1980–2060)

---

**A Project Submitted to the Department of Meteorology and Climate Science, School of Earth and Mineral Sciences, Federal University of Technology Akure, Ondo State, Nigeria**

**In Partial Fulfilment of the Requirements for the Award of the Degree of Bachelor of Science (B.Sc.) in Meteorology and Climate Science**

**By**

**CHINYERE, Daniel Kenechukwu**

**Supervisor: Prof. Ife Balogun**

**2025/2026 Academic Session**

---

## ABSTRACT

*(To be written last, after all results are compiled. Target: 250–300 words. Must include: background, aim, methodology, key findings, and conclusion. This section will be finalised after Chapter 4 is complete.)*

---

## TABLE OF CONTENTS

- **Abstract**
- **Table of Contents**
- **List of Tables**
- **List of Figures**
- **List of Abbreviations**

### Chapter One: Introduction
- 1.0 Introduction
- 1.1 Background of Study
- 1.2 Statement of Research Problem
- 1.3 Research Questions
- 1.4 Aim and Objectives
- 1.5 Justification of Research
- 1.6 Scope of Study
- 1.7 Definition of Unfamiliar Terms
- 1.8 Research Limitations
- 1.9 Study Area

### Chapter Two: Literature Review and Conceptual Framework
- 2.1 Global Climate Change and Temperature Trends
- 2.2 Heat Stress: Concepts and Indices
- 2.3 The Heat Index: Development and Application
- 2.4 Wet Bulb Temperature and Human Survivability
- 2.5 Tropical Nights and Nocturnal Heat Retention
- 2.6 Reanalysis Datasets in Climate Research
- 2.7 CMIP6 and Shared Socioeconomic Pathways
- 2.8 Heat Stress Studies in West Africa and Nigeria
- 2.9 Trend Analysis Methods in Climatology
- 2.10 Conceptual Framework

### Chapter Three: Research Methodology
- 3.1 Research Design
- 3.2 Data Sources and Acquisition
- 3.3 Data Extraction Procedure
- 3.4 Relative Humidity Derivation (Temporal Pairing)
- 3.5 Heat Index Computation (NWS Decision Tree)
- 3.6 Wet Bulb Temperature Computation
- 3.7 Threshold Definitions
- 3.8 Trend Analysis (Mann-Kendall and Sen's Slope)
- 3.9 Future Projections (Delta Method)
- 3.10 Bias Correction Strategy
- 3.11 Software and Tools
- 3.12 Methodological Limitations

### Chapter Four: Data Analysis
- 4.1 Data Validation and Quality Assessment
- 4.2 Historical Heat Index Analysis (1980–2025)
- 4.3 Danger Day Frequency and Trends
- 4.4 Tropical Night Frequency and Trends
- 4.5 Wet Bulb Temperature Trends
- 4.6 NWS Method Distribution Analysis
- 4.7 Zonal Synthesis and Cross-City Comparison
- 4.8 Future Projections (2026–2060)
- 4.9 Discussion of Results

### Chapter Five: Summary of Findings, Recommendations and Conclusions
- 5.1 Summary of Findings
- 5.2 Recommendations
- 5.3 Contributions to Knowledge
- 5.4 Suggestions for Further Research
- 5.5 Conclusion

- **References**
- **Appendices**

---

## LIST OF ABBREVIATIONS

| Abbreviation | Full Meaning |
|-------------|--------------|
| AR6 | Sixth Assessment Report (IPCC) |
| CMIP6 | Coupled Model Intercomparison Project Phase 6 |
| CDS | Climate Data Store (Copernicus) |
| DTR | Diurnal Temperature Range |
| ECMWF | European Centre for Medium-Range Weather Forecasts |
| ERA5 | Fifth Generation ECMWF Atmospheric Reanalysis |
| GEE | Google Earth Engine |
| GSOD | Global Surface Summary of the Day (NOAA) |
| HI | Heat Index |
| IPCC | Intergovernmental Panel on Climate Change |
| ITD | Inter-Tropical Discontinuity |
| ITCZ | Inter-Tropical Convergence Zone |
| MBE | Mean Bias Error |
| MK | Mann-Kendall (trend test) |
| NiMet | Nigerian Meteorological Agency |
| NOAA | National Oceanic and Atmospheric Administration |
| NWS | National Weather Service (United States) |
| RH | Relative Humidity |
| RMSE | Root Mean Square Error |
| SSP | Shared Socioeconomic Pathway |
| Td | Dewpoint Temperature |
| Tmax | Daily Maximum Temperature (2 m above ground) |
| Tmin | Daily Minimum Temperature (2 m above ground) |
| Tw | Wet Bulb Temperature |
| WBGT | Wet Bulb Globe Temperature |
| WMO | World Meteorological Organization |

---

# CHAPTER ONE: INTRODUCTION

## 1.0 Introduction

The Earth's climate system is undergoing a transformation unprecedented in the history of modern civilisation. According to the Intergovernmental Panel on Climate Change (IPCC, 2021), global mean surface temperature increased by approximately 1.09°C between the pre-industrial baseline period of 1850–1900 and the decade of 2011–2020, with the rate of warming accelerating markedly since the 1970s. This warming is not uniformly distributed across the globe; tropical regions, which already experience high baseline temperatures and humidity, face a disproportionate intensification of thermal stress even under modest increases in mean temperature (Mora et al., 2017). For nations situated within the tropics, the consequences extend beyond rising thermometer readings into a domain of direct physiological threat to human populations.

Nigeria, the most populous nation in Africa with an estimated population exceeding 220 million (United Nations, 2022), occupies a latitudinal band between approximately 4°N and 14°N, spanning a remarkable diversity of climatic zones from the humid tropical rainforests of the southern coast to the semi-arid Sahel of the far north. This latitudinal gradient creates a natural laboratory in which the mechanisms of heat stress differ fundamentally from zone to zone. In the humid south, represented in this study by Lagos (6.52°N, 3.38°E), heat stress arises not from extreme air temperatures but from the compounding interaction of moderate temperatures with persistently high humidity, which impairs the body's ability to dissipate heat through evaporative cooling. In the arid north, represented by Kano (12.00°N, 8.52°E), heat stress is driven primarily by extreme maximum air temperatures that frequently exceed 40°C during the pre-monsoon hot season, even though the lower humidity in principle allows more efficient evaporation. In the transitional Guinea Savanna, represented by Abuja (9.06°N, 7.50°E), the dominant heat stress mechanism shifts seasonally as the Inter-Tropical Discontinuity (ITD) migrates northward and southward across the region, alternating between dry-season extremes and wet-season humidity.

The critical insight motivating this study is that raw air temperature alone is an inadequate metric for characterising the true thermal burden on the human body. A temperature of 35°C at 30% relative humidity (RH) represents a fundamentally different physiological challenge than a temperature of 35°C at 85% RH. The former permits efficient evaporative cooling through perspiration; the latter does not. To capture this compound effect, biometeorology has developed integrative indices — most notably the Heat Index (HI), which combines temperature and humidity into a single value representing the perceived thermal load on the human body (Steadman, 1979; Rothfusz, 1990). This study employs the complete U.S. National Weather Service (NWS) implementation of the Heat Index, which extends the standard Rothfusz polynomial regression with conditional adjustments for extreme humidity regimes that are directly relevant to Nigerian climatic conditions.

Beyond perceived discomfort, this research tracks a more fundamental threshold: the Wet Bulb Temperature (Tw), which represents the thermodynamic limit of human survivability. At a Wet Bulb Temperature of 35°C, the atmosphere is so warm and saturated that sweat cannot evaporate from the skin regardless of wind, shade, hydration, or physical fitness. The body's sole effective cooling mechanism ceases, core temperature rises uncontrollably, and death from hyperthermia follows within hours (Sherwood and Huber, 2010). While no Nigerian city currently approaches this limit, projections under high-emission scenarios raise the question of whether any zone will approach it by mid-century — a question this study seeks to quantify.

This thesis presents a spatiotemporal analysis of heat stress across Nigeria's three primary ecological zones for the period 1980–2060. The historical analysis (1980–2025) utilises 46 years of daily meteorological data extracted from the European Centre for Medium-Range Weather Forecasts (ECMWF) ERA5-Land reanalysis dataset via the Google Earth Engine platform. The future projection component (2026–2060) applies the Delta Method to Coupled Model Intercomparison Project Phase 6 (CMIP6) ensemble data under two Shared Socioeconomic Pathway scenarios: SSP2-4.5 (moderate mitigation) and SSP5-8.5 (high emissions, fossil-fuel-intensive development). Through this dual-period approach, the study answers a direct question: *Is heat stress actually getting worse with time across Nigeria, and how much worse will it get?*

The remainder of this chapter presents the background of the study, the research problem, the research questions, the aim and objectives, the justification, scope, definitions, limitations, and a description of the study area.

---

## 1.1 Background of Study

### 1.1.1 Global Climate Change and Rising Temperatures

The scientific consensus on anthropogenic climate change is unequivocal. The IPCC Sixth Assessment Report (AR6) states with high confidence that human-induced greenhouse gas emissions have driven the observed warming of approximately 1.09°C since the pre-industrial era, and that continued emissions will cause further warming in all scenarios considered (IPCC, 2021). The decade of 2011–2020 was the warmest in the instrumental record, and the six years between 2015 and 2020 were collectively the hottest six years ever recorded by global surface temperature networks (WMO, 2021).

The implications of this warming are not confined to rising average temperatures. The frequency and intensity of extreme heat events have increased significantly in virtually every inhabited region on Earth (Perkins-Kirkpatrick and Lewis, 2020). Heat extremes that would have occurred once every 50 years in a pre-industrial climate now occur approximately once every 10 years at current warming levels, and under 2°C of warming, they are projected to become roughly five times more frequent (IPCC, 2021, Chapter 11). For tropical nations, this trend is particularly concerning because baseline temperatures are already close to the upper limits of human thermal tolerance, leaving a narrow margin before conditions become physiologically dangerous.

### 1.1.2 Africa's Climate Vulnerability

The African continent is recognised as one of the most climate-vulnerable regions globally, a status driven by the intersection of high exposure, high sensitivity, and limited adaptive capacity (Niang et al., 2014). Africa has warmed faster than the global average over the past several decades, with observed warming rates of approximately 0.3°C per decade across the Sahel and West African subregion (Russo et al., 2016). This warming is superimposed on a climate that already features some of the highest Heat Index values on Earth, particularly during the boreal spring (March–May) when the pre-monsoon heat builds across the Guinea Savanna and Sahel zones before the onset of the West African Monsoon.

West Africa, in particular, faces a compound challenge. The region's population is projected to more than double by 2050 (United Nations, 2022), with much of this growth concentrated in rapidly urbanising cities where the Urban Heat Island (UHI) effect amplifies ambient temperatures by 2–5°C relative to surrounding rural areas (Oke, 1982; Ayanlade, 2017). The expansion of impervious surfaces, reduced vegetation cover, waste heat from energy consumption, and altered urban geometries all contribute to making cities significantly hotter than the climate data alone would suggest. Lagos, already one of the fastest-growing megacities in the world, exemplifies this dynamic.

### 1.1.3 Nigeria's Climatic Diversity and Heat Stress

Nigeria's climate is governed by the interaction between two air masses: the warm, moist tropical maritime (mT) air mass originating over the Atlantic Ocean, and the hot, dry tropical continental (cT) air mass originating over the Sahara Desert (Adefolalu, 1986). The boundary between these two air masses — the Inter-Tropical Discontinuity (ITD), often referred to as the Inter-Tropical Convergence Zone (ITCZ) at altitude — migrates seasonally across Nigeria, reaching its northernmost position near 20°N in July–August and retreating to approximately 5°N by December–January. This migration defines the wet and dry seasons across the country and creates the latitudinal gradient of ecological zones that characterises Nigeria's climate.

Three primary ecological zones are relevant to this study:

1. **The Tropical Rainforest / Mangrove Zone (South):** Characterised by high annual rainfall (>1,500 mm), persistently high relative humidity (often >80%), and a compressed diurnal temperature range (DTR). Maximum temperatures rarely exceed 35°C, but the combination of moderate temperatures and extreme humidity produces high perceived heat stress. Nocturnal cooling is minimal due to the maritime influence of the Atlantic Ocean, resulting in high Tropical Night frequency.

2. **The Guinea Savanna Zone (Middle Belt):** A transitional zone with a distinct wet season (April–October) and dry season (November–March). The ITD crosses this region twice annually, producing a dynamic shift in the dominant heat stress mechanism: dry-season heat is characterised by high temperatures and low humidity (similar to the Sahel), while wet-season heat is characterised by moderate temperatures compounded by rising humidity (similar to the south).

3. **The Sudan-Sahel Savanna Zone (North):** Characterised by low annual rainfall (<800 mm in the far north), extreme maximum temperatures (frequently exceeding 40°C during March–May), high solar radiation, and a wide DTR. Relative humidity is low, particularly during the Harmattan (December–February) when the hot, dry cT air mass dominates. Heat stress in this zone is driven primarily by extreme absolute temperature rather than humidity compounding.

This diversity means that no single thermal index or threshold can fully characterise heat stress across all of Nigeria without careful attention to the distinct physical mechanisms operating in each zone.

### 1.1.4 Heat Stress as a Compound Hazard

The recognition that heat stress is a compound hazard — dependent on the simultaneous interaction of temperature, humidity, wind speed, and radiative load — has evolved substantially over the past five decades. Steadman (1979) was among the first to formalise this understanding in a quantitative index, developing a model that estimated the apparent temperature experienced by a human subject under specified environmental conditions. The Rothfusz (1990) regression subsequently operationalised Steadman's work into the polynomial equation adopted by the U.S. National Weather Service (NWS) for heat advisory issuance.

However, the raw Rothfusz regression has known limitations at boundary extremes. The NWS itself applies conditional adjustments to the polynomial output: a downward correction under low-humidity conditions (RH < 13%) where evaporative cooling is efficient, and an upward correction under high-humidity conditions (RH > 85%) where evaporative cooling fails (NWS, 2014). This study implements the complete NWS conditional logic tree, not merely the Rothfusz polynomial in isolation, ensuring that the computed Heat Index accurately reflects the distinct humidity regimes across Nigerian ecological zones.

More recently, the scientific community has turned attention to absolute survivability limits. Sherwood and Huber (2010) demonstrated that a sustained Wet Bulb Temperature (Tw) of 35°C represents the thermodynamic ceiling beyond which human thermoregulation fails regardless of behavioural adaptation. Raymond et al. (2020) subsequently documented that localised exceedances of Tw = 33°C have already been observed in coastal subtropical regions. This study tracks the Stull (2011) empirical Wet Bulb Temperature as a parallel survivability metric, complementing the Heat Index's focus on perceived discomfort with a hard biophysical limit.

### 1.1.5 ERA5-Land Reanalysis as a Research Tool

The primary data source for this study is the ERA5-Land dataset produced by the European Centre for Medium-Range Weather Forecasts (ECMWF) under the European Union's Copernicus Climate Change Service. ERA5-Land is a land-surface reanalysis at 0.1° × 0.1° spatial resolution (~9 km), providing hourly and daily aggregated fields of temperature, humidity, precipitation, and other surface variables from 1950 to near-real-time (Muñoz-Sabater et al., 2021).

Reanalysis datasets occupy a unique position in climate research. They are not raw observational records, nor are they pure model outputs. Rather, they are produced by assimilating all available historical observations — from surface weather stations, radiosondes, ships, buoys, aircraft, and satellites — into a numerical weather prediction model using data assimilation techniques. The result is a physically consistent, spatially complete, temporally continuous gridded dataset that fills the observational gaps inherent in station networks, particularly in data-sparse regions such as Nigeria (Hersbach et al., 2020).

ERA5-Land is chosen for this study because it offers significantly higher spatial resolution than the standard ERA5 atmospheric reanalysis (0.25°) and captures land-surface processes such as soil moisture feedbacks that influence near-surface temperature and humidity. For a study focused on city-scale heat stress across Nigeria's ecological zones, this resolution provides meaningful spatial discrimination that coarser global datasets cannot achieve.

---

## 1.2 Statement of Research Problem

Despite the established understanding that West Africa is among the most heat-vulnerable regions globally, a significant gap persists in the scientific literature regarding the long-term characterisation and future projection of heat stress specifically within Nigeria. Several critical deficiencies define this gap:

**First**, the majority of existing climate studies on Nigeria focus on temperature trends, rainfall variability, or drought indices. While these are important, they do not address the compound nature of heat stress, which depends critically on the simultaneous interaction of temperature and humidity. A study reporting that temperatures in Kano are rising by 0.3°C per decade, while accurate, fails to capture the physiological significance of that warming when combined with concurrent changes in humidity. Heat stress indices such as the Heat Index, which integrate both variables, have been applied extensively in temperate and subtropical regions but remain underutilised in analyses of Nigerian climate.

**Second**, no published study has performed a multi-decade, zone-comparative analysis of heat stress across Nigeria's ecological gradient using high-resolution reanalysis data. Existing studies tend to focus on individual cities or regions in isolation, precluding the cross-zonal comparison necessary to identify how heat stress mechanisms differ between the humid south, the transitional middle belt, and the arid north. The absence of such a comparative framework limits the ability of policymakers to design region-specific adaptation strategies.

**Third**, the application of the Heat Index in tropical settings has often been methodologically flawed. Previous studies have naively paired daily maximum temperature with daily average relative humidity — a pairing that violates the fundamental inverse relationship between temperature and relative humidity at sub-daily timescales. Because relative humidity peaks at night (when temperature is lowest) and reaches its minimum during peak daytime heating, using the daily average RH with the daily maximum temperature artificially inflates the humidity component and overestimates the true daytime Heat Index. This study corrects this error through strict temporal pairing, deriving the humidity at the time of maximum temperature from the dewpoint using thermodynamic first principles.

**Fourth**, future projections of heat stress for Nigerian cities under modern Shared Socioeconomic Pathway (SSP) scenarios are largely absent from the literature. While global-scale studies such as Coffel et al. (2018) and Mora et al. (2017) have projected the global expansion of dangerous heat, these analyses operate at coarse resolution and do not resolve Nigeria's ecological zones individually. This study applies the Delta Method to CMIP6 ensemble data to generate zone-specific projections of Heat Index, Danger Day frequency, Tropical Night frequency, and Wet Bulb Temperature to 2060.

**Fifth**, no existing study on Nigerian heat stress incorporates the Wet Bulb Temperature as a survivability metric. While the Heat Index captures perceived discomfort, it does not identify the absolute thermodynamic limit at which human survival becomes impossible. Given that Lagos, as a humid coastal megacity, may approach the 35°C Wet Bulb threshold faster than the hotter but drier Kano, tracking this metric is essential for long-term risk assessment.

In summary, this study addresses the need for a comprehensive, methodologically rigorous, multi-decade, zone-comparative analysis of heat stress in Nigeria that integrates modern biometeorology indices, corrects known methodological errors in previous work, and provides the first city-specific future projections of heat stress hazards and survivability limits under SSP scenarios to 2060.

---

## 1.3 Research Questions

This study seeks to answer the following research questions:

1. What are the historical trends in Heat Index magnitude, Danger Day frequency (HI ≥ 41°C), and Tropical Night frequency (Tmin ≥ 20°C) across Nigeria's three primary ecological zones over the period 1980–2025?

2. How do the dominant mechanisms of heat stress differ between the humid tropical coast (Lagos), the transitional Guinea Savanna (Abuja), and the semi-arid Sahel (Kano), and how is this reflected in the distribution of NWS Heat Index algorithm branches applied to each city?

3. How has the Wet Bulb Temperature evolved across the three zones over the historical period, and which zone is approaching the 35°C thermodynamic survivability limit most rapidly?

4. Under the SSP2-4.5 (moderate mitigation) and SSP5-8.5 (high emissions) scenarios, what is the projected escalation of Danger Day frequency, Tropical Night frequency, and peak Wet Bulb Temperature for each ecological zone by 2060?

5. Which ecological zone faces the greatest absolute heat stress risk by 2060, and which zone exhibits the fastest rate of change in heat stress indicators?

---

## 1.4 Aim and Objectives

### 1.4.1 Aim

The aim of this study is to characterise historical trends in heat stress across Nigeria's three primary ecological zones over the period 1980–2025, and to project the escalation of heat stress hazards and survivability limits under SSP2-4.5 and SSP5-8.5 emissions scenarios to 2060, using high-resolution ERA5-Land reanalysis data, the complete NWS Heat Index conditional logic tree, and the Stull (2011) Wet Bulb Temperature.

### 1.4.2 Specific Objectives

The specific objectives of this study are:

1. **To quantify historical trends in heat stress:** Analyse the magnitude and frequency of the Heat Index, Danger Days (HI ≥ 41°C), Tropical Nights (Tmin ≥ 20°C), and Wet Bulb Temperature in Lagos, Abuja, and Kano using 46 years of ERA5-Land daily data (1980–2025), applying the Mann-Kendall trend test and Sen's Slope estimator to determine the statistical significance and rate of change of each metric.

2. **To characterise zone-specific heat stress mechanisms:** Identify the dominant heat stress pathway in each ecological zone by analysing the distribution of NWS Heat Index algorithm branches (Simple HI, Standard Rothfusz, Low Humidity Adjustment, High Humidity Adjustment) and by comparing the relative contributions of daytime extremes (Danger Days) versus nocturnal heat retention (Tropical Nights) across zones.

3. **To project future heat stress under SSP scenarios:** Simulate the escalation of Danger Day frequency, Tropical Night frequency, and peak Wet Bulb Temperature under SSP2-4.5 and SSP5-8.5 to 2060 using the Delta Method applied to CMIP6 multi-model ensemble data, reporting ensemble means with 10th–90th percentile uncertainty bounds.

4. **To evaluate survivability risk:** Track the trajectory of the Stull Wet Bulb Temperature across all three zones relative to the 35°C thermodynamic survivability limit, identifying which zone approaches this threshold most rapidly and the projected year of exceedance under each scenario.

5. **To validate reanalysis performance:** Compare ERA5-Land outputs against available surface station observations (NiMet synoptic data or NOAA GSOD records) for the three study cities, computing Mean Bias Error (MBE), Root Mean Square Error (RMSE), and Pearson correlation coefficient to quantify reanalysis accuracy and apply bias corrections where necessary.

---

## 1.5 Justification of Research

The justification for this study rests on five interconnected pillars: scientific, public health, economic, policy, and methodological.

### 1.5.1 Scientific Justification

The existing body of research on heat stress in Nigeria is fragmented, geographically limited, and methodologically inconsistent. Temperature trend studies for Nigerian cities exist (e.g., Oguntunde et al., 2012; Ayanlade, 2017), but these predominantly examine raw temperature without computing compound heat stress indices that account for humidity's critical role in human thermoregulation. The few studies that do compute Heat Index values typically employ the raw Rothfusz regression without the NWS conditional adjustments, and nearly all use the thermodynamically incorrect pairing of daily maximum temperature with daily average relative humidity. This study addresses these deficiencies by implementing the full NWS decision tree with strict temporal pairing, producing the most methodologically robust heat stress analysis of Nigerian climate to date.

Furthermore, no published study has simultaneously analysed heat stress trends across all three of Nigeria's primary ecological zones within a single consistent analytical framework. By applying identical metrics, thresholds, and statistical methods to Lagos, Abuja, and Kano, this study enables direct cross-zonal comparison — revealing not only the absolute magnitude of heat stress in each zone but also the relative rate of change and the distinct physical mechanisms driving heat stress in each climatic regime.

### 1.5.2 Public Health Justification

Heat stress is a direct killer. The World Health Organization estimates that between 2000 and 2019, approximately 489,000 heat-related excess deaths occurred annually worldwide (WHO, 2023). Mora et al. (2017) identified 27 specific ways in which extreme heat can kill a human being, from cardiovascular failure to renal shutdown to cytokine-mediated systemic inflammation. For Nigeria, where large populations lack access to air conditioning, mechanical cooling, or even reliable electricity to power fans, the physiological burden of rising heat stress falls disproportionately on the most vulnerable: outdoor labourers, subsistence farmers, the elderly, young children, and pregnant women.

The tracking of Wet Bulb Temperature in this study adds a survivability dimension absent from previous Nigerian heat research. While current Wet Bulb values in Lagos peak at approximately 28°C — still 7°C below the 35°C lethality threshold — the trajectory of this metric under high-emission scenarios determines whether mid-century Lagos will remain physiologically habitable for outdoor labour without technological intervention.

### 1.5.3 Economic Justification

Agriculture contributes approximately 24% of Nigeria's gross domestic product and employs over 36% of the labour force, the vast majority of whom work outdoors without access to cooling infrastructure (National Bureau of Statistics, 2022). Rising heat stress directly reduces agricultural labour productivity: as the Heat Index exceeds the Danger threshold of 41°C, manual work must be curtailed or halted to prevent heat-related illness. Kjellstrom et al. (2016) estimated that heat-related labour productivity losses in West Africa could reach 5% of GDP by mid-century under high-emission scenarios. This study's Danger Day projections provide city-specific estimates of the number of days per year on which outdoor labour capacity is impaired, directly informing economic impact assessments.

The construction sector, which operates almost entirely outdoors in Nigerian cities, faces similar exposure. In Kano, where Danger Day counts are already measurable and projected to increase, quantifying the temporal distribution and trend of extreme heat days enables labour scheduling and occupational health policy formulation.

### 1.5.4 Policy Justification

Nigeria's National Adaptation Plan and its contributions to the Paris Agreement under the Nationally Determined Contributions (NDCs) require evidence-based assessments of climate risks. However, the country's climate policy framework currently lacks high-resolution, zone-specific heat stress projections. National-level statistics mask the fundamental differences between the humid south and the arid north, leading to one-size-fits-all adaptation strategies that may be poorly suited to the distinct heat mechanisms operating in each zone.

This study provides the disaggregated, zone-specific evidence that effective adaptation planning requires. A heat action plan for Lagos must prioritise nocturnal cooling and indoor ventilation (given the dominance of Tropical Nights), while a plan for Kano must prioritise daytime shade provision and hydration (given the dominance of Danger Days). These distinctions cannot emerge from national averages.

### 1.5.5 Methodological Justification

This study introduces three methodological advances that have not previously been applied to Nigerian heat stress research:

1. **Strict temporal pairing** of maximum temperature with dewpoint for humidity derivation (correcting the thermodynamic error present in prior work).

2. **Full NWS conditional logic tree** implementation (replacing the naive application of the Rothfusz polynomial in isolation and enabling algorithm-branch diagnostics per zone).

3. **Stull Wet Bulb Temperature tracking** as a parallel survivability metric (complementing the Heat Index's focus on discomfort with a hard biophysical limit).

These advances are not merely technical refinements; they alter the magnitude, trend, and interpretation of the results. The temporal pairing correction alone is expected to reduce computed daytime relative humidity by 10–20% in many cases, which propagates through the Heat Index calculation to change Danger Day counts. Documenting these corrections and their impact contributes to the methodological literature on tropical heat stress assessment.

---

## 1.6 Scope of Study

This study is bounded by the following parameters:

**Temporal Scope:** The historical analysis covers the 46-year period from 1 January 1980 to 31 December 2025, selected to provide a multi-decadal baseline that captures the accelerating warming trend of the late 20th and early 21st centuries. The future projection period covers 2026 to 2060, providing a 35-year forward outlook to the mid-21st century under two Shared Socioeconomic Pathway scenarios (SSP2-4.5 and SSP5-8.5). The year 2025 serves as the strict boundary between observed and projected data, ensuring no temporal overlap between reanalysis and model output.

**Spatial Scope:** The study focuses on three cities representing Nigeria's three primary ecological zones: Lagos (Tropical Rainforest / Mangrove zone, 6.52°N, 3.38°E), Abuja (Guinea Savanna zone, 9.06°N, 7.50°E), and Kano (Sudan-Sahel Savanna zone, 12.00°N, 8.52°E). Each city is represented by the ERA5-Land grid cell nearest to its documented coordinates. The study does not cover the full national territory; the three-city approach is a representative zonal strategy justified in Section 1.1.3.

**Variable Scope:** The primary input variables are daily maximum temperature at 2 metres (Tmax), daily minimum temperature at 2 metres (Tmin), and daily average dewpoint temperature at 2 metres (Td), all extracted from the ERA5-Land dataset. Derived variables include Relative Humidity at Tmax (computed via the August-Roche-Magnus approximation), Heat Index (via the NWS conditional logic tree), and Wet Bulb Temperature (via the Stull 2011 formula).

**Metric Scope:** The study quantifies five primary metrics:
1. **Heat Index (°C)** — perceived thermal load, daily maximum
2. **Danger Days (count/year)** — days where HI ≥ 41°C
3. **Tropical Nights (count/year)** — nights where Tmin ≥ 20°C (all cities) and Tmin ≥ 25°C (Lagos only)
4. **Wet Bulb Temperature (°C)** — annual maximum Tw for survivability tracking
5. **Trend statistics** — Mann-Kendall τ, p-value, and Sen's Slope per decade

**Exclusions:** This study does not include wind speed or solar radiation as input variables due to their limited availability at consistent quality across the full 46-year ERA5-Land record for the selected grid cells. Consequently, more complex thermal indices such as the Wet Bulb Globe Temperature (WBGT), Universal Thermal Climate Index (UTCI), and Physiologically Equivalent Temperature (PET) are not computed. The implications of this exclusion are discussed in Section 1.8.

---

## 1.7 Definition of Unfamiliar Terms

**Heat Index (HI):** A composite index that combines air temperature and relative humidity to estimate the apparent temperature perceived by the human body. Developed by Steadman (1979) and operationalised by Rothfusz (1990). Values are expressed in degrees Celsius (°C). Higher Heat Index values indicate greater perceived thermal discomfort and physiological danger.

**Danger Day:** A day on which the computed Heat Index equals or exceeds 41°C (equivalent to 105°F). At this threshold, defined by the U.S. National Weather Service as the "Danger" category, heat cramps and heat exhaustion are likely, and heatstroke is probable with sustained exposure. This study uses this threshold as a binary classifier for extreme daytime heat stress events.

**Tropical Night:** A night on which the minimum temperature (Tmin) does not fall below 20°C, as defined by the World Meteorological Organization (WMO). Tropical Nights represent a failure of nocturnal cooling: the body requires nighttime temperature relief to recover from daytime heat stress, and persistent overnight warmth prevents this recovery. A secondary threshold of 25°C is applied to Lagos to account for the elevated baseline nocturnal temperatures in the humid coastal zone.

**Wet Bulb Temperature (Tw):** The lowest temperature that can be achieved by evaporating water into the air at constant pressure. It reflects the combined effect of temperature and humidity on evaporative cooling potential. A sustained Tw of 35°C represents the absolute thermodynamic limit of human survivability: at this point, evaporative cooling through perspiration ceases entirely, and death from hyperthermia follows within hours regardless of shade, hydration, fitness, or acclimatisation. Computed using the Stull (2011) empirical formula.

**Reanalysis:** A systematic approach to producing a consistent, spatially complete historical climate dataset by combining past meteorological observations with a numerical weather prediction model using data assimilation techniques. Unlike raw station records, reanalysis fills spatial and temporal gaps with physically constrained estimates.

**ERA5-Land:** The fifth-generation land-surface reanalysis produced by the European Centre for Medium-Range Weather Forecasts (ECMWF) under the Copernicus Climate Change Service. It provides hourly and daily aggregated variables at 0.1° × 0.1° spatial resolution (~9 km) globally from 1950 to near-real-time. The primary data source for this study.

**CMIP6 (Coupled Model Intercomparison Project Phase 6):** An international collaborative framework under which over 100 climate modelling groups run standardised experiments to project future climate under various scenarios. CMIP6 outputs form the scientific basis for the IPCC AR6 projections.

**Shared Socioeconomic Pathways (SSPs):** Scenarios of projected socioeconomic global development used in CMIP6 to drive greenhouse gas emissions trajectories. This study uses SSP2-4.5 (a middle-of-the-road pathway with moderate mitigation, leading to approximately 2.7°C warming by 2100) and SSP5-8.5 (a fossil-fuel-intensive pathway with minimal mitigation, leading to approximately 4.4°C warming by 2100).

**Delta Method:** A statistical downscaling technique that transfers the climate change signal (the "delta" or anomaly) from coarse-resolution climate models onto a high-resolution observational baseline. Formula: Projected = ERA5_baseline + (CMIP6_future_mean − CMIP6_historical_mean). This preserves the local detail of ERA5 while incorporating the trend signal from CMIP6.

**Mann-Kendall Test:** A non-parametric statistical test for detecting monotonic trends in time series data. It makes no assumption about the distribution of the data, making it suitable for environmental variables that are often skewed or contain outliers. The test produces Kendall's tau (τ) and a p-value indicating statistical significance.

**Sen's Slope Estimator:** A non-parametric estimator of the rate of change (slope) in a time series, calculated as the median of all pairwise slopes between data points. Robust to outliers and commonly reported alongside the Mann-Kendall test. In this study, Sen's Slope is reported in units of °C per decade or days per decade.

**Inter-Tropical Discontinuity (ITD):** The boundary at the Earth's surface between the warm, moist tropical maritime air mass from the Atlantic Ocean and the hot, dry tropical continental air mass from the Sahara Desert. Its seasonal northward and southward migration across Nigeria defines the onset and cessation of the rainy season and modulates the dominant heat stress mechanism in the middle belt.

**Diurnal Temperature Range (DTR):** The difference between the daily maximum temperature (Tmax) and the daily minimum temperature (Tmin). A compressed DTR indicates poor nocturnal cooling (as observed in Lagos), while a wide DTR indicates significant day-night temperature differences (as observed in Kano).

**Rothfusz Regression:** The nine-coefficient polynomial regression developed by Rothfusz (1990) to compute the Heat Index from air temperature (°F) and relative humidity (%). It forms the core computational engine of the NWS Heat Index, but requires conditional adjustments at humidity extremes to produce accurate results.

**August-Roche-Magnus Approximation:** A widely used empirical formula relating saturation vapour pressure to temperature, enabling the derivation of relative humidity from temperature and dewpoint temperature. This study uses the Alduchov and Eskridge (1996) coefficients (a = 17.625, b = 243.04°C), which provide accuracy to within ±0.4% over the temperature range relevant to this study.

---

## 1.8 Research Limitations

This study acknowledges the following limitations:

**1. Steadman Reference Subject:** All Heat Index values in this study are computed for the Steadman (1979) reference subject: a 1.7 m, 67 kg adult walking at 1.4 m/s in shade with light clothing and a light breeze. This reference does not represent the conditions experienced by Nigerian outdoor workers, who typically perform sustained manual labour in direct sunlight with heavier clothing and higher metabolic heat production. Solar radiation alone can add 5–15°C to the effective radiant temperature, meaning that the computed Heat Index systematically underestimates the true physiological load. All HI values in this study should therefore be interpreted as a conservative lower bound of actual thermal stress.

**2. Three-City Representativeness:** The study uses three cities to represent three ecological zones. While this approach captures the major climatic contrasts across Nigeria's latitudinal gradient, it does not resolve intra-zonal variability. Coastal cities other than Lagos (e.g., Port Harcourt, Calabar) may exhibit different humidity profiles; cities in the Jos Plateau experience significantly cooler temperatures due to altitude; and the extreme northeast (Borno, Yobe) may experience more severe dry heat than Kano. The three-city approach is a representative zonal strategy, not a comprehensive national assessment.

**3. ERA5-Land Resolution and Bias:** Despite being the highest-resolution global reanalysis available, ERA5-Land at ~9 km resolution does not capture urban-scale features such as the Urban Heat Island effect, which can elevate temperatures in dense urban cores by 2–5°C above the surrounding landscape. ERA5-Land also exhibits known cold biases over West Africa, particularly in the Sahel (Gleixner et al., 2020), which may lead to underestimation of temperature-driven heat stress in Kano. Bias correction against surface station data (NiMet or GSOD) is planned but not yet executed at the time of writing.

**4. Exclusion of Wind and Radiation:** The Heat Index formulation used in this study requires only temperature and humidity as inputs. More comprehensive indices such as the Wet Bulb Globe Temperature (WBGT), Universal Thermal Climate Index (UTCI), and Physiologically Equivalent Temperature (PET) additionally incorporate wind speed and solar radiation, which are relevant to outdoor heat stress. These indices were excluded because consistent, quality-controlled wind speed and radiation data are not available at daily resolution across the full 46-year ERA5-Land record for all three city grid cells.

**5. Delta Method Stationarity:** The Delta Method assumes that the bias between the reanalysis and the climate model remains stationary over time — that is, the relationship observed during the historical period holds into the future. This assumption may not be valid under strongly non-linear climate changes, particularly if future warming triggers feedback mechanisms (such as soil moisture-temperature feedbacks or vegetation die-off) that alter the regional climate regime qualitatively. This limitation is inherent to all delta-based downscaling approaches and is shared with the broader literature.

**6. CMIP6 Model Uncertainty:** Future projections are derived from an ensemble of CMIP6 models. While ensemble methods reduce the influence of individual model biases, the spread among models introduces irreducible uncertainty. The 10th–90th percentile range reported in this study captures this uncertainty but does not account for scenarios outside the CMIP6 ensemble range.

---

## 1.9 Study Area

### 1.9.1 Nigeria: Geographic and Climatic Overview

The Federal Republic of Nigeria is situated in West Africa between latitudes 4°16'N and 13°53'N and longitudes 2°40'E and 14°41'E. The country covers an area of approximately 923,768 km² and shares land borders with the Republic of Benin to the west, the Republics of Niger and Chad to the north, and the Republic of Cameroon to the east. The southern boundary is formed by the approximately 853 km coastline along the Gulf of Guinea in the Atlantic Ocean.

Nigeria's topography ranges from low-lying coastal plains and mangrove swamps in the south, through undulating terrain and the Niger-Benue river valley in the middle belt, to the elevated Jos Plateau (approximately 1,200–1,400 m above sea level) and the semi-arid plains of the northern Sahel. The terrain influences local climate through orographic effects, drainage patterns, and vegetation cover.

The country's climate is governed primarily by the seasonal interaction of two air masses: the warm, moist tropical maritime (mT) air mass from the south-southwest, originating over the Atlantic Ocean, and the hot, dry tropical continental (cT) air mass from the north-northeast, originating over the Sahara Desert. The boundary between these air masses at the surface — the Inter-Tropical Discontinuity (ITD) — migrates northward during the boreal summer and southward during the boreal winter, determining the onset and cessation of the rainy season across the country (Adefolalu, 1986; Ayanlade and Drake, 2016).

Nigeria's mean annual temperature ranges from approximately 26°C in the southern coast to over 30°C in the northern interior, with extreme daily maxima exceeding 45°C in parts of the northeast during the pre-monsoon heat buildup (March–May). Rainfall ranges from over 3,000 mm annually in the Niger Delta to less than 500 mm in the extreme northeast. This climatic gradient creates the three primary ecological zones targeted by this study.

### 1.9.2 Lagos (Tropical Rainforest / Mangrove Zone)

**Coordinates:** 6.52°N, 3.38°E
**Elevation:** Approximately 41 m above sea level
**Population:** Estimated 16–21 million in the metropolitan area (Lagos Bureau of Statistics, 2020)
**Ecological Zone:** Tropical Rainforest and Mangrove / Freshwater Swamp

Lagos is Nigeria's largest city and the economic capital of West Africa. It is situated on the southwestern coast of Nigeria, on the shores of the Lagos Lagoon and the Bight of Benin. The city's climate is classified as tropical wet (Am) under the Köppen-Geiger system, characterised by high temperatures year-round (mean annual temperature ~27°C), very high relative humidity (frequently exceeding 80%), and a bimodal rainfall pattern with peaks in June and September.

The maritime influence of the Atlantic Ocean moderates Lagos's maximum temperatures — daily Tmax rarely exceeds 35°C — but sustains high humidity levels that compress the diurnal temperature range (DTR) to approximately 4–7°C. This means that nocturnal cooling is minimal: minimum temperatures typically remain above 23–25°C, producing a near-continuous state of Tropical Nights by the WMO definition.

For heat stress analysis, Lagos represents the **chronic wet heat** archetype. Heat stress in this zone is driven not by extreme daytime temperatures but by the compound effect of moderate temperatures and persistently high humidity, which impairs evaporative cooling. The Heat Index may not reach the Danger threshold of 41°C on most days, but the sustained absence of nocturnal relief and the elevated Wet Bulb Temperature create a chronic physiological burden that accumulates over days and weeks. Lagos is the city most likely to approach Wet Bulb survivability limits under high-emission scenarios due to its humidity profile.

### 1.9.3 Abuja (Guinea Savanna Zone)

**Coordinates:** 9.06°N, 7.50°E
**Elevation:** Approximately 476 m above sea level
**Population:** Estimated 3.6 million in the Federal Capital Territory (NBS, 2022)
**Ecological Zone:** Guinea Savanna

Abuja, the capital city of Nigeria, is located in the central part of the country within the Guinea Savanna belt. Its climate is classified as tropical savanna (Aw) under the Köppen-Geiger system, with a distinct wet season (April–October) and dry season (November–March). Mean annual temperature is approximately 26–28°C, with maximum temperatures reaching 37–39°C during the March–April pre-monsoon heat buildup.

Abuja's position in the Guinea Savanna places it directly in the path of the ITD's seasonal migration. During the dry season, when the ITD has retreated south of Abuja, the city experiences hot, dry conditions dominated by the continental air mass, with low humidity and high solar radiation. As the ITD migrates northward through Abuja during the onset of the wet season, humidity rises sharply and the dominant heat stress mechanism shifts from dry heat to humid heat. This seasonal switching makes Abuja a natural laboratory for observing how the same city can experience fundamentally different heat stress regimes within a single annual cycle.

For heat stress analysis, Abuja represents the **transitional** archetype. The NWS Heat Index algorithm is expected to dynamically switch between different computational branches (low-humidity adjustment during the Harmattan, standard Rothfusz during the transitional periods, and potentially the high-humidity adjustment during peak wet season). This makes Abuja the city where the full NWS conditional logic tree provides the greatest analytical value compared to the simple Rothfusz regression.

### 1.9.4 Kano (Sudan-Sahel Savanna Zone)

**Coordinates:** 12.00°N, 8.52°E
**Elevation:** Approximately 472 m above sea level
**Population:** Estimated 4.1 million in the metropolitan area (NBS, 2022)
**Ecological Zone:** Sudan Savanna transitioning to Sahel in the northern hinterland

Kano is the largest city in northern Nigeria and the second most populous metropolitan area in the country. It is situated in the Sudan Savanna zone, near the boundary with the Sahel, at approximately 12°N latitude. Its climate is classified as tropical semi-arid / hot steppe (BSh) under the Köppen-Geiger system, characterised by a short, intense wet season (June–September), a long dry season, and extreme temperature variability.

Maximum temperatures in Kano regularly exceed 40°C during the pre-monsoon months of March–May, with occasional exceedances above 44°C documented in ERA5-Land records. The dry season, particularly the Harmattan period (December–February), is characterised by extremely low humidity (RH often below 15%) driven by the dominance of the dry continental air mass and the advection of dust-laden Saharan air. The diurnal temperature range in Kano is wide — typically 12–18°C — meaning that significant nocturnal cooling occurs even on days of extreme daytime heat.

For heat stress analysis, Kano represents the **acute dry heat** archetype. Heat stress in this zone is driven by extreme absolute temperatures rather than humidity compounding. The NWS low-humidity adjustment (applied when RH < 13% and T is between 80–112°F) is expected to activate frequently during the Harmattan and pre-monsoon periods, reducing the computed Heat Index below the raw Rothfusz output to reflect the enhanced evaporative cooling available in dry conditions. Despite lower humidity, Kano is the only city in this study that consistently registers Danger Days (HI ≥ 41°C) in the historical record, because its absolute maximum temperatures are sufficiently extreme to push the Heat Index above the Danger threshold even after the dry-heat correction.

---

*End of Chapter One*

---

*(Chapter Two: Literature Review and Conceptual Framework — to follow)*
