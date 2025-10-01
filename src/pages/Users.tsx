import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users as UsersIcon, UserCheck, UserX, Trash2, UserPlus } from "lucide-react";
import { fetchUsers, deleteUser, createUser, createAdminUser } from "@/lib/api";

type User = {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
  last_login: string;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "annotator",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers(1, 20);
      if (!res.ok) throw new Error("Ошибка при загрузке пользователей");
      const data = await res.json();
      setUsers(data.items || []);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить пользователя?")) return;
    try {
      const res = await deleteUser(userId);
      if (!res.ok) throw new Error("Ошибка при удалении пользователя");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.message || "Не удалось удалить пользователя");
    }
  };

  const handleCreateUser = async () => {
    if (!formData.username || !formData.password) {
      alert("Заполните все поля");
      return;
    }

    try {
      setIsCreating(true);
      const res = await createUser(formData);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Ошибка при создании пользователя");
      }

      // Refresh users list
      await loadUsers();
      
      // Reset form and close dialog
      setFormData({ username: "", password: "", role: "annotator" });
      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err.message || "Не удалось создать пользователя");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Загрузка пользователей...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <UsersIcon className="h-6 w-6" />
                <span>Управление пользователями</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Просмотр и управление пользователями системы
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Создать пользователя
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать нового пользователя</DialogTitle>
                  <DialogDescription>
                    Введите данные для создания нового пользователя системы
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      placeholder="Введите имя пользователя"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Роль</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Aдмин</SelectItem>
                        <SelectItem value="annotator">Редактор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Отмена
                  </Button>
                  <Button onClick={handleCreateUser} disabled={isCreating}>
                    {isCreating ? "Создание..." : "Создать"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    {user.is_active ? (
                      <UserCheck className="h-5 w-5 text-success" />
                    ) : (
                      <UserX className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      Последний вход: {user.last_login || "нет данных"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "default"
                        : user.role === "editor"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      user.role === "admin"
                        ? "bg-primary text-primary-foreground"
                        : user.role === "editor"
                        ? "bg-secondary text-secondary-foreground"
                        : ""
                    }
                  >
                    {user.role === "admin"
                      ? "Администратор"
                      : user.role === "annotator"
                      ? "Редактор"
                      : "Наблюдатель"}
                  </Badge>

                  <Badge
                    variant={user.is_active ? "default" : "secondary"}
                    className={
                      user.is_active
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {user.is_active ? "Активен" : "Неактивен"}
                  </Badge>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;