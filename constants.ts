
import { Task } from './types';

export const INITIAL_DATA: Task[] = [
  // ==========================
  // === P1 CORE (Le MVP) ===
  // ==========================
  {
    id: 1,
    name: "Authentification",
    priority: "P1",
    effort: 5,
    isOpen: true,
    subtasks: [
      { id: '1-1', name: "UI: Page de Connexion & Inscription", completed: true },
      { id: '1-2', name: "Logique: Gestion des formulaires (React Hook Form)", completed: true },
      { id: '1-3', name: "API: Route /login & /register", completed: true },
      { id: '1-4', name: "Securité: Gestion du Token (JWT) dans localStorage", completed: true },
      { id: '1-5', name: "API: Route /refresh-token (Session persistante)", completed: false },
      { id: '1-6', name: "UI: Gestion des erreurs API (Toasts)", completed: false }
    ]
  },
  {
    id: 2,
    name: "Profil Utilisateur",
    priority: "P1",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '2-1', name: "UI: Page Profil (Affichage)", completed: true },
      { id: '2-2', name: "Logique: Modification Poids/Objectifs", completed: true },
      { id: '2-3', name: "API: Route Update Profil (PATCH)", completed: true },
      { id: '2-4', name: "Feature: Upload Avatar (S3/Cloudinary)", completed: false },
    ]
  },
  {
    id: 3,
    name: "Base de Données Exercices",
    priority: "P1",
    effort: 4,
    isOpen: false,
    subtasks: [
      { id: '3-1', name: "Data: Importation fichier JSON/CSV initial", completed: true },
      { id: '3-2', name: "UI: Liste avec Virtual Scroll", completed: true },
      { id: '3-3', name: "Logique: Recherche instantanée (Locale)", completed: true },
      { id: '3-4', name: "API: Recherche côté serveur (Pagination)", completed: false },
      { id: '3-5', name: "UI: Afficher Instructions/Descriptions", completed: false }
    ]
  },
  {
    id: 4,
    name: "Gestion des Entraînements",
    priority: "P1",
    effort: 5,
    isOpen: false,
    subtasks: [
      { id: '4-1', name: "UI: Création de template", completed: true },
      { id: '4-2', name: "Logique: Ajouter/Supprimer exos", completed: true },
      { id: '4-3', name: "API: CRUD complet (Create, Read, Update, Delete)", completed: true },
      { id: '4-4', name: "Logique: Validation formulaires", completed: false }
    ]
  },
  {
    id: 5,
    name: "Session Active (Le Workout)",
    priority: "P1",
    effort: 5,
    isOpen: false,
    subtasks: [
      { id: '5-1', name: "UI: Écran de session active", completed: true },
      { id: '5-2', name: "Logique: Chronomètre global", completed: true },
      { id: '5-3', name: "Logique: Input Sets/Reps/Poids", completed: true },
      { id: '5-4', name: "Logique: Timer de repos auto", completed: true },
      { id: '5-5', name: "API: Sauvegarde finale (POST)", completed: false },
      { id: '5-6', name: "Feature: 'Quick Workout' (Sans template)", completed: false }
    ]
  },
  {
    id: 6,
    name: "Stats & Historique V1",
    priority: "P1",
    effort: 4,
    isOpen: false,
    subtasks: [
      { id: '6-1', name: "UI: Liste historique séances", completed: true },
      { id: '6-2', name: "UI: Graphique Volume simple", completed: true },
      { id: '6-3', name: "API: Aggregation données", completed: false },
      { id: '6-4', name: "UI: Détail séance passée", completed: false }
    ]
  },
  {
    id: 7,
    name: "UI/UX & Paramètres",
    priority: "P1",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '7-1', name: "Design: Dark Mode (Tailwind)", completed: true },
      { id: '7-2', name: "Nav: Bottom Bar Mobile", completed: true },
      { id: '7-3', name: "Settings: Toggle Kg/Lbs", completed: false },
      { id: '7-4', name: "Responsive: Fixes Mobile", completed: false }
    ]
  },

  // ==============================
  // === P2 RETENTION & SOCIAL ===
  // ==============================
  {
    id: 8,
    name: "Système de Gamification",
    priority: "P2",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '8-1', name: "Logique: Calcul Streaks (Séries)", completed: false },
      { id: '8-2', name: "UI: Design des Badges", completed: false },
      { id: '8-3', name: "API: Stockage Achievements", completed: false },
      { id: '8-4', name: "Feature: Alertes PR (Confettis)", completed: false }
    ]
  },
  {
    id: 9,
    name: "Social & Partage",
    priority: "P2",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '9-1', name: "UI: Page Profil Public", completed: false },
      { id: '9-2', name: "API: Endpoint Public (Read-only)", completed: false },
      { id: '9-3', name: "Feature: Génération lien partagé", completed: false }
    ]
  },
  {
    id: 17,
    name: "Boîte à Outils Fitness",
    priority: "P2",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '17-1', name: "Feature: Calculateur 1RM (One Rep Max)", completed: false },
      { id: '17-2', name: "Feature: Calculateur de disques (Plate Loader)", completed: false },
      { id: '17-3', name: "Feature: Calculateur TDEE / Calories", completed: false }
    ]
  },

  // ==========================
  // === P3 AVANCÉ & DATA ===
  // ==========================
  {
    id: 10,
    name: "Suivi Mensurations Corps",
    priority: "P3",
    effort: 4,
    isOpen: false,
    subtasks: [
      { id: '10-1', name: "DB: Schema (Poids, Bras, Taille...)", completed: false },
      { id: '10-2', name: "UI: Dashboard d'évolution", completed: false },
      { id: '10-3', name: "UI: Formulaire saisie rapide", completed: false }
    ]
  },
  {
    id: 11,
    name: "Export & Data",
    priority: "P3",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '11-1', name: "Feature: Export PDF Résumé Séance", completed: false },
      { id: '11-2', name: "Feature: Notes de Session (Champ texte)", completed: false }
    ]
  },
  {
    id: 12,
    name: "Vue Calendrier",
    priority: "P3",
    effort: 3,
    isOpen: false,
    subtasks: [
      { id: '12-1', name: "Lib: Intégration react-calendar", completed: false },
      { id: '12-2', name: "UI: Indicateurs visuels (Points jours)", completed: false },
      { id: '12-3', name: "Logique: Navigation vers historique", completed: false }
    ]
  },
  {
    id: 18,
    name: "Onboarding & Aide",
    priority: "P3",
    effort: 4,
    isOpen: false,
    subtasks: [
      { id: '18-1', name: "UI: Wizard de premier lancement (Genre/But/Poids)", completed: false },
      { id: '18-2', name: "UI: Tooltips découverte fonctionnalités", completed: false },
      { id: '18-3', name: "Content: FAQ & Aide intégrée", completed: false }
    ]
  },
  {
    id: 19,
    name: "Paramètres Avancés",
    priority: "P3",
    effort: 2,
    isOpen: false,
    subtasks: [
      { id: '19-1', name: "Feature: Rappels de séance (Notifs locales)", completed: false },
      { id: '19-2', name: "Data: Export complet JSON (GDPR)", completed: false },
      { id: '19-3', name: "UI: Personnalisation Thème (Couleurs)", completed: false }
    ]
  },

  // ==============================
  // === V2 FUTURE (Out of Scope) ===
  // ==============================
  {
    id: 13,
    name: "App Mobile Native",
    priority: "V2",
    effort: 5,
    isOpen: false,
    subtasks: [
      { id: '13-1', name: "Tech: Setup React Native / Expo", completed: false },
      { id: '13-2', name: "Dev: Portage Composants UI", completed: false }
    ]
  },
  {
    id: 14,
    name: "Mode Hors-ligne Avancé",
    priority: "V2",
    effort: 5,
    isOpen: false,
    subtasks: [
      { id: '14-1', name: "DB: Synchro bidirectionnelle", completed: false },
      { id: '14-2', name: "Tech: Gestion des conflits", completed: false }
    ]
  },
  {
    id: 15,
    name: "Features IA & Caméra",
    priority: "V2",
    effort: 9,
    isOpen: false,
    subtasks: [
      { id: '15-1', name: "Feature: Scanner Code-barres (Nutrition)", completed: false },
      { id: '15-2', name: "API: OpenFoodFacts Integration", completed: false },
      { id: '15-3', name: "Feature: Analyse Vidéo IA (Form Check)", completed: false }
    ]
  },
  {
    id: 16,
    name: "Intégrations Santé",
    priority: "V2",
    effort: 4,
    isOpen: false,
    subtasks: [
      { id: '16-1', name: "API: Apple HealthKit Bridge", completed: false },
      { id: '16-2', name: "API: Google Fit API", completed: false }
    ]
  }
];
