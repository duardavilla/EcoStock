import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Troca {
  troca_id: number;
  empresa_solicitante: string;
  empresa_receptora: string;
  data: string;
  status: string;
  observacoes: string | null;
  categoria_solicitante: string; // Nova propriedade para categoria da solicitante
  categoria_receptora: string;   // Nova propriedade para categoria da receptora
}

interface Empresa {
  empresa_id: number;
  nome: string;
}

interface Categoria {
  categoria_id: number;
  nome: string;
}

const Trocas = () => {
  const navigate = useNavigate();
  const [trocas, setTrocas] = useState<Troca[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSolicitante, setFilterSolicitante] = useState<string>("todos");
  const [filterReceptora, setFilterReceptora] = useState<string>("todos");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTroca, setSelectedTroca] = useState<Troca | null>(null);
  const [formData, setFormData] = useState({
    empresa_solicitante: "",
    empresa_receptora: "",
    data: "",
    status: "pendente",
    observacoes: "",
    categoria_solicitante: "", // Novo campo para categoria da solicitante
    categoria_receptora: "",   // Novo campo para categoria da receptora
  });
  const [statusEdit, setStatusEdit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Verificar se o usuário está logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Carregar trocas, empresas e categorias ao montar o componente
  useEffect(() => {
    fetchTrocas();
    fetchEmpresas();
    fetchCategorias();
  }, []);

  const fetchTrocas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/trocas");
      setTrocas(response.data);
    } catch (err) {
      console.error("Erro ao buscar trocas:", err);
    }
  };

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
    if (formData.status.length > 50) {
      setErrorMessage("O status não pode ter mais de 50 caracteres.");
      return;
    }
    if (!formData.categoria_solicitante || !formData.categoria_receptora) {
      setErrorMessage("As categorias de ambas as empresas são obrigatórias.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/api/trocas", formData);
      setTrocas([...trocas, response.data]);
      setIsCreateModalOpen(false);
      setErrorMessage("");
      resetForm();
    } catch (err: any) {
      console.error("Erro ao criar troca:", err);
      setErrorMessage(err.response?.data?.error || "Erro ao criar troca.");
    }
  };

  const handleDetails = async (troca: Troca) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/trocas/${troca.troca_id}`);
      setSelectedTroca(response.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar detalhes da troca:", err);
    }
  };

  const handleEditStatus = async () => {
    if (!selectedTroca) return;
    if (statusEdit.length > 50) {
      setErrorMessage("O status não pode ter mais de 50 caracteres.");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:3001/api/trocas/${selectedTroca.troca_id}`, {
        ...selectedTroca,
        status: statusEdit,
      });
      setTrocas(trocas.map((t) => (t.troca_id === selectedTroca.troca_id ? response.data : t)));
      setIsEditStatusModalOpen(false);
      setStatusEdit("");
      setErrorMessage("");
    } catch (err: any) {
      console.error("Erro ao atualizar status:", err);
      setErrorMessage(err.response?.data?.error || "Erro ao atualizar status.");
    }
  };

  const handleDelete = async () => {
    if (!selectedTroca) return;
    try {
      await axios.delete(`http://localhost:3001/api/trocas/${selectedTroca.troca_id}`);
      setTrocas(trocas.filter((t) => t.troca_id !== selectedTroca.troca_id));
      setIsDeleteModalOpen(false);
      setSelectedTroca(null);
      setErrorMessage("");
    } catch (err: any) {
      console.error("Erro ao deletar troca:", err);
      setErrorMessage(err.response?.data?.error || "Erro ao deletar troca.");
    }
  };

  const resetForm = () => {
    setFormData({
      empresa_solicitante: "",
      empresa_receptora: "",
      data: "",
      status: "pendente",
      observacoes: "",
      categoria_solicitante: "",
      categoria_receptora: "",
    });
  };

  const applyFilters = () => {
    return trocas.filter((troca) => {
      const matchesSearch = troca.empresa_solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        troca.empresa_receptora.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSolicitante = filterSolicitante === "todos" || troca.empresa_solicitante === filterSolicitante;
      const matchesReceptora = filterReceptora === "todos" || troca.empresa_receptora === filterReceptora;
      return matchesSearch && matchesSolicitante && matchesReceptora;
    });
  };

  const filteredTrocas = applyFilters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sistema de Trocas</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Iniciar Nova Troca
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trocas Registradas</CardTitle>
          <CardDescription>Gerencie todas as transações de troca entre empresas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar trocas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div>
                <Label htmlFor="filter-solicitante" className="sr-only">Empresa Solicitante</Label>
                <Select
                  onValueChange={setFilterSolicitante}
                  value={filterSolicitante}
                >
                  <SelectTrigger id="filter-solicitante" className="w-[180px]">
                    <SelectValue placeholder="Solicitante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.empresa_id} value={empresa.nome}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-receptora" className="sr-only">Empresa Receptora</Label>
                <Select
                  onValueChange={setFilterReceptora}
                  value={filterReceptora}
                >
                  <SelectTrigger id="filter-receptora" className="w-[180px]">
                    <SelectValue placeholder="Receptora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.empresa_id} value={empresa.nome}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => {}}>Filtrar</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Empresa Solicitante</TableHead>
                  <TableHead>Oferece</TableHead>
                  <TableHead>Empresa Receptora</TableHead>
                  <TableHead>Oferece</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrocas.map((troca) => (
                  <TableRow key={troca.troca_id}>
                    <TableCell>#{troca.troca_id}</TableCell>
                    <TableCell>{troca.empresa_solicitante}</TableCell>
                    <TableCell>{troca.categoria_solicitante}</TableCell>
                    <TableCell>{troca.empresa_receptora}</TableCell>
                    <TableCell>{troca.categoria_receptora}</TableCell>
                    <TableCell>{new Date(troca.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        troca.status === "Concluída" ? "bg-green-100 text-green-800" :
                        troca.status === "Em andamento" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {troca.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleDetails(troca)}>
                        Detalhes
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedTroca(troca); setStatusEdit(troca.status); setIsEditStatusModalOpen(true); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedTroca(troca); setIsDeleteModalOpen(true); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para criar nova troca */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Nova Troca</DialogTitle>
          </DialogHeader>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="empresa_solicitante">Empresa Solicitante</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, empresa_solicitante: value })}
                value={formData.empresa_solicitante}
              >
                <SelectTrigger id="empresa_solicitante">
                  <SelectValue placeholder="Selecione a empresa solicitante" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.empresa_id} value={empresa.nome}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoria_solicitante">Oferece (Solicitante)</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, categoria_solicitante: value })}
                value={formData.categoria_solicitante}
              >
                <SelectTrigger id="categoria_solicitante">
                  <SelectValue placeholder="Selecione a categoria" />
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
              <Label htmlFor="empresa_receptora">Empresa Receptora</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, empresa_receptora: value })}
                value={formData.empresa_receptora}
              >
                <SelectTrigger id="empresa_receptora">
                  <SelectValue placeholder="Selecione a empresa receptora" />
                </SelectTrigger>
                <SelectContent>
                  {empresas
                    .filter((emp) => emp.nome !== formData.empresa_solicitante)
                    .map((empresa) => (
                      <SelectItem key={empresa.empresa_id} value={empresa.nome}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoria_receptora">Oferece (Receptora)</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, categoria_receptora: value })}
                value={formData.categoria_receptora}
              >
                <SelectTrigger id="categoria_receptora">
                  <SelectValue placeholder="Selecione a categoria" />
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
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                value={formData.status}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Aguardando confirmação">Aguardando confirmação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Digite observações (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setErrorMessage(""); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar detalhes da troca */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Troca</DialogTitle>
          </DialogHeader>
          {selectedTroca && (
            <div className="space-y-2">
              <p><strong>ID:</strong> #{selectedTroca.troca_id}</p>
              <p><strong>Empresa Solicitante:</strong> {selectedTroca.empresa_solicitante}</p>
              <p><strong>Oferece:</strong> {selectedTroca.categoria_solicitante}</p>
              <p><strong>Empresa Receptora:</strong> {selectedTroca.empresa_receptora}</p>
              <p><strong>Oferece:</strong> {selectedTroca.categoria_receptora}</p>
              <p><strong>Data:</strong> {new Date(selectedTroca.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>Status:</strong> {selectedTroca.status}</p>
              <p><strong>Observações:</strong> {selectedTroca.observacoes || 'Nenhuma observação'}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar status */}
      <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Status</DialogTitle>
          </DialogHeader>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {selectedTroca && (
            <div className="space-y-4">
              <p><strong>Troca:</strong> {selectedTroca.empresa_solicitante} → {selectedTroca.empresa_receptora}</p>
              <div>
                <Label htmlFor="status">Novo Status</Label>
                <Select
                  onValueChange={(value) => setStatusEdit(value)}
                  value={statusEdit}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Aguardando confirmação">Aguardando confirmação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditStatusModalOpen(false); setErrorMessage(""); }}>
              Cancelar
            </Button>
            <Button onClick={handleEditStatus}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para confirmação de exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          {selectedTroca && (
            <p>Tem certeza que deseja excluir a troca entre {selectedTroca.empresa_solicitante} e {selectedTroca.empresa_receptora}?</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setErrorMessage(""); }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trocas;