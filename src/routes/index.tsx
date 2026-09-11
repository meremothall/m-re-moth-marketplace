import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MERE MOTH MALL - Bottes, Gants 12kV & Pierre à Douala" },
      {
        name: "description",
        content:
          "Boutique MERE MOTH MALL à Douala : bottes de sécurité, gants isolants 12kV et pierre de construction. Commande rapide par MoMo au 653779134.",
      },
      { property: "og:title", content: "MERE MOTH MALL - Équipements & Matériaux à Douala" },
      {
        property: "og:description",
        content:
          "Bottes, gants 12kV et pierre disponibles à Douala. Paiement Mobile Money 653779134.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Categorie = "Bottes" | "Gants" | "Pierre";

type Produit = {
  id: string;
  nom: string;
  prix: number;
  categorie: Categorie;
  description: string;
};

const CATEGORIES: Categorie[] = ["Bottes", "Gants", "Pierre"];

const PRODUITS_INITIAUX: Produit[] = [
  {
    id: "1",
    nom: "Bottes de sécurité montantes",
    prix: 18000,
    categorie: "Bottes",
    description: "Semelle anti-perforation, embout acier. Pointures 39 à 46.",
  },
  {
    id: "2",
    nom: "Bottes en caoutchouc chantier",
    prix: 9500,
    categorie: "Bottes",
    description: "Étanches, idéales saison des pluies et travaux humides.",
  },
  {
    id: "3",
    nom: "Gants isolants 12kV",
    prix: 25000,
    categorie: "Gants",
    description: "Latex diélectrique testé 12kV, conformes travaux électriques.",
  },
  {
    id: "4",
    nom: "Gants de manutention renforcés",
    prix: 3500,
    categorie: "Gants",
    description: "Paume enduite, bonne prise, résistants à l'abrasion.",
  },
  {
    id: "5",
    nom: "Pierre concassée 15/25",
    prix: 145000,
    categorie: "Pierre",
    description: "Livraison camion benne dans Douala. Prix par voyage.",
  },
  {
    id: "6",
    nom: "Moellon de fondation",
    prix: 120000,
    categorie: "Pierre",
    description: "Pierre brute pour soubassement et fondations.",
  },
];

const EMOJI: Record<Categorie, string> = {
  Bottes: "🥾",
  Gants: "🧤",
  Pierre: "🪨",
};

const MOMO = "653779134";
const PASS = "MereMoth2026";
const STORAGE_KEY = "meremoth-produits";

function formatPrix(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function Index() {
  const [produits, setProduits] = useState<Produit[]>(PRODUITS_INITIAUX);
  const [filtre, setFiltre] = useState<"Tout" | Categorie>("Tout");
  const [adminOuvert, setAdminOuvert] = useState(false);
  const [pass, setPass] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [erreur, setErreur] = useState("");
  const [form, setForm] = useState({
    nom: "",
    prix: "",
    categorie: "Bottes" as Categorie,
    description: "",
  });

  useEffect(() => {
    const brut = localStorage.getItem(STORAGE_KEY);
    if (brut) {
      try {
        setProduits(JSON.parse(brut) as Produit[]);
      } catch {
        /* données invalides ignorées */
      }
    }
  }, []);

  const enregistrer = (liste: Produit[]) => {
    setProduits(liste);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));
  };

  const visibles = filtre === "Tout" ? produits : produits.filter((p) => p.categorie === filtre);

  const ajouter = () => {
    if (!form.nom.trim() || !form.prix.trim()) {
      setErreur("Nom et prix obligatoires.");
      return;
    }
    setErreur("");
    enregistrer([
      {
        id: crypto.randomUUID(),
        nom: form.nom.trim(),
        prix: Number(form.prix) || 0,
        categorie: form.categorie,
        description: form.description.trim(),
      },
      ...produits,
    ]);
    setForm({ nom: "", prix: "", categorie: "Bottes", description: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🌾 MERE MOTH MALL</h1>
            <p className="mt-1 text-sm opacity-90">
              Bottes, Gants 12kV, Pierre — Douala · MoMo {MOMO}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setAdminOuvert(true)}>
            Admin
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {(["Tout", ...CATEGORIES] as const).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={filtre === c ? "default" : "outline"}
              onClick={() => setFiltre(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-secondary text-5xl">
                {EMOJI[p.categorie]}
              </div>
              <CardContent className="space-y-2 p-4">
                <Badge variant="secondary">{p.categorie}</Badge>
                <h2 className="font-semibold leading-tight">{p.nom}</h2>
                {p.description && (
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                )}
                <p className="text-lg font-bold text-primary">{formatPrix(p.prix)}</p>
                <Button asChild className="w-full">
                  <a
                    href={`https://wa.me/237${MOMO}?text=${encodeURIComponent(
                      `Bonjour MERE MOTH MALL, je souhaite commander : ${p.nom}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Commander
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibles.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            Aucun produit dans cette catégorie.
          </p>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        MERE MOTH MALL · Douala, Cameroun · Mobile Money {MOMO}
      </footer>

      <Dialog
        open={adminOuvert}
        onOpenChange={(o) => {
          setAdminOuvert(o);
          if (!o) {
            setPass("");
            setErreur("");
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Espace Admin</DialogTitle>
            <DialogDescription>
              {connecte
                ? "Ajoutez un nouveau produit à la boutique."
                : "Entrez le mot de passe pour gérer les produits."}
            </DialogDescription>
          </DialogHeader>

          {!connecte ? (
            <div className="space-y-3">
              <Label htmlFor="pass">Mot de passe</Label>
              <Input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (pass === PASS) {
                      setConnecte(true);
                      setErreur("");
                    } else setErreur("Mot de passe incorrect.");
                  }
                }}
              />
              {erreur && <p className="text-sm text-destructive">{erreur}</p>}
              <Button
                className="w-full"
                onClick={() => {
                  if (pass === PASS) {
                    setConnecte(true);
                    setErreur("");
                  } else setErreur("Mot de passe incorrect.");
                }}
              >
                Entrer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="nom">Nom du produit</Label>
                <Input
                  id="nom"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prix">Prix (FCFA)</Label>
                <Input
                  id="prix"
                  type="number"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <div className="flex gap-2">
                  {CATEGORIES.map((c) => (
                    <Button
                      key={c}
                      type="button"
                      size="sm"
                      variant={form.categorie === c ? "default" : "outline"}
                      onClick={() => setForm({ ...form, categorie: c })}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              {erreur && <p className="text-sm text-destructive">{erreur}</p>}
              <Button className="w-full" onClick={ajouter}>
                Sauvegarder
              </Button>

              <div className="space-y-2 pt-4">
                <p className="text-sm font-medium">Produits ({produits.length})</p>
                {produits.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <span className="truncate">{p.nom}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => enregistrer(produits.filter((x) => x.id !== p.id))}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
