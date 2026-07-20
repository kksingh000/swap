import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import GradientBlobs from '../components/ui/GradientBlobs'
import { Field, Input, Select } from '../components/ui/fields'
import { toast } from '../components/ui/Toast'
import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { listings } from '../data/seed'
import { fadeUp, stagger } from '../lib/motion'
import { cn } from '../lib/utils'

const CITIES = [...new Set(listings.map((l) => l.city))].sort()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SIDE_IMAGE =
  'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1200&q=80&auto=format&fit=crop'

function validate(mode, v) {
  const errors = {}
  if (mode === 'register' && !v.name.trim()) errors.name = 'Tell us your name'
  if (!EMAIL_RE.test(v.email)) errors.email = 'Enter a valid email address'
  if (v.password.length < 8) errors.password = 'At least 8 characters'
  if (mode === 'register' && v.confirm !== v.password) errors.confirm = 'Passwords do not match'
  if (mode === 'register' && !v.city) errors.city = 'Pick your city'
  return errors
}

// Split-screen auth. Validation is real; the session is mocked locally until
// the Express + JWT backend arrives in build step 6.
export default function Auth() {
  const navigate = useNavigate()
  const { user, login } = useAuthStore()
  const [mode, setMode] = useState('login')
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', city: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const errors = validate(mode, values)
  const showError = (field) => (touched[field] || submitted ? errors[field] : undefined)

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }))

  const switchMode = (next) => {
    setMode(next)
    setTouched({})
    setSubmitted(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return

    // Real JWT auth when the Express API is configured; local mock otherwise.
    if (import.meta.env.VITE_API_URL) {
      try {
        const data = await api(mode === 'login' ? '/auth/login' : '/auth/register', {
          method: 'POST',
          body:
            mode === 'login'
              ? { email: values.email, password: values.password }
              : { name: values.name.trim(), email: values.email, password: values.password, city: values.city },
        })
        login(data.user, data.token)
        toast(`Welcome${mode === 'login' ? ' back' : ' to the atelier'}, ${data.user.name.split(' ')[0]}.`, {
          type: 'success',
        })
      } catch (err) {
        toast(err.message, { type: 'error' })
      }
      return
    }

    const name =
      mode === 'register'
        ? values.name.trim()
        : values.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    login(
      {
        id: `u-${Date.now()}`,
        name,
        email: values.email,
        city: mode === 'register' ? values.city : 'New Delhi',
        joinedAt: new Date().toISOString().slice(0, 10),
        rating: 5.0,
        swapsCompleted: 0,
      },
      `demo-token-${Date.now()}`, // replaced by a real JWT in step 6
    )
    toast(
      mode === 'register'
        ? `Welcome to the atelier, ${name.split(' ')[0]}.`
        : `Welcome back, ${name.split(' ')[0]}.`,
      { type: 'success' },
    )
  }

  return (
    <PageTransition>
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ——— Form side ——— */}
        <div className="grain relative flex items-center justify-center overflow-hidden px-6 pb-20 pt-32 lg:px-16">
          <GradientBlobs />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative w-full max-w-md"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>Members</Eyebrow>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-4xl text-ivory md:text-5xl">
              {mode === 'login' ? 'Back to the atelier' : 'Join the exchange'}
            </motion.h1>

            {/* Tab toggle with sliding indicator */}
            <motion.div
              variants={fadeUp}
              className="relative mt-8 grid grid-cols-2 rounded-full border border-gray-line bg-charcoal p-1"
              role="tablist"
            >
              <motion.span
                aria-hidden
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-red shadow-glow"
                animate={{ x: mode === 'login' ? 4 : 'calc(100% + 4px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    'relative z-10 rounded-full py-2.5 text-sm font-medium transition-colors duration-200',
                    mode === m ? 'text-ivory' : 'text-gray-mid hover:text-ivory',
                  )}
                >
                  {m === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </motion.div>

            <motion.form variants={fadeUp} onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              <AnimatePresence mode="popLayout">
                {mode === 'register' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Field label="Full name" error={showError('name')} htmlFor="auth-name">
                      <Input
                        id="auth-name"
                        autoComplete="name"
                        placeholder="Ananya Sharma"
                        value={values.name}
                        error={showError('name')}
                        onChange={set('name')}
                        onBlur={blur('name')}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email" error={showError('email')} htmlFor="auth-email">
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  error={showError('email')}
                  onChange={set('email')}
                  onBlur={blur('email')}
                />
              </Field>

              <Field
                label="Password"
                error={showError('password')}
                hint={mode === 'register' ? 'Eight characters minimum.' : undefined}
                htmlFor="auth-password"
              >
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  value={values.password}
                  error={showError('password')}
                  onChange={set('password')}
                  onBlur={blur('password')}
                />
              </Field>

              <AnimatePresence mode="popLayout">
                {mode === 'register' && (
                  <motion.div
                    key="register-extras"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <Field label="Confirm password" error={showError('confirm')} htmlFor="auth-confirm">
                      <Input
                        id="auth-confirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={values.confirm}
                        error={showError('confirm')}
                        onChange={set('confirm')}
                        onBlur={blur('confirm')}
                      />
                    </Field>
                    <Field
                      label="Your city"
                      error={showError('city')}
                      hint="Swaps are exchanged in person — we match you locally."
                      htmlFor="auth-city"
                    >
                      <Select
                        id="auth-city"
                        value={values.city}
                        error={showError('city')}
                        onChange={set('city')}
                        onBlur={blur('city')}
                      >
                        <option value="">Select a city</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" size="lg" magnetic iconRight={ArrowRight} className="w-full">
                {mode === 'login' ? 'Sign in' : 'Create my account'}
              </Button>

              <p className="text-center text-sm text-gray-mid">
                {mode === 'login' ? 'New to Swap?' : 'Already a member?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-red-light transition-colors duration-200 hover:text-ivory"
                >
                  {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                </button>
              </p>
            </motion.form>
          </motion.div>
        </div>

        {/* ——— Editorial side ——— */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src={SIDE_IMAGE}
            alt="Rail of curated garments"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="grain absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-14">
            <p className="font-display text-4xl italic leading-snug text-ivory">
              “Style is a language.
              <br />
              Swap lets it <span className="not-italic text-red-light">circulate</span>.”
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-eyebrow text-gray-light/80">
              4,260 swaps sealed · 38 cities · zero rupees exchanged
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
