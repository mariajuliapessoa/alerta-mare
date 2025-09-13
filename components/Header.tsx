import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Alerta Maré</h1>
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/previsao">Previsão</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Registrar</Link>
      </nav>
    </header>
  )
}
