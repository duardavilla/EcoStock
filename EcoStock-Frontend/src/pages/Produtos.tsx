
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dados fictícios de produtos
const produtosDados = [
  { 
    id: 1, 
    nome: "Servidores Dell PowerEdge", 
    categoria: "Eletrônicos", 
    condicao: "Usado - Bom Estado",
    empresa: "Tecnofix Ltda", 
    disponibilidade: "Imediata",
    quantidade: 5
  },
  { 
    id: 2, 
    nome: "Lotes de Cereais Orgânicos", 
    categoria: "Alimentos", 
    condicao: "Novo",
    empresa: "Alimentos Orgânicos SA", 
    disponibilidade: "30 dias",
    quantidade: 20
  },
  { 
    id: 3, 
    nome: "Painéis Solares 250W", 
    categoria: "Energia", 
    condicao: "Novo",
    empresa: "GreenEnergy", 
    disponibilidade: "Imediata",
    quantidade: 15
  },
  { 
    id: 4, 
    nome: "Monitores LG 27\"", 
    categoria: "Eletrônicos", 
    condicao: "Usado - Ótimo Estado",
    empresa: "Tecnofix Ltda", 
    disponibilidade: "Imediata",
    quantidade: 8
  },
  { 
    id: 5, 
    nome: "Mobiliário de Escritório", 
    categoria: "Móveis", 
    condicao: "Usado - Regular",
    empresa: "MultiBrasil", 
    disponibilidade: "Imediata",
    quantidade: 12
  },
];

const Produtos = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Produtos</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
          <CardDescription>Liste, pesquise e gerencie todos os produtos disponíveis para troca</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar produtos..."
                className="pl-8"
              />
            </div>
            <div className="ml-2 space-x-2">
              <Button variant="outline">Filtrar</Button>
              <Button variant="outline">Categorias</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Disponibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosDados.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell>{produto.condicao}</TableCell>
                    <TableCell>{produto.empresa}</TableCell>
                    <TableCell>{produto.quantidade}</TableCell>
                    <TableCell>{produto.disponibilidade}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Produtos;
