import { useRef, useState } from 'react'
import './App.css'

const INITIAL_CATEGORIES = []

function shortenText(value, maxLength = 25) {
  return value.length >= maxLength ? `${value.slice(0, maxLength)}...` : value
}

function LoginPanel({ onAuthenticate }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()

    if (username.trim() === 'admin' && password.trim() === 'secret123') {
      setFeedback({ type: 'success', message: 'Authentication successful. Welcome back.' })
      onAuthenticate()
      return
    }

    setFeedback({ type: 'error', message: 'Invalid credentials. Please try again.' })
    setPassword('')
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="eyebrow">Enterprise portal</div>
        <h1 id="auth-title">Sign in to your ledger</h1>
        <p className="intro">Authenticate to manage the income categories used by your organization.</p>
        {feedback && <div className={`feedback feedback-${feedback.type}`} role="alert">{feedback.message}</div>}
        <form id="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="usernameInput">Username</label>
          <input id="usernameInput" type="text" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          <label htmlFor="passwordInput">Password</label>
          <input id="passwordInput" type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          <button className="primary-button" type="submit" id="btnSubmitAuth">Authenticate <span aria-hidden="true">-&gt;</span></button>
        </form>
        <p className="credential-hint">Demo credentials: admin / secret123</p>
      </section>
    </main>
  )
}

function CategoryForm({ onAddCategory }) {
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const categoryNameInput = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = categoryName.trim()
    const trimmedDescription = categoryDescription.trim()
    if (!trimmedName || !trimmedDescription) return

    onAddCategory({ name: trimmedName, description: trimmedDescription })
    setCategoryName('')
    setCategoryDescription('')
    categoryNameInput.current?.focus()
  }

  return (
    <section className="form-panel" aria-labelledby="registration-title">
      <div className="section-kicker">New entry</div>
      <h2 id="registration-title">Income category registration</h2>
      <p className="section-copy">Define a category once, then keep every incoming record organized.</p>
      <form id="categoryForm" onSubmit={handleSubmit}>
        <div className="field-grid">
          <div className="field-group">
            <label htmlFor="txtCatName">Category name</label>
            <input ref={categoryNameInput} id="txtCatName" type="text" placeholder="e.g. Consulting" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required />
          </div>
          <div className="field-group">
            <label htmlFor="txtCatDesc">Description</label>
            <input id="txtCatDesc" type="text" placeholder="e.g. Technical support contract" value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} required />
          </div>
        </div>
        <button className="primary-button" type="submit" id="btnAdd">Save category <span aria-hidden="true">+</span></button>
      </form>
    </section>
  )
}

function CategoryTable({ categories, onRemoveCategory }) {
  return (
    <section className="table-panel" aria-labelledby="categories-title">
      <div className="table-heading">
        <div><div className="section-kicker">Live ledger</div><h2 id="categories-title">Registered categories</h2></div>
        <span className="category-count">{categories.length} {categories.length === 1 ? 'category' : 'categories'}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th scope="col">Category name</th><th scope="col">Description</th><th scope="col" className="action-heading">Action</th></tr></thead>
          <tbody id="listIncomeCat">
            {categories.length === 0 ? <tr className="empty-row"><td colSpan="3">No income categories yet. Add your first entry above.</td></tr> : categories.map((category) => <tr key={category.id}><td className="category-name" title={category.name}>{shortenText(category.name).toUpperCase()}</td><td title={category.description}>{shortenText(category.description)}</td><td className="action-cell"><button className="remove-button" type="button" onClick={() => onRemoveCategory(category.id)} aria-label={`Remove ${category.name}`}>Remove</button></td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Ledger({ onSignOut }) {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)

  function addCategory(category) {
    setCategories((currentCategories) => [...currentCategories, { ...category, id: crypto.randomUUID() }])
  }

  function removeCategory(categoryId) {
    setCategories((currentCategories) => currentCategories.filter((category) => category.id !== categoryId))
  }

  return (
    <main className="ledger-layout">
      <header className="app-header">
        <div><div className="eyebrow">Enterprise income tracker</div><h1>Category ledger</h1></div>
        <button className="sign-out" type="button" onClick={onSignOut}>Sign out</button>
      </header>
      <div className="ledger-content"><CategoryForm onAddCategory={addCategory} /><CategoryTable categories={categories} onRemoveCategory={removeCategory} /></div>
    </main>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return isAuthenticated ? <Ledger onSignOut={() => setIsAuthenticated(false)} /> : <LoginPanel onAuthenticate={() => setIsAuthenticated(true)} />
}

export default App
