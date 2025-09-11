// FIX: Removed reference to "vite/client" as it was causing a type resolution error.
// The '*?raw' module declaration below is sufficient for the project's needs.

declare module '*?raw' {
  const content: string
  export default content
}
