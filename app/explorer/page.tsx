'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState, useRef, Suspense  } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import * as d3 from 'd3-geo'
// @ts-ignore
import * as topojson from 'topojson-client'
import {
  IconHome, IconPlayerPlay, IconCompass, IconUser,
  IconSearch, IconAdjustmentsHorizontal, IconX,
  IconChevronRight, IconCheck, IconSchool, IconArrowUp
} from '@tabler/icons-react'

const ACCENT = '#E8501A'
const NAV = [
  { href: '/',         icon: IconHome,       label: 'Accueil' },
  { href: '/feed',     icon: IconPlayerPlay, label: 'Feed' },
  { href: '/explorer', icon: IconCompass,    label: 'Explorer' },
  { href: '/profil',   icon: IconUser,       label: 'Profil' },
]

const PAYS_INFO: Record<string, { coords: [number, number]; label: string }> = {
  'Cameroun':      { coords: [12.3, 4.0],   label: 'Cameroun' },
  'Sénégal':       { coords: [-14.5, 14.5], label: 'Sénégal' },
  "Côte d'Ivoire": { coords: [-5.5, 7.5],   label: "Côte d'Ivoire" },
  'Maroc':         { coords: [-6.0, 31.8],  label: 'Maroc' },
  'Burkina Faso':  { coords: [-1.5, 12.3],  label: 'Burkina' },
}

const DOMAINES = ['ingenierie', 'informatique', 'business', 'sante', 'droit', 'agriculture', 'sciences']
const AFRICA_BOUNDS = { minLon: -18, maxLon: 52, minLat: -35, maxLat: 38 }
const svgWidth = 380
const svgHeight = 420

function ExplorerInner() {
  const [ecoles, setEcoles] = useState<any[]>([])
  const [filtrees, setFiltrees] = useState<any[]>([])
  const [paysCounts, setPaysCounts] = useState<Record<string, number>>({})
  const [paysSelectionne, setPaysSelectionne] = useState<string | null>(null)
  const [recherche, setRecherche] = useState('')
  const [showFiltres, setShowFiltres] = useState(false)
  const [domaine, setDomaine] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const [vue, setVue] = useState<'carte' | 'liste'>(
    searchParams.get('vue') === 'liste' ? 'liste' : 'carte'
    )
  const [paths, setPaths] = useState<{ id: string; d: string }[]>([])
  const [markers, setMarkers] = useState<{ pays: string; x: number; y: number }[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)

  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('ecoles').select('*, formations(id, domaine)').order('nom').then(({ data }) => {
      if (data) {
        setEcoles(data)
        const counts: Record<string, number> = {}
        data.forEach((e: any) => { counts[e.pays] = (counts[e.pays] ?? 0) + 1 })
        setPaysCounts(counts)
      }
    })
  }, [])

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        const projection = d3.geoMercator().center([22, 2]).scale(260).translate([svgWidth / 2, svgHeight / 2])
        const pathGen = d3.geoPath().projection(projection)
        const countries = topojson.feature(world, world.objects.countries)
        const africaFeatures = (countries as any).features.filter((f: any) => {
          try {
            const c = d3.geoCentroid(f)
            return c[0] >= AFRICA_BOUNDS.minLon && c[0] <= AFRICA_BOUNDS.maxLon &&
                   c[1] >= AFRICA_BOUNDS.minLat && c[1] <= AFRICA_BOUNDS.maxLat
          } catch { return false }
        })
        setPaths((africaFeatures as any[])
            .filter((f: any) => f.id !== undefined)
            .map((f: any, i: number) => ({ id: `${String(f.id)}-${i}`, d: pathGen(f) ?? '' }))
          )
        setMarkers(Object.entries(PAYS_INFO).map(([pays, { coords }]) => {
          const [x, y] = projection(coords) ?? [0, 0]
          return { pays, x, y }
        }))
      })
  }, [])

  // Appliquer tous les filtres
  useEffect(() => {
    let result = ecoles
    if (paysSelectionne) result = result.filter(e => e.pays === paysSelectionne)
    if (recherche) result = result.filter(e =>
      e.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      e.ville.toLowerCase().includes(recherche.toLowerCase())
    )
    if (type) result = result.filter(e => e.type === type)
    if (domaine) result = result.filter(e =>
      e.formations?.some((f: any) => f.domaine === domaine)
    )
    setFiltrees(result)
    if (paysSelectionne || recherche || type || domaine) setVue('liste')
  }, [paysSelectionne, recherche, domaine, type, ecoles])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = (e.clientX - lastPos.current.x) * 0.4
    const dy = (e.clientY - lastPos.current.y) * 0.4
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffset(o => ({ x: Math.max(-30, Math.min(30, o.x + dx)), y: Math.max(-30, Math.min(30, o.y + dy)) }))
  }
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const dx = (e.touches[0].clientX - lastPos.current.x) * 0.4
    const dy = (e.touches[0].clientY - lastPos.current.y) * 0.4
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setOffset(o => ({ x: Math.max(-30, Math.min(30, o.x + dx)), y: Math.max(-30, Math.min(30, o.y + dy)) }))
  }

  const handleScroll = () => {
    if (listRef.current) setShowScrollTop(listRef.current.scrollTop > 200)
  }

  const scrollTop = () => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  const nbFiltresActifs = [domaine, type, paysSelectionne].filter(Boolean).length

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* HEADER FIXE */}
      <div style={{ flexShrink: 0, background: '#fff', borderBottom: '0.5px solid #e5e5e5' }}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>Explorer</p>
          <button
            onClick={() => setShowFiltres(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: nbFiltresActifs > 0 ? ACCENT : '#f5f5f5', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', color: nbFiltresActifs > 0 ? '#fff' : '#555', fontSize: '13px', fontWeight: '500' }}
          >
            <IconAdjustmentsHorizontal size={16} />
            Filtres {nbFiltresActifs > 0 ? `(${nbFiltresActifs})` : ''}
          </button>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ background: '#f5f5f5', borderRadius: '6px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSearch size={16} color="#999" />
            <input
              type="text"
              placeholder="Rechercher une école, une ville..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#111', width: '100%' }}
            />
            {recherche && (
              <button onClick={() => setRecherche('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <IconX size={14} color="#999" />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          {(['carte', 'liste'] as const).map(v => (
            <button
              key={v}
              onClick={() => { setVue(v); if (v === 'carte') { setPaysSelectionne(null); setRecherche(''); setDomaine(null); setType(null) } }}
              style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: vue === v ? '600' : '400', color: vue === v ? ACCENT : '#888', borderBottom: vue === v ? `2px solid ${ACCENT}` : '2px solid transparent', cursor: 'pointer' }}
            >
              {v === 'carte' ? 'Carte' : `Liste${filtrees.length > 0 && vue === 'liste' ? ` (${filtrees.length})` : ''}`}
            </button>
          ))}
        </div>

        {paysSelectionne && (
          <div style={{ padding: '8px 16px', background: '#fdf2ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', color: ACCENT, fontWeight: '600', margin: 0 }}>
              {paysSelectionne} — {filtrees.length} école{filtrees.length > 1 ? 's' : ''}
            </p>
            <button onClick={() => { setPaysSelectionne(null); setVue('carte') }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <IconX size={14} color={ACCENT} />
            </button>
          </div>
        )}
        
      </div>


      



      {/* CONTENU SCROLLABLE */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="scroll-container"
        style={{ flex: 1, overflowY: 'auto', paddingBottom: '62px' }}
        >

        {/* CARTE */}
        {vue === 'carte' && (
          <div style={{ position: 'relative', touchAction: 'none' }}>
            <svg
              width="100%"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ display: 'block', cursor: isDragging.current ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => { isDragging.current = false }}
              onMouseLeave={() => { isDragging.current = false }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => { isDragging.current = false }}
            >
              <g >
                {paths.map(p => (
                  <path key={p.id} d={p.d} fill="#F2EFEB" stroke="#DDD8D0" strokeWidth={0.5} />
                ))}
                {markers.map(({ pays, x, y }) => (
                  <g key={pays} onClick={() => setPaysSelectionne(pays)} style={{ cursor: 'pointer' }}>
                    <circle cx={x} cy={y} r={paysCounts[pays] ? 11 : 5}
                      fill={pays === paysSelectionne ? ACCENT : paysCounts[pays] ? '#fff' : '#e5e5e5'}
                      stroke={paysCounts[pays] ? ACCENT : '#ccc'} strokeWidth={1.5}
                    />
                    {paysCounts[pays] && (
                      <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fontWeight="600"
                        fill={pays === paysSelectionne ? '#fff' : ACCENT}>
                        {paysCounts[pays]}
                      </text>
                    )}
                    <text x={x} y={y + 22} textAnchor="middle" fontSize="7.5" fill="#666">
                      {PAYS_INFO[pays].label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', padding: '4px 0 12px' }}>
               Clique sur un pays
            </p>
          </div>
        )}


        {/* LISTE */}
        {vue === 'liste' && (
          <div style={{ background: '#f7f7f7' }}>
            {filtrees.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '40px 0' }}>Aucune école trouvée</p>
            ) : filtrees.map(ecole => (
              <Link key={ecole.id} href={`/ecoles/${ecole.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  borderBottom: '0.5px solid #f0f0f0',
                  transition: 'background 0.15s',
                }}
                  onTouchStart={e => (e.currentTarget.style.background = '#fdf2ee')}
                  onTouchEnd={e => (e.currentTarget.style.background = '#fff')}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#f5f0eb', border: '0.5px solid #e8e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconSchool size={22} color="#888" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ecole.nom}
                    </p>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 5px' }}>
                      {ecole.ville} · {ecole.pays}
                    </p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', color: '#666', background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>
                        {ecole.type.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '10px', color: '#666', background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>
                        {ecole.statut}
                      </span>
                      {ecole.verifie && (
                        <span style={{ fontSize: '10px', color: ACCENT, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <IconCheck size={10} /> vérifié
                        </span>
                      )}
                    </div>
                  </div>
                  <IconChevronRight size={15} color="#ccc" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        )}


      </div>

      {/* Bouton scroll top */}
      {showScrollTop && vue === 'liste' && (
        <button
          onClick={scrollTop}
          style={{ position: 'fixed', bottom: '84px', right: '16px', width: '40px', height: '40px', borderRadius: '50%', background: ACCENT, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(232,80,26,0.3)', zIndex: 99, transition: 'opacity 0.2s' }}
        >
          <IconArrowUp size={18} color="#fff" />
        </button>
      )}

      {/* Panel filtres */}
      {showFiltres && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '12px 12px 0 0', padding: '20px 16px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Filtres</p>
              <button onClick={() => setShowFiltres(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IconX size={20} color="#111" />
              </button>
            </div>

            <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domaine</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {DOMAINES.map(d => (
                <button key={d} onClick={() => setDomaine(domaine === d ? null : d)}
                  style={{ padding: '7px 13px', borderRadius: '4px', border: `1px solid ${domaine === d ? ACCENT : '#e5e5e5'}`, background: domaine === d ? ACCENT : '#fff', color: domaine === d ? '#fff' : '#555', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  {d}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {['universite', 'grande_ecole', 'institut', 'centre_formation'].map(t => (
                <button key={t} onClick={() => setType(type === t ? null : t)}
                  style={{ padding: '7px 13px', borderRadius: '4px', border: `1px solid ${type === t ? ACCENT : '#e5e5e5'}`, background: type === t ? ACCENT : '#fff', color: type === t ? '#fff' : '#555', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setDomaine(null); setType(null) }}
                style={{ flex: 1, padding: '13px', background: '#f5f5f5', color: '#555', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setShowFiltres(false)}
                style={{ flex: 2, padding: '13px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#fff', borderTop: '0.5px solid #e5e5e5', display: 'flex', zIndex: 100 }}>
        {NAV.map(item => {
          const Icon = item.icon
          const active = item.href === '/explorer'
          return (
            <Link key={item.href} href={item.href} style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0 8px' }}>
              <Icon size={22} color={active ? ACCENT : '#999'} style={{ display: 'block', margin: '0 auto' }} />
              <span style={{ fontSize: '10px', color: active ? ACCENT : '#999', fontWeight: active ? '600' : '400', display: 'block', marginTop: '2px' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
export default function Explorer() {
  return (
    <Suspense fallback={null}>
      <ExplorerInner />
    </Suspense>
  )
}