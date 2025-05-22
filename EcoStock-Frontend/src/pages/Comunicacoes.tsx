import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "@/config";

interface Comunicacao {
  contato_id: number;
  troca_id: number | null;
  empresa_origem: string;
  empresa_destino: string;
  assunto: string;
  data_contato: string;
  duracao: string | null;
}

interface Empresa {
  empresa_id: number;
  nome: string;
}

interface Troca {
  troca_id: number;
  empresa_solicitante: string;
  empresa_receptora: string;
}

const Comunicacoes = () => {
  const navigate = useNavigate();
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [trocas, setTrocas] = useState<Troca[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedComunicacao, setSelectedComunicacao] = useState<Comunicacao | null>(null);
  const [formData, setFormData] = useState({
    troca_id: "",
    empresa_origem_id: "",
    empresa_destino_id: "",
    assunto: "",
    data_contato: "",
    duracao: "",
    tipo: "Mensagem",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se o usuário está logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Carregar comunicações, empresas e trocas ao montar o componente
  useEffect(() => {
    fetchComunicacoes();
    fetchEmpresas();
    fetchTrocas();
  }, []);

  const fetchComunicacoes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/comunicacoes`);
      setComunicacoes(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar comunicações:", err);
      toast.error(err.response?.data?.error || "Erro ao carregar comunicações.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/empresas`);
      setEmpresas(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar empresas:", err);
      toast.error(err.response?.data?.error || "Erro ao carregar empresas.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrocas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/trocas`);
      setTrocas(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar trocas:", err);
      toast.error(err.response?.data?.error || "Erro ao carregar trocas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.empresa_origem_id || !formData.empresa_destino_id || !formData.assunto) {
      setErrorMessage("Empresa origem, empresa destino e assunto são obrigatórios.");
      return;
    }
    setIsLoading(true);
    try {
      const trocaId = formData.troca_id === "nenhuma" ? null : parseInt(formData.troca_id);
      const response = await axios.post(`${API_URL}/api/comunicacoes`, {
        ...formData,
        troca_id: trocaId,
      });
      const newComunicacao: Comunicacao = {
        contato_id: response.data.contato_id,
        troca_id: response.data.troca_id,
        empresa_origem: empresas.find(e => e.empresa_id.toString() === formData.empresa_origem_id)?.nome || "Desconhecido",
        empresa_destino: empresas.find(e => e.empresa_id.toString() === formData.empresa_destino_id)?.nome || "Desconhecido",
        assunto: formData.assunto,
        data_contato: response.data.data_contato || new Date().toISOString(),
        duracao: formData.duracao || null,
      };
      setComunicacoes([...comunicacoes, newComunicacao]);
      setIsCreateModalOpen(false);
      setErrorMessage("");
      resetForm();
      toast.success("Comunicação registrada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar comunicação:", err);
      setErrorMessage(err.response?.data?.error || "Erro ao criar comunicação.");
      toast.error(err.response?.data?.error || "Erro ao criar comunicação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetails = async (comunicacao: Comunicacao) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/comunicacoes/${comunicacao.contato_id}`);
      setSelectedComunicacao(response.data);
      setIsDetailsModalOpen(true);
    } catch (err: any) {
      console.error("Erro ao buscar detalhes da comunicação:", err);
      toast.error(err.response?.data?.error || "Erro ao carregar detalhes da comunicação.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      troca_id: "",
      empresa_origem_id: "",
      empresa_destino_id: "",
      assunto: "",
      data_contato: "",
      duracao: "",
      tipo: "Mensagem",
    });
  };

  const applyFilters = () => {
    return comunicacoes
      .filter((comunicacao) => comunicacao && comunicacao.empresa_origem && comunicacao.empresa_destino && comunicacao.assunto)
      .filter((comunicacao) => {
        const matchesSearch = (
          (comunicacao.empresa_origem?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (comunicacao.empresa_destino?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (comunicacao.assunto?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        const matchesTipo = filterTipo === "todos" || 
          (filterTipo === "Telefone" && comunicacao.duracao !== null) || 
          (filterTipo === "Mensagem" && comunicacao.duracao === null);
        return matchesSearch && matchesTipo;
      });
  };

  const filteredComunicacoes = applyFilters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Log de Comunicações</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} disabled={isLoading}>
          <MessageSquare className="mr-2 h-4 w-4" /> Registrar Comunicação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Comunicações</CardTitle>
          <CardDescription>Registro de todas as comunicações entre empresas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar comunicações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setFilterTipo("todos")} disabled={isLoading}>
                Todos
              </Button>
              <Button variant="outline" onClick={() => setFilterTipo("Telefone")} disabled={isLoading}>
                <Phone className="mr-2 h-4 w-4" /> Chamadas
              </Button>
              <Button variant="outline" onClick={() => setFilterTipo("Mensagem")} disabled={isLoading}>
                <MessageSquare className="mr-2 h-4 w-4" /> Mensagens
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Empresas</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : filteredComunicacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Nenhuma comunicação encontrada</TableCell>
                  </TableRow>
                ) : (
                  filteredComunicacoes.map((comunicacao) => (
                    <TableRow key={comunicacao.contato_id}>
                      <TableCell>
                        {comunicacao.duracao ? (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-primary" /> Chamada
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4 text-primary" /> Mensagem
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{comunicacao.empresa_origem}</p>
                          <p className="text-xs text-muted-foreground">→ {comunicacao.empresa_destino}</p>
                        </div>
                      </TableCell>
                      <TableCell>{comunicacao.assunto}</TableCell>
                      <TableCell>{new Date(comunicacao.data_contato).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{comunicacao.duracao || '-'}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleDetails(comunicacao)} disabled={isLoading}>
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para registrar nova comunicação */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Comunicação</DialogTitle>
          </DialogHeader>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="troca_id">Troca Relacionada (Opcional)</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, troca_id: value })}
                value={formData.troca_id}
                disabled={isLoading}
              >
                <SelectTrigger id="troca_id">
                  <SelectValue placeholder="Selecione a troca ou nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhuma">Nenhuma</SelectItem>
                  {trocas.map((troca) => (
                    <SelectItem key={troca.troca_id} value={troca.troca_id.toString()}>
                      {troca.empresa_solicitante} → {troca.empresa_receptora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="empresa_origem_id">Empresa Origem</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, empresa_origem_id: value })}
                value={formData.empresa_origem_id}
                disabled={isLoading}
              >
                <SelectTrigger id="empresa_origem_id">
                  <SelectValue placeholder="Selecione a empresa origem" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.empresa_id} value={empresa.empresa_id.toString()}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="empresa_destino_id">Empresa Destino</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, empresa_destino_id: value })}
                value={formData.empresa_destino_id}
                disabled={isLoading}
              >
                <SelectTrigger id="empresa_destino_id">
                  <SelectValue placeholder="Selecione a empresa destino" />
                </SelectTrigger>
                <SelectContent>
                  {empresas
                    .filter((emp) => emp.empresa_id.toString() !== formData.empresa_origem_id)
                    .map((empresa) => (
                      <SelectItem key={empresa.empresa_id} value={empresa.empresa_id.toString()}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                value={formData.tipo}
                disabled={isLoading}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensagem">Mensagem</SelectItem>
                  <SelectItem value="Telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                value={formData.assunto}
                onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                placeholder="Digite o assunto da comunicação"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor="data_contato">Data/Hora</Label>
              <Input
                id="data_contato"
                type="datetime-local"
                value={formData.data_contato}
                onChange={(e) => setFormData({ ...formData, data_contato: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor="duracao">Duração (Opcional)</Label>
              <Input
                id="duracao"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                placeholder="Ex.: 15 min (somente para chamadas)"
                disabled={isLoading || formData.tipo === "Mensagem"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setIsCreateModalOpen(false); setErrorMessage(""); }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar detalhes da comunicação */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Comunicação</DialogTitle>
          </DialogHeader>
          {selectedComunicacao && (
            <div className="space-y-2">
              <p><strong>ID:</strong> #{selectedComunicacao.contato_id}</p>
              <p><strong>Troca Relacionada:</strong> {selectedComunicacao.troca_id ? `#${selectedComunicacao.troca_id}` : 'Nenhuma'}</p>
              <p><strong>Empresa Origem:</strong> {selectedComunicacao.empresa_origem}</p>
              <p><strong>Empresa Destino:</strong> {selectedComunicacao.empresa_destino}</p>
              <p><strong>Tipo:</strong> {selectedComunicacao.duracao ? 'Chamada' : 'Mensagem'}</p>
              <p><strong>Assunto:</strong> {selectedComunicacao.assunto}</p>
              <p><strong>Data/Hora:</strong> {new Date(selectedComunicacao.data_contato).toLocaleString('pt-BR')}</p>
              <p><strong>Duração:</strong> {selectedComunicacao.duracao || 'Nenhuma'}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)} disabled={isLoading}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comunicacoes;