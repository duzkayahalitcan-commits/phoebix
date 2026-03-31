import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import { julian, moonposition, nutation, planetposition, sidereal, base } from 'astronomia'
// @ts-ignore
import vsop87Dearth from 'astronomia/data/vsop87Dearth'
// @ts-ignore
import vsop87Dmercury from 'astronomia/data/vsop87Dmercury'
// @ts-ignore
import vsop87Dvenus from 'astronomia/data/vsop87Dvenus'
// @ts-ignore
import vsop87Dmars from 'astronomia/data/vsop87Dmars'
// @ts-ignore
import vsop87Djupiter from 'astronomia/data/vsop87Djupiter'
// @ts-ignore
import vsop87Dsaturn from 'astronomia/data/vsop87Dsaturn'
// @ts-ignore
import vsop87Duranus from 'astronomia/data/vsop87Duranus'
// @ts-ignore
import vsop87Dneptune from 'astronomia/data/vsop87Dneptune'

const SIGNS = [
  'Koç','Boğa','İkizler','Yengeç','Aslan','Başak',
  'Terazi','Akrep','Yay','Oğlak','Kova','Balık',
]
const SIGNS_EN = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
]

function normDeg(d: number) { return ((d % 360) + 360) % 360 }

function geocentricEclipticLon(
  planet: any, earth: any, jde: number, nextJde: number
): { lon: number; retrograde: boolean } {
  function calcLon(j: number) {
    const p = planet.position(j)
    const e = earth.position(j)
    const px = p.range * Math.cos(p.dec) * Math.cos(p.ra)
    const py = p.range * Math.cos(p.dec) * Math.sin(p.ra)
    const ex = e.range * Math.cos(e.dec) * Math.cos(e.ra)
    const ey = e.range * Math.cos(e.dec) * Math.sin(e.ra)
    return normDeg(Math.atan2(py - ey, px - ex) * 180 / Math.PI)
  }
  const lon = calcLon(jde)
  const lonNext = calcLon(nextJde)
  // retrograde if longitude decreasing (accounting for 0/360 wrap)
  let diff = lonNext - lon
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return { lon, retrograde: diff < 0 }
}

function moonEclipticLon(jde: number, eps: number): number {
  const moon = moonposition.position(jde)
  const ra = moon.ra, dec = moon.dec
  const lon = Math.atan2(
    Math.sin(ra) * Math.cos(eps) + Math.tan(dec) * Math.sin(eps),
    Math.cos(ra)
  )
  return normDeg(lon * 180 / Math.PI)
}

function computeAscendant(jde: number, lat: number, lng: number, eps: number): number {
  // Greenwich Apparent Sidereal Time -> Local Sidereal Time
  const gast = sidereal.apparent(jde) // in radians
  const lst = normDeg(gast * 180 / Math.PI + lng) // degrees
  const ramc = lst * Math.PI / 180 // radians

  const latRad = lat * Math.PI / 180
  // Ascendant ecliptic longitude
  const asc = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps))
  )
  return normDeg(asc * 180 / Math.PI)
}

function computeMC(jde: number, lng: number, eps: number): number {
  const gast = sidereal.apparent(jde)
  const lst = normDeg(gast * 180 / Math.PI + lng)
  const ramc = lst * Math.PI / 180
  const mc = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps))
  return normDeg(mc * 180 / Math.PI)
}

export async function POST(req: NextRequest) {
  const { date, time, lat, lng } = await req.json()

  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const utDecimalDay = day + (hour + minute / 60) / 24

  const jde = julian.CalendarGregorianToJD(year, month, utDecimalDay)
  const jdeNext = jde + 1

  const eps = nutation.meanObliquity(jde) // radians

  const earth = new planetposition.Planet(vsop87Dearth)

  // Sun geocentric (= Earth heliocentric lon + 180°)
  const ePos = earth.position(jde)
  const ePosNext = earth.position(jdeNext)
  const sunLon = normDeg(ePos.ra * 180 / Math.PI + 180)
  const sunLonNext = normDeg(ePosNext.ra * 180 / Math.PI + 180)
  let sunDiff = sunLonNext - sunLon
  if (sunDiff > 180) sunDiff -= 360; if (sunDiff < -180) sunDiff += 360

  const planetData = [
    {
      key: 'sun', tr: 'Güneş', en: 'Sun', glyph: '☉',
      lon: sunLon, retrograde: false,
      color: '#f5d76e',
    },
    {
      key: 'moon', tr: 'Ay', en: 'Moon', glyph: '☽',
      lon: moonEclipticLon(jde, eps),
      retrograde: false,
      color: '#c4c4e8',
    },
  ]

  const outerPlanets = [
    { key: 'mercury', tr: 'Merkür', en: 'Mercury', glyph: '☿', vsop: vsop87Dmercury, color: '#a0c4ff' },
    { key: 'venus',   tr: 'Venüs',  en: 'Venus',   glyph: '♀', vsop: vsop87Dvenus,   color: '#ffb3ba' },
    { key: 'mars',    tr: 'Mars',   en: 'Mars',     glyph: '♂', vsop: vsop87Dmars,    color: '#ff7b7b' },
    { key: 'jupiter', tr: 'Jüpiter',en: 'Jupiter',  glyph: '♃', vsop: vsop87Djupiter, color: '#ffd9a0' },
    { key: 'saturn',  tr: 'Satürn', en: 'Saturn',   glyph: '♄', vsop: vsop87Dsaturn,  color: '#c8b99a' },
    { key: 'uranus',  tr: 'Uranüs', en: 'Uranus',   glyph: '⛢', vsop: vsop87Duranus,  color: '#9effd8' },
    { key: 'neptune', tr: 'Neptün', en: 'Neptune',  glyph: '♆', vsop: vsop87Dneptune, color: '#90b0ff' },
  ]

  for (const p of outerPlanets) {
    const planet = new planetposition.Planet(p.vsop)
    const { lon, retrograde } = geocentricEclipticLon(planet, earth, jde, jdeNext)
    planetData.push({ key: p.key, tr: p.tr, en: p.en, glyph: p.glyph, lon, retrograde, color: p.color })
  }

  const ascendant = computeAscendant(jde, lat, lng, eps)
  const mc = computeMC(jde, lng, eps)

  const result = {
    planets: planetData.map(p => ({
      ...p,
      signIndex: Math.floor(p.lon / 30),
      signTr: SIGNS[Math.floor(p.lon / 30)],
      signEn: SIGNS_EN[Math.floor(p.lon / 30)],
      degree: p.lon % 30,
    })),
    ascendant,
    ascendantSign: SIGNS[Math.floor(ascendant / 30)],
    ascendantSignEn: SIGNS_EN[Math.floor(ascendant / 30)],
    mc,
    mcSign: SIGNS[Math.floor(mc / 30)],
    mcSignEn: SIGNS_EN[Math.floor(mc / 30)],
  }

  return NextResponse.json(result)
}
