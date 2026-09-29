# Enterprise Income Category Ledger

A modular React + Vite refactor of the Enterprise Income Category Ledger and Client-Side Authentication Gate exercises.

## Run Locally

```bash
npm install
npm run dev
```

Demo login: `admin` / `secret123`

## Features

- Authentication form with submit handling, success/error feedback, and password reset after a failed attempt.
- Income category form with required fields, whitespace trimming, controlled inputs, and keyboard-friendly form submission.
- Live ledger table rendered from React state, including an empty state and category count.
- Sign out flow and responsive layout for small screens.

## AI Explanation And Code Defense

AI assistance was used to translate the supplied vanilla DOM exercises into React components, write the initial CSS layout, and check the implementation for common React and accessibility issues. The final code was reviewed against the original requirements and the behavior is explained below.

### Component responsibilities

- `App` owns the `isAuthenticated` boolean. It conditionally renders either `LoginPanel` or `Ledger`, which replaces manually hiding and showing DOM sections.
- `LoginPanel` owns `username`, `password`, and `feedback` with `useState`. Its `handleSubmit` calls `event.preventDefault()` so the browser does not reload. It compares trimmed values with the exercise credentials, sends a success callback to `App`, or clears the password and renders an error message.
- `CategoryForm` owns the two input values as controlled state. Its submit handler trims both values, guards against an incomplete entry, calls `onAddCategory`, clears both values, and uses `useRef` to focus `txtCatName`, matching the original reset-and-refocus behavior.
- `Ledger` owns the `categories` array. `addCategory` uses the functional form of `setCategories` and creates a new array with a unique ID, so React can render a new table row without `insertAdjacentHTML` or direct DOM mutation.
- `CategoryTable` receives the array through props and maps it to table rows. React escapes category text automatically, which is safer than interpolating raw strings into an HTML template.

### Vanilla-to-React mapping

| Vanilla exercise | React implementation |
| --- | --- |
| `getElementById` | JSX `id` and `htmlFor` attributes, plus a ref only where imperative focus is required |
| `addEventListener` | `onSubmit`, `onChange`, and `onClick` props |
| `.value` reads | Controlled input state (`username`, `password`, `categoryName`, and `categoryDescription`) |
| `insertAdjacentHTML` | `categories.map(...)` inside the table body |
| `.textContent` and class swaps | Conditional JSX and the `feedback-${feedback.type}` class |
| `event.preventDefault()` | React form submit handlers |

### Defense of key decisions

State is kept at the nearest common owner: authentication state belongs to `App`, while ledger data belongs to `Ledger`. This keeps each component focused and avoids querying the DOM for data that React already owns. The category form sends data upward through `onAddCategory` because it should not directly modify the table. The table is therefore a pure view of the current array.

The original button was wired to a click listener, but the React version uses a form submit handler. This also handles pressing Enter and still preserves the required no-page-refresh behavior. The supplied credentials are intentionally client-side demo credentials because the source exercise is a client-side authentication demonstration, not a production identity system. A real application would validate credentials on a server and would not expose them in the client bundle.

## Deployment

The project is ready for a public GitHub repository and Vercel deployment. Import the GitHub repository into Vercel, keep the framework preset as Vite, and deploy with the default build command `npm run build` and output directory `dist`.
