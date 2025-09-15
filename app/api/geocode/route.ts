import fs from "fs";
import path from "path";

const praiasFile = path.join(process.cwd(), "public", "praias.json");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const praia = searchParams.get("praia");

    if (!praia) {
      return new Response(JSON.stringify({ error: "Praia não informada" }), { status: 400 });
    }

    // Chamada ao Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        praia
      )}&format=json&limit=1`
    );

    const data = await res.json();

    if (!data[0]) {
      return new Response(JSON.stringify({ error: "Praia não encontrada" }), { status: 404 });
    }

    const novaPraia = {
      praia,
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      source: "nominatim",
    };

    // Carrega praias existentes
    let praias: any[] = [];
    if (fs.existsSync(praiasFile)) {
      const fileContent = fs.readFileSync(praiasFile, "utf-8");
      praias = fileContent ? JSON.parse(fileContent) : [];
    }

    // Adiciona a nova praia (sem duplicar)
    const existe = praias.find(p => p.praia.toLowerCase() === praia.toLowerCase());
    if (!existe) praias.push(novaPraia);

    // Salva de volta
    fs.writeFileSync(praiasFile, JSON.stringify(praias, null, 2), "utf-8");

    return new Response(JSON.stringify(novaPraia), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro interno", details: err }), { status: 500 });
  }
}
