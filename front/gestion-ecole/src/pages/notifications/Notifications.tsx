import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notification.service';
import { Container, Typography, List, ListItem, ListItemText, Button, Alert } from '@mui/material';
import type { Notification } from '../../types/staff.types';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getUnreadNotifications();
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des notifications.');
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de la notification.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <List>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <ListItem key={notification.id} divider>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.createdAt).toLocaleString('fr-FR')}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Marquer comme lu
              </Button>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="Aucune notification non lue." />
          </ListItem>
        )}
      </List>
    </Container>
  );
};

export default Notifications;