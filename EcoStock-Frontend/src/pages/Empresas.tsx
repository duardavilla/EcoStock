import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

interface Empresa {
  empresa_id: number;
  nome: string;
  cnpj: string;
  endereco: string | null;
  telefone: string;
  email: string | null;
  responsavel: string | null;
  data_cadastro: string;
  ramo: string | null;
  produtos: number;
}

interface Categoria {
  categoria_id: number;
  nome: string;
  descricao: string;
  produtos: string;
  empresas: string;
}

const Empresas = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    responsavel: "",
    ramo: "",
    produtos: 0,
  });

  // Verificar se o usuário está logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Carregar empresas e categorias ao montar o componente
  useEffect(() => {
    fetchEmpresas();
    fetchCategorias();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/empresas");
      setEmpresas(response.data);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/categorias");
      setCategorias(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/empresas", formData);
      setEmpresas([...empresas, response.data]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao criar empresa:", err);
    }
  };

  const handleEdit = async () => {
    if (!selectedEmpresa) return;
    try {
      const response = await axios.put(
        `http://localhost:3001/api/empresas/${selectedEmpresa.empresa_id}`,
        formData
      );
      setEmpresas(
        empresas.map((emp) =>
          emp.empresa_id === selectedEmpresa.empresa_id ? response.data : emp
        )
      );
      setIsEditModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao atualizar empresa:", err);
    }
  };

  const handleView = async (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setFormData({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco || "",
      telefone: empresa.telefone,
      email: empresa.email || "",
      responsavel: empresa.responsavel || "",
      ramo: empresa.ramo || "",
      produtos: empresa.produtos,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      email: "",
      responsavel: "",
      ramo: "",
      produtos: 0,
    });
    setSelectedEmpresa(null);
  };

  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Empresas</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Empresa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>Liste, pesquise e gerencie empresas participantes da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar empresas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-2">
              <Button variant="outline">Filtrar</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ramo</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.empresa_id}>
                    <TableCell className="font-medium">{empresa.nome}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>{empresa.telefone}</TableCell>
                    <TableCell>{empresa.ramo || 'Não informado'}</TableCell>
                    <TableCell>{empresa.produtos}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(empresa)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(empresa)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para criar nova empresa */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome da empresa"
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="Digite o CNPJ"
              />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Digite o endereço (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="Digite o telefone"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Digite o email (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                placeholder="Digite o nome do responsável (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="ramo">Ramo</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, ramo: value })}
                value={formData.ramo}
              >
                <SelectTrigger id="ramo">
                  <SelectValue placeholder="Selecione o ramo" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.categoria_id} value={categoria.nome}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="produtos">Produtos</Label>
              <Input
                id="produtos"
                type="number"
                value={formData.produtos}
                onChange={(e) => setFormData({ ...formData, produtos: Number(e.target.value) })}
                placeholder="Digite a quantidade de produtos"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar empresa */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome da empresa"
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="Digite o CNPJ"
              />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Digite o endereço (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="Digite o telefone"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Digite o email (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                placeholder="Digite o nome do responsável (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="ramo">Ramo</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, ramo: value })}
                value={formData.ramo}
              >
                <SelectTrigger id="ramo">
                  <SelectValue placeholder="Selecione o ramo" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.categoria_id} value={categoria.nome}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="produtos">Produtos</Label>
              <Input
                id="produtos"
                type="number"
                value={formData.produtos}
                onChange={(e) => setFormData({ ...formData, produtos: Number(e.target.value) })}
                placeholder="Digite a quantidade de produtos"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar empresa */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Empresa</DialogTitle>
          </DialogHeader>
          {selectedEmpresa && (
            <div className="space-y-2">
              <p><strong>Nome:</strong> {selectedEmpresa.nome}</p>
              <p><strong>CNPJ:</strong> {selectedEmpresa.cnpj}</p>
              <p><strong>Endereço:</strong> {selectedEmpresa.endereco || 'Não informado'}</p>
              <p><strong>Telefone:</strong> {selectedEmpresa.telefone}</p>
              <p><strong>Email:</strong> {selectedEmpresa.email || 'Não informado'}</p>
              <p><strong>Responsável:</strong> {selectedEmpresa.responsavel || 'Não informado'}</p>
              <p><strong>Ramo:</strong> {selectedEmpresa.ramo || 'Não informado'}</p>
              <p><strong>Produtos:</strong> {selectedEmpresa.produtos}</p>
              <p><strong>Data de Cadastro:</strong> {new Date(selectedEmpresa.data_cadastro).toLocaleDateString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Empresas;