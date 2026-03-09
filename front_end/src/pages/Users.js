
Action: file_editor create /app/frontend/src/pages/Users.js --file-text "import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  MoreVertical,
  Pencil,
  Trash2,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { RoleBadge } from '../components/StatusBadge';
import { formatDate, getRoleLabel } from '../lib/utils';
import { toast } from 'sonner';

export default function Users() {
  const { user: currentUser } = useAuth();
  const { getUsers, updateUser, deleteUser } = useData();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Edit dialog
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [editRole, setEditRole] = useState('');
  
  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (user) => {
    setEditDialog({ open: true, user });
    setEditRole(user.role);
  };

  const handleEditSave = async () => {
    if (!editDialog.user) return;
    
    try {
      await updateUser(editDialog.user.id, { role: editRole });
      setUsers(prev => prev.map(u => 
        u.id === editDialog.user.id ? { ...u, role: editRole } : u
      ));
      toast.success('Ролята е актуализирана');
      setEditDialog({ open: false, user: null });
    } catch (err) {
      toast.error('Грешка при актуализиране');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.userId) return;
    
    try {
      await deleteUser(deleteDialog.userId);
      setUsers(prev => prev.filter(u => u.id !== deleteDialog.userId));
      toast.success('Потребителят е изтрит');
      setDeleteDialog({ open: false, userId: null });
    } catch (err) {
      toast.error('Грешка при изтриване');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell>
      <div className=\"space-y-6\" data-testid=\"users-page\">
        {/* Header */}
        <div>
          <h1 className=\"text-2xl font-bold text-white\">Потребители</h1>
          <p className=\"text-zinc-400 mt-1\">Управление на потребители и роли</p>
        </div>

        {/* Search */}
        <div className=\"relative max-w-md\">
          <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500\" />
          <Input
            placeholder=\"Търсене на потребители...\"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=\"pl-10 bg-[#18181b] border-zinc-700 text-white placeholder:text-zinc-500\"
            data-testid=\"search-users-input\"
          />
        </div>

        {/* Users Table */}
        <Card className=\"bg-[#18181b] border-zinc-800\">
          <CardContent className=\"p-0\">
            {loading ? (
              <div className=\"space-y-2 p-4\">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className=\"h-16 bg-zinc-800/50 rounded animate-pulse\" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className=\"py-16 text-center\">
                <UsersIcon className=\"w-16 h-16 mx-auto mb-4 text-zinc-700\" />
                <h3 className=\"text-lg font-medium text-white mb-2\">Няма потребители</h3>
                <p className=\"text-zinc-500\">
                  {search ? 'Опитайте с друга ключова дума' : 'Няма регистрирани потребители'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className=\"border-zinc-800 hover:bg-transparent\">
                    <TableHead className=\"text-zinc-400\">Име</TableHead>
                    <TableHead className=\"text-zinc-400\">Email</TableHead>
                    <TableHead className=\"text-zinc-400\">Роля</TableHead>
                    <TableHead className=\"text-zinc-400\">Регистриран</TableHead>
                    <TableHead className=\"text-zinc-400 w-12\"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className=\"border-zinc-800 hover:bg-zinc-800/30\"
                      data-testid={`user-row-${user.id}`}
                    >
                      <TableCell className=\"font-medium text-white\">
                        {user.name}
                        {user.id === currentUser?.id && (
                          <span className=\"ml-2 text-xs text-zinc-500\">(вие)</span>
                        )}
                      </TableCell>
                      <TableCell className=\"text-zinc-400\">{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell className=\"text-zinc-500 text-sm\">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell>
                        {user.id !== currentUser?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant=\"ghost\" size=\"icon\" className=\"h-8 w-8 text-zinc-400 hover:text-white\">
                                <MoreVertical className=\"w-4 h-4\" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align=\"end\" className=\"bg-[#18181b] border-zinc-700\">
                              <DropdownMenuItem 
                                className=\"text-zinc-300 cursor-pointer\"
                                onClick={() => handleEditOpen(user)}
                              >
                                <Shield className=\"w-4 h-4 mr-2\" />
                                Промени роля
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className=\"bg-zinc-700\" />
                              <DropdownMenuItem 
                                className=\"text-rose-400 cursor-pointer\"
                                onClick={() => setDeleteDialog({ open: true, userId: user.id })}
                              >
                                <Trash2 className=\"w-4 h-4 mr-2\" />
                                Изтрий
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Role Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, user: editDialog.user })}>
          <DialogContent className=\"bg-[#18181b] border-zinc-800\">
            <DialogHeader>
              <DialogTitle className=\"text-white\">Промяна на роля</DialogTitle>
              <DialogDescription className=\"text-zinc-400\">
                Променете ролята на {editDialog.user?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className=\"space-y-4\">
              <div className=\"space-y-2\">
                <Label className=\"text-zinc-300\">Роля</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger className=\"bg-[#09090b] border-zinc-700 text-white\" data-testid=\"edit-role-select\">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className=\"bg-[#18181b] border-zinc-700\">
                    <SelectItem value=\"reader\">Читател</SelectItem>
                    <SelectItem value=\"author\">Автор</SelectItem>
                    <SelectItem value=\"reviewer\">Рецензент</SelectItem>
                    <SelectItem value=\"admin\">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant=\"outline\" 
                onClick={() => setEditDialog({ open: false, user: null })}
                className=\"border-zinc-700\"
              >
                Отказ
              </Button>
              <Button 
                onClick={handleEditSave}
                className=\"bg-blue-600 hover:bg-blue-700\"
                data-testid=\"save-role-btn\"
              >
                Запази
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, userId: deleteDialog.userId })}>
          <AlertDialogContent className=\"bg-[#18181b] border-zinc-800\">
            <AlertDialogHeader>
              <AlertDialogTitle className=\"text-white\">Изтриване на потребител</AlertDialogTitle>
              <AlertDialogDescription className=\"text-zinc-400\">
                Сигурни ли сте, че искате да изтриете този потребител? Това действие е необратимо.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=\"bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700\">
                Отказ
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className=\"bg-rose-600 hover:bg-rose-700 text-white\"
                data-testid=\"confirm-delete-user-btn\"
              >
                Изтрий
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Users.js