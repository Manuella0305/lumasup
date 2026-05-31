'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IconBrandGoogle, IconMail, IconLock, IconEye, IconEyeOff, IconArrowLeft } from '@tabler/icons-react'

const ACCENT = '#E8501A'

export default function Connexion() {
  const router = useRouter()
  const [mode, setMode] = useState<'choix' | 'email'>('choix')
  const [isInscription, setIsInscription] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profil` }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleEmail = async () => {
    setLoading(true)
    setError(null)
    if (isInscription) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/profil` }
      })
      if (error) setError(error.message)
      else setSuccess('Vérifie ton email pour confirmer ton compte !')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect')
      else router.push('/profil')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => mode === 'email' ? setMode('choix') : router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <IconArrowLeft size={22} color="#111" />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 40px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: ACCENT, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>L</span>
          </div>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#111', margin: '0 0 6px' }}>
            {mode === 'choix' ? 'Bienvenue sur Luma' : isInscription ? 'Créer un compte' : 'Se connecter'}
          </p>
          <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
            {mode === 'choix' ? 'Connecte-toi pour sauvegarder tes écoles favorites' : 'Avec ton adresse email'}
          </p>
        </div>

        {/* Choix connexion */}
        {mode === 'choix' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#111' }}
            >
              <IconBrandGoogle size={20} color="#EA4335" />
              Continuer avec Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '0.5px', background: '#e5e5e5' }} />
              <span style={{ fontSize: '12px', color: '#bbb' }}>ou</span>
              <div style={{ flex: 1, height: '0.5px', background: '#e5e5e5' }} />
            </div>

            <button
              onClick={() => setMode('email')}
              style={{ width: '100%', padding: '14px', background: ACCENT, border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#fff' }}
            >
              <IconMail size={20} color="#fff" />
              Continuer avec l'email
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', marginTop: '16px' }}>
              En continuant, tu acceptes les conditions d'utilisation de Luma
            </p>
          </div>
        )}

        {/* Formulaire email */}
        {mode === 'email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Toggle inscription/connexion */}
            <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '8px', padding: '3px', marginBottom: '8px' }}>
              <button onClick={() => setIsInscription(false)}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', background: !isInscription ? '#fff' : 'transparent', fontSize: '13px', fontWeight: !isInscription ? '600' : '400', color: !isInscription ? '#111' : '#888', cursor: 'pointer', transition: 'all 0.15s' }}>
                Connexion
              </button>
              <button onClick={() => setIsInscription(true)}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', background: isInscription ? '#fff' : 'transparent', fontSize: '13px', fontWeight: isInscription ? '600' : '400', color: isInscription ? '#111' : '#888', cursor: 'pointer', transition: 'all 0.15s' }}>
                Inscription
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e5e5e5' }}>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconMail size={16} color="#ccc" />
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }}
                />
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconLock size={16} color="#ccc" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#111', background: 'transparent' }}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <IconEyeOff size={16} color="#ccc" /> : <IconEye size={16} color="#ccc" />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '12px', color: '#B33A10', background: '#FEE9E2', padding: '10px 12px', borderRadius: '6px', margin: 0 }}>
                {error}
              </p>
            )}
            {success && (
              <p style={{ fontSize: '12px', color: '#0F6E45', background: '#E2F5EC', padding: '10px 12px', borderRadius: '6px', margin: 0 }}>
                {success}
              </p>
            )}

            <button
              onClick={handleEmail}
              disabled={loading || !email || !password}
              style={{ width: '100%', padding: '14px', background: email && password ? ACCENT : '#f0f0f0', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: email && password ? '#fff' : '#bbb', cursor: email && password ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}
            >
              {loading ? 'Chargement...' : isInscription ? 'Créer mon compte' : 'Me connecter'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}