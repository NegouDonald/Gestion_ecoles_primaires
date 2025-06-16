// src/components/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
  Collapse,
  Divider,
  Tooltip,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Book as BookIcon,
  ExitToApp as ExitToAppIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

const collapsedWidth = 64;
const expandedWidth = 280;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openStudentMenu, setOpenStudentMenu] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [permanentExpanded, setPermanentExpanded] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleStudentMenuToggle = () => {
    setOpenStudentMenu(!openStudentMenu);
  };

  const handleSidebarExpand = () => {
    if (!permanentExpanded) {
      setSidebarExpanded(true);
    }
  };

  const handleSidebarCollapse = () => {
    if (!permanentExpanded) {
      setSidebarExpanded(false);
      setOpenStudentMenu(false);
    }
  };

  const handlePermanentToggle = () => {
    setPermanentExpanded(!permanentExpanded);
    if (permanentExpanded) {
      setSidebarExpanded(false);
      setOpenStudentMenu(false);
    }
  };

  const isExpanded = permanentExpanded || sidebarExpanded;

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Classes', icon: <SchoolIcon />, path: '/dashboard/classes' },
    {
      text: 'Étudiants',
      icon: <PeopleIcon />,
      subMenu: [
        { text: 'Liste des étudiants', path: '/dashboard/students' },
        { text: 'Ajouter un étudiant', path: '/dashboard/students/create' },
        { text: 'Groupes d\'étudiants', path: '/dashboard/students/groups' },
      ],
    },
    { text: 'Enseignants', icon: <PersonIcon />, path: '/dashboard/teachers' },
    { text: 'Matières', icon: <BookIcon />, path: '/dashboard/subjects' },
    { text: 'Évaluations', icon: <AssessmentIcon />, path: '/dashboard/assessments' },
    { text: 'Calendrier', icon: <CalendarIcon />, path: '/dashboard/calendar' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1976d2 0%, #115293 2%)',
        color: 'white',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
      }}
      onMouseEnter={handleSidebarExpand}
      onMouseLeave={handleSidebarCollapse}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          minHeight: 64,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {isExpanded && (
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            School Management
          </Typography>
        )}
        {!isExpanded && (
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 40,
              height: 40,
            }}
          >
            <SchoolIcon />
          </Avatar>
        )}
        {isExpanded && (
          <IconButton
            onClick={handlePermanentToggle}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {permanentExpanded ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {menuItems.map((item) =>
          item.subMenu ? (
            <React.Fragment key={item.text}>
              <Tooltip title={!isExpanded ? item.text : ''} placement="right">
                <ListItem
                  button
                  onClick={handleStudentMenuToggle}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: openStudentMenu ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                    },
                    justifyContent: isExpanded ? 'initial' : 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'white',
                      minWidth: isExpanded ? 40 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isExpanded && (
                    <>
                      <ListItemText 
                        primary={item.text}
                        sx={{ opacity: isExpanded ? 1 : 0 }}
                      />
                      {openStudentMenu ? <ExpandLess /> : <ExpandMore />}
                    </>
                  )}
                </ListItem>
              </Tooltip>
              {isExpanded && (
                <Collapse in={openStudentMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subMenu.map((subItem) => (
                      <ListItem
                        button
                        key={subItem.text}
                        sx={{
                          pl: 4,
                          mx: 1,
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: isActiveRoute(subItem.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.15)',
                          },
                        }}
                        onClick={() => navigate(subItem.path)}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ) : (
            <Tooltip title={!isExpanded ? item.text : ''} placement="right" key={item.text}>
              <ListItem
                button
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActiveRoute(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                  justifyContent: isExpanded ? 'initial' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'white',
                    minWidth: isExpanded ? 40 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isExpanded && (
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: isExpanded ? 1 : 0 }}
                  />
                )}
              </ListItem>
            </Tooltip>
          )
        )}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Tooltip title={!isExpanded ? 'Déconnexion' : ''} placement="right">
          <ListItem
            button
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)',
              },
              justifyContent: isExpanded ? 'initial' : 'center',
            }}
          >
            <ListItemIcon
              sx={{
                color: 'white',
                minWidth: isExpanded ? 40 : 'auto',
                justifyContent: 'center',
              }}
            >
              <ExitToAppIcon />
            </ListItemIcon>
            {isExpanded && (
              <ListItemText primary="Déconnexion" sx={{ opacity: isExpanded ? 1 : 0 }} />
            )}
          </ListItem>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { 
            xs: '100%',
            md: `calc(100% - ${isExpanded ? expandedWidth : collapsedWidth}px)` 
          },
          ml: { 
            xs: 0,
            md: `${isExpanded ? expandedWidth : collapsedWidth}px` 
          },
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '3px solid #1976d2',
          borderColor: 'divider',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: '#1976d2' }}>
            Tableau de bord
          </Typography>
          
          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: isExpanded ? expandedWidth : collapsedWidth },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' },
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isExpanded ? expandedWidth : collapsedWidth,
              border: 'none',
              transition: 'width 0.3s ease-in-out',
              overflow: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: expandedWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            xs: '100%',
            md: `calc(100% - ${isExpanded ? expandedWidth : collapsedWidth}px)` 
          },
          transition: 'width 0.3s ease-in-out',
          bgcolor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;