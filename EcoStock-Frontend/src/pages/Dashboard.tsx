import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, ArrowRightLeft, Package, Tags } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Categoria {
  categoria_id: number;
  nome: string;
  descricao: string;
  empresas: number;
  produtos: number | string;
}

interface Empresa {
  empresa_id: number;
  nome: string;
  cnpj: string;
  endereco: string | null;
  telefone: string;
  email: string | null;
  responsavel: string | null;
  ramo: string | null;
  produtos: number | string;
}

interface Troca {
  troca_id: number;
  empresa_solicitante: string;
  empresa_receptora: string;
  data: string;
  status: string;
  observacoes: string | null;
  categoria_solicitante: string;
  categoria_receptora: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [trocas, setTrocas] = useState<Troca[]>([]);
  const [totalProdutos, setTotalProdutos] = useState<number>(0);

  // Função para obter a saudação com base no horário de São Paulo
  const getSaudacao = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
    const hour = parseInt(formatter.format(now), 10);

    if (hour >= 0 && hour < 12) {
      return "Bom dia, Admin!";
    } else if (hour >= 12 && hour < 18) {
      return "Boa tarde, Admin!";
    } else {
      return "Boa noite, Admin!";
    }
  };

  // Verificar se o usuário está logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchCategorias();
    fetchEmpresas();
    fetchTrocas();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/categorias");
      console.log("Dados de categorias:", response.data);
      setCategorias(response.data);
      const total = response.data.reduce((sum, cat) => {
        const produtos = parseInt(cat.produtos, 10) || 0;
        return sum + produtos;
      }, 0);
      setTotalProdutos(total);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/empresas");
      console.log("Dados de empresas:", response.data);
      setEmpresas(response.data);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    }
  };

  const fetchTrocas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/trocas");
      console.log("Dados de trocas:", response.data);
      setTrocas(response.data);
    } catch (err) {
      console.error("Erro ao buscar trocas:", err);
    }
  };

  const trocasAtivas = trocas.filter((troca) => troca.status === "ativa" || troca.status === "pendente" || troca.status === "Em andamento");
  const trocasUltimoMes = trocas.filter((troca) => {
    const dataTroca = new Date(troca.data);
    const agora = new Date();
    const umMesAtras = new Date(agora.setMonth(agora.getMonth() - 1));
    return dataTroca >= umMesAtras;
  });

  const statsCards = [
    {
      title: "Total de Produtos",
      value: totalProdutos.toString(),
      description: "Cadastrados",
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: "Empresas Parceiras",
      value: empresas.length.toString(),
      description: "Na plataforma",
      icon: <Building2 className="h-5 w-5 text-primary" />,
    },
    {
      title: "Categorias",
      value: categorias.length.toString(),
      description: "Disponíveis",
      icon: <Tags className="h-5 w-5 text-primary" />,
    },
    {
      title: "Trocas Realizadas",
      value: trocasUltimoMes.length.toString(),
      description: "Último mês",
      icon: <ArrowRightLeft className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="grid gap-6">
      {/* Saudação */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{getSaudacao()}</h1>
      </div>

      {/* Cards de estatística */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabelas de dados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trocas recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Trocas Recentes</CardTitle>
            <CardDescription>Últimas trocas ativas na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresas</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trocasAtivas.map((troca) => (
                  <TableRow key={troca.troca_id}>
                    <TableCell className="font-medium">
                      {troca.empresa_solicitante} ↔ {troca.empresa_receptora}
                    </TableCell>
                    <TableCell>{troca.categoria_solicitante}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          troca.status === "Concluída"
                            ? "bg-green-100 text-green-800"
                            : troca.status === "pendente" || troca.status === "Em andamento" || troca.status === "ativa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {troca.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Características por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Características por Categoria</CardTitle>
            <CardDescription>Número de empresas cadastradas por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Empresas Cadastradas</TableHead>
                  <TableHead>Produtos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.categoria_id}>
                    <TableCell className="font-medium">{categoria.nome}</TableCell>
                    <TableCell>{categoria.empresas}</TableCell>
                    <TableCell>{parseInt(categoria.produtos, 10) || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;