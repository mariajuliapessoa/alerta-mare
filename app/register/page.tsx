export default function RegisterPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registrar</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Nome" className="border p-2 rounded"/>
        <input type="email" placeholder="Email" className="border p-2 rounded"/>
        <input type="password" placeholder="Senha" className="border p-2 rounded"/>
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Registrar
        </button>
      </form>
    </div>
  )
}
