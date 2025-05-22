import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '@/config';

interface Categoria {
  categoria_id: number;
  nome: string;
  descricao: string;
  produtos: number;
  empresas: number;
}

const Categorias = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se o usuário está logado
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Carregar categorias ao montar o componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/categorias`);
      setCategorias(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar categorias:', err);
      toast.error(err.response?.data?.error || 'Erro ao carregar categorias.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        const response = await axios.put(`${API_URL}/api/categorias/${editingId}`, {
          nome,
          descricao,
        });
        setCategorias(categorias.map(cat => (cat.categoria_id === editingId ? response.data : cat)));
        toast.success('Categoria atualizada com sucesso!');
      } else {
        const response = await axios.post(`${API_URL}/api/categorias`, {
          nome,
          descricao,
        });
        setCategorias([...categorias, response.data]);
        toast.success('Categoria criada com sucesso!');
      }
      setNome('');
      setDescricao('');
      setEditingId(null);
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      toast.error(err.response?.data?.error || 'Erro ao salvar categoria.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setNome(categoria.nome);
    setDescricao(categoria.descricao || '');
    setEditingId(categoria.categoria_id);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/categorias/${id}`);
      setCategorias(categorias.filter(cat => cat.categoria_id !== id));
      toast.success('Categoria deletada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao deletar categoria:', err);
      toast.error(err.response?.data?.error || 'Erro ao deletar categoria.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategorias = categorias.filter(cat =>
    cat.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sistema de Categorização</h2>
        <Button onClick={() => { setNome(''); setDescricao(''); setEditingId(null); }} disabled={isLoading}>
          <PlusIcon className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias Disponíveis</CardTitle>
            <CardDescription>Gerencie as categorias para classificação de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Buscar categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Empresas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
                      </TableRow>
                    ) : filteredCategorias.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">Nenhuma categoria encontrada</TableCell>
                      </TableRow>
                    ) : (
                      filteredCategorias.map((categoria) => (
                        <TableRow key={categoria.categoria_id}>
                          <TableCell className="font-medium">{categoria.nome}</TableCell>
                          <TableCell>{categoria.produtos}</TableCell>
                          <TableCell>{categoria.empresas}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)} disabled={isLoading}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(categoria.categoria_id)} disabled={isLoading}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
            <CardDescription>
              {editingId ? 'Edição de categoria existente' : 'Adicione uma nova categoria'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Categoria</label>
                <Input
                  placeholder="Digite o nome da categoria"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  placeholder="Digite uma descrição para a categoria"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => { setNome(''); setDescricao(''); setEditingId(null); }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'} Categoria
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categorias;