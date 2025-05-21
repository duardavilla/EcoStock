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
    try {
      const response = await axios.get("http://localhost:3001/api/comunicacoes");
      setComunicacoes(response.data);
    } catch (err) {
      console.error("Erro ao buscar comunicações:", err);
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

  const fetchTrocas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/trocas");
      setTrocas(response.data);
    } catch (err) {
      console.error("Erro ao buscar trocas:", err);
    }
  };

  const handleCreate = async () => {
    if (!formData.empresa_origem_id || !formData.empresa_destino_id || !formData.assunto) {
      setErrorMessage("Empresa origem, empresa destino e assunto são obrigatórios.");
      return;
    }
    try {
      const trocaId = formData.troca_id === "nenhuma" ? null : parseInt(formData.troca_id);
      const response = await axios.post("http://localhost:3001/api/comunicacoes", {
        ...formData,
        troca_id: trocaId,
      });
      // Garantir que o novo item tenha todas as propriedades esperadas
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
    } catch (err: any) {
      console.error("Erro ao criar comunicação:", err);
      setErrorMessage(err.response?.data?.error || "Erro ao criar comunicação.");
    }
  };

  const handleDetails = async (comunicacao: Comunicacao) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/comunicacoes/${comunicacao.contato_id}`);
      setSelectedComunicacao(response.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar detalhes da comunicação:", err);
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
      .filter((comunicacao) => comunicacao && comunicacao.empresa_origem && comunicacao.empresa_destino && comunicacao.assunto) // Verificação de segurança
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
        <Button onClick={() => setIsCreateModalOpen(true)}>
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
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setFilterTipo("todos")}>
                Todos
              </Button>
              <Button variant="outline" onClick={() => setFilterTipo("Telefone")}>
                <Phone className="mr-2 h-4 w-4" /> Chamadas
              </Button>
              <Button variant="outline" onClick={() => setFilterTipo("Mensagem")}>
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
                {filteredComunicacoes.map((comunicacao) => (
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
                      <Button variant="ghost" size="sm" onClick={() => handleDetails(comunicacao)}>
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
              />
            </div>
            <div>
              <Label htmlFor="data_contato">Data/Hora</Label>
              <Input
                id="data_contato"
                type="datetime-local"
                value={formData.data_contato}
                onChange={(e) => setFormData({ ...formData, data_contato: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duracao">Duração (Opcional)</Label>
              <Input
                id="duracao"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                placeholder="Ex.: 15 min (somente para chamadas)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setErrorMessage(""); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Registrar</Button>
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
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comunicacoes;