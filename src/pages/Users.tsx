import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, UserCheck, UserX } from 'lucide-react';

// Static data for now as requested
const users = [
  { id: 1, username: 'admin', role: 'admin', active: true, lastLogin: '2024-01-15' },
  { id: 2, username: 'editor1', role: 'editor', active: true, lastLogin: '2024-01-14' },
  { id: 3, username: 'editor2', role: 'editor', active: false, lastLogin: '2024-01-10' },
  { id: 4, username: 'viewer1', role: 'viewer', active: true, lastLogin: '2024-01-13' },
];

const Users = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <UsersIcon className="h-6 w-6" />
            <span>Управление пользователями</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Просмотр и управление пользователями системы
          </p>
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
                    {user.active ? (
                      <UserCheck className="h-5 w-5 text-success" />
                    ) : (
                      <UserX className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      Последний вход: {user.lastLogin}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      user.role === 'admin'
                        ? 'default'
                        : user.role === 'editor'
                        ? 'secondary'
                        : 'outline'
                    }
                    className={
                      user.role === 'admin'
                        ? 'bg-primary text-primary-foreground'
                        : user.role === 'editor'
                        ? 'bg-secondary text-secondary-foreground'
                        : ''
                    }
                  >
                    {user.role === 'admin'
                      ? 'Администратор'
                      : user.role === 'editor'
                      ? 'Редактор'
                      : 'Наблюдатель'}
                  </Badge>
                  
                  <Badge
                    variant={user.active ? 'default' : 'secondary'}
                    className={
                      user.active
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {user.active ? 'Активен' : 'Неактивен'}
                  </Badge>
                  
                  <Button variant="outline" size="sm">
                    Редактировать
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <Button>
              Добавить пользователя
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;