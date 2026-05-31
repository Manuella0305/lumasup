'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IconBrandGoogle, IconMail, IconLock, IconEye, IconEyeOff, IconArrowLeft, IconUser } from '@tabler/icons-react'

const ACCENT = '#E8501A'

export default function Connexion() {
  const router = useRouter()
  const [step, setStep] = useState<'choix' | 'connexion' | 'inscription'>('choix')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profil` }
    })
    setLoading(false)
  }

  const handleConnexion = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email ou mot de passe incorrect')
    else router.push('/profil')
    setLoading(false)
  }

  const handleInscription = async () => {
    setLoading(true)
    setError(null)
    if (!nom.trim()) { setError('Entre ton nom d\'utilisateur'); setLoading(false); return }
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères'); setLoading(false); return }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nom, username: nom },
        emailRedirectTo: `${window.location.origin}/profil`
      }
    })
    if (error) setError(error.message)
    else setSuccess('Compte créé ! Vérifie ton email pour confirmer.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '16px' }}>
        <button onClick={() => step !== 'choix' ? setStep('choix') : router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <IconArrowLeft size={22} color="#111" />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 40px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', background: ACCENT, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>L</span>
          </div>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#111', margin: '0 0 6px' }}>
            {step === 'choix' ? 'Rejoins Luma' : step === 'inscription' ? 'Créer un compte' : 'Se connecter'}
          </p>
          <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
            {step === 'choix' ? 'Découvre les meilleures écoles d\'Afrique' : step === 'inscription' ? 'C\'est gratuit et rapide' : 'Content de te revoir'}
          </p>
        </div>

        {/* CHOIX */}
        {step === 'choix' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleGoogle} disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#111' }}>
              <IconBrandGoogle size={20} color="#EA4335" />
              Continuer avec Google
            </button>

            <button onClick={() => setStep('inscription')}
              style={{ width: '100%', padding: '14px', background: ACCENT, border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              <IconUser size={20} color="#fff" />
              Créer un compte Luma
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '0.5px', background: '#e5e5e5' }} />
              <span style={{ fontSize: '12px', color: '#bbb' }}>déjà un compte ?</span>
              <div style={{ flex: 1, height: '0.5px', background: '#e5e5e5' }} />
            </div>

            <button onClick={() => setStep('connexion')}
              style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#555' }}>
              <IconMail size={18} color="#999" />
              Se connecter avec l'email
            </button>
          </div>
        )}

        {/* INSCRIPTION */}
        {step === 'inscription' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e5e5e5' }}>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconUser size={16} color="#ccc" />
                <input type="text" placeholder="Nom d'utilisateur" value={nom}
                  onChange={e => setNom(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }} />
              </div>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconMail size={16} color="#ccc" />
                <input type="email" placeholder="Adresse email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }} />
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconLock size={16} color="#ccc" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Mot de passe (min. 6 caractères)" value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <IconEyeOff size={16} color="#ccc" /> : <IconEye size={16} color="#ccc" />}
                </button>
              </div>
            </div>

            {error && <p style={{ fontSize: '12px', color: '#B33A10', background: '#FEE9E2', padding: '10px 12px', borderRadius: '6px', margin: 0 }}>{error}</p>}
            {success && <p style={{ fontSize: '12px', color: '#0F6E45', background: '#E2F5EC', padding: '10px 12px', borderRadius: '6px', margin: 0 }}>{success}</p>}

            <button onClick={handleInscription} disabled={loading || !nom || !email || password.length < 6}
              style={{ width: '100%', padding: '14px', background: nom && email && password.length >= 6 ? ACCENT : '#f0f0f0', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: nom && email && password.length >= 6 ? '#fff' : '#bbb', cursor: nom && email && password.length >= 6 ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', margin: 0 }}>
              En créant un compte, tu acceptes les conditions d'utilisation de Luma
            </p>
          </div>
        )}

        {/* CONNEXION */}
        {step === 'connexion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e5e5e5' }}>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconMail size={16} color="#ccc" />
                <input type="email" placeholder="Adresse email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }} />
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconLock size={16} color="#ccc" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <IconEyeOff size={16} color="#ccc" /> : <IconEye size={16} color="#ccc" />}
                </button>
              </div>
            </div>

            {error && <p style={{ fontSize: '12px', color: '#B33A10', background: '#FEE9E2', padding: '10px 12px', borderRadius: '6px', margin: 0 }}>{error}</p>}

            <button onClick={handleConnexion} disabled={loading || !email || !password}
              style={{ width: '100%', padding: '14px', background: email && password ? ACCENT : '#f0f0f0', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: email && password ? '#fff' : '#bbb', cursor: email && password ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <button onClick={() => setStep('inscription')}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: ACCENT, cursor: 'pointer', textAlign: 'center', padding: '4px' }}>
              Pas encore de compte ? Créer un compte
            </button>
          </div>
        )}

      </div>
    </div>
  )
}