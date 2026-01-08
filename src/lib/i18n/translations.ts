
export type Locale = 'en' | 'es' | 'fr';

export const translations = {
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      create: "Create",
      edit: "Edit",
      status: "Status",
      actions: "Actions",
      on: "On",
      off: "Off",
      copy: "Copy"
    },
    nav: {
      brand: "VoiceOrch",
      dashboard: "Dashboard",
      voiceChat: "Voice Chat",
      callLogs: "Call Logs",
      agents: "Agents",
      settings: "Settings",
      lightMode: "Light Mode",
      darkMode: "Dark Mode"
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Real-time overview of your voice agent fleet.",
      totalAgents: "Total Agents",
      activeCalls: "Active Calls",
      totalConversations: "Total Conversations",
      successRate: "Success Rate",
      recentActivity: "Recent Activity",
      platformHealth: "Platform Health",
      operational: "Operational",
      degraded: "Degraded"
    },
    voiceChat: {
      configuration: "Configuration",
      selectAgent: "Select Agent",
      inputDevice: "Input Device",
      defaultMic: "Default Microphone",
      status: "Status",
      duration: "Duration",
      startSession: "Start Session",
      endCall: "End Call",
      simulateSpeech: "Simulate Speech",
      liveTranscript: "Live Transcript",
      listening: "Listening",
      speaking: "Speaking",
      thinking: "Thinking",
      connecting: "Connecting",
      idle: "Idle",
      startPrompt: "Start a session to begin transcription"
    },
    callLogs: {
      title: "Call Logs",
      subtitle: "History of all inbound and outbound calls.",
      exportCsv: "Export CSV",
      table: {
        status: "Status",
        agent: "Agent",
        channel: "Channel",
        duration: "Duration",
        time: "Time",
        actions: "Actions"
      }
    },
    agents: {
      title: "Agents",
      subtitle: "Manage your fleet of voice AI agents.",
      createButton: "Create Agent",
      deployNew: "Deploy New Agent",
      editTitle: "Edit Agent",
      createTitle: "Create Agent",
      nameLabel: "Agent Name",
      statusLabel: "Status",
      voiceConfig: "Voice Configuration",
      voiceProvider: "Voice Provider",
      voiceId: "Voice ID",
      intelligence: "Intelligence",
      llmProvider: "LLM Provider",
      systemPrompt: "System Prompt",
      saveAgent: "Save Agent",
      placeholders: {
        name: "e.g. Support Bot",
        voiceId: "Provider specific Voice ID",
        prompt: "Define the agent's personality..."
      }
    },
    settings: {
      title: "Settings",
      subtitle: "Platform configuration and status.",
      serviceStatus: "Service Integration Status",
      orgConfig: "Organization Configuration",
      orgName: "Organization Name",
      defaultLang: "Default Language",
      webhookUrl: "Webhook Callback URL",
      webhookHint: "Configure this URL in your Telnyx Mission Control Portal.",
      notifications: "Notification Preferences",
      callFailure: "Call Failure Alerts",
      callFailureHint: "Receive emails when calls fail unexpectedly.",
      dailySummary: "Daily Summary",
      dailySummaryHint: "Get a daily report of conversation metrics.",
      saveAll: "Save All Changes",
      language: "Interface Language"
    }
  },
  es: {
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      create: "Crear",
      edit: "Editar",
      status: "Estado",
      actions: "Acciones",
      on: "Encendido",
      off: "Apagado",
      copy: "Copiar"
    },
    nav: {
      brand: "VoiceOrch",
      dashboard: "Panel",
      voiceChat: "Chat de Voz",
      callLogs: "Registros",
      agents: "Agentes",
      settings: "Ajustes",
      lightMode: "Modo Claro",
      darkMode: "Modo Oscuro"
    },
    dashboard: {
      title: "Panel de Control",
      subtitle: "Resumen en tiempo real de su flota de agentes de voz.",
      totalAgents: "Total Agentes",
      activeCalls: "Llamadas Activas",
      totalConversations: "Conversaciones Totales",
      successRate: "Tasa de Éxito",
      recentActivity: "Actividad Reciente",
      platformHealth: "Salud de Plataforma",
      operational: "Operacional",
      degraded: "Degradado"
    },
    voiceChat: {
      configuration: "Configuración",
      selectAgent: "Seleccionar Agente",
      inputDevice: "Dispositivo de Entrada",
      defaultMic: "Micrófono Predeterminado",
      status: "Estado",
      duration: "Duración",
      startSession: "Iniciar Sesión",
      endCall: "Terminar Llamada",
      simulateSpeech: "Simular Habla",
      liveTranscript: "Transcripción en Vivo",
      listening: "Escuchando",
      speaking: "Hablando",
      thinking: "Pensando",
      connecting: "Conectando",
      idle: "Inactivo",
      startPrompt: "Inicie una sesión para comenzar la transcripción"
    },
    callLogs: {
      title: "Registros de Llamadas",
      subtitle: "Historial de todas las llamadas entrantes y salientes.",
      exportCsv: "Exportar CSV",
      table: {
        status: "Estado",
        agent: "Agente",
        channel: "Canal",
        duration: "Duración",
        time: "Hora",
        actions: "Acciones"
      }
    },
    agents: {
      title: "Agentes",
      subtitle: "Administre su flota de agentes de IA de voz.",
      createButton: "Crear Agente",
      deployNew: "Desplegar Nuevo Agente",
      editTitle: "Editar Agente",
      createTitle: "Crear Agente",
      nameLabel: "Nombre del Agente",
      statusLabel: "Estado",
      voiceConfig: "Configuración de Voz",
      voiceProvider: "Proveedor de Voz",
      voiceId: "ID de Voz",
      intelligence: "Inteligencia",
      llmProvider: "Proveedor LLM",
      systemPrompt: "Prompt del Sistema",
      saveAgent: "Guardar Agente",
      placeholders: {
        name: "ej. Bot de Soporte",
        voiceId: "ID de Voz específico",
        prompt: "Defina la personalidad del agente..."
      }
    },
    settings: {
      title: "Ajustes",
      subtitle: "Configuración y estado de la plataforma.",
      serviceStatus: "Estado de Integración de Servicios",
      orgConfig: "Configuración de la Organización",
      orgName: "Nombre de la Organización",
      defaultLang: "Idioma Predeterminado",
      webhookUrl: "URL de Webhook",
      webhookHint: "Configure esta URL en su Portal de Telnyx.",
      notifications: "Preferencias de Notificación",
      callFailure: "Alertas de Fallo de Llamada",
      callFailureHint: "Recibir correos cuando las llamadas fallen.",
      dailySummary: "Resumen Diario",
      dailySummaryHint: "Obtenga un informe diario de métricas.",
      saveAll: "Guardar Cambios",
      language: "Idioma de la Interfaz"
    }
  },
  fr: {
    common: {
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      create: "Créer",
      edit: "Modifier",
      status: "Statut",
      actions: "Actions",
      on: "Marche",
      off: "Arrêt",
      copy: "Copier"
    },
    nav: {
      brand: "VoiceOrch",
      dashboard: "Tableau de bord",
      voiceChat: "Chat Vocal",
      callLogs: "Historique",
      agents: "Agents",
      settings: "Paramètres",
      lightMode: "Mode Clair",
      darkMode: "Mode Sombre"
    },
    dashboard: {
      title: "Tableau de Bord",
      subtitle: "Aperçu en temps réel de votre flotte d'agents vocaux.",
      totalAgents: "Total Agents",
      activeCalls: "Appels Actifs",
      totalConversations: "Total Conversations",
      successRate: "Taux de Réussite",
      recentActivity: "Activité Récente",
      platformHealth: "Santé de la Plateforme",
      operational: "Opérationnel",
      degraded: "Dégradé"
    },
    voiceChat: {
      configuration: "Configuration",
      selectAgent: "Sélectionner Agent",
      inputDevice: "Périphérique d'Entrée",
      defaultMic: "Microphone par défaut",
      status: "Statut",
      duration: "Durée",
      startSession: "Démarrer Session",
      endCall: "Finir l'Appel",
      simulateSpeech: "Simuler Parole",
      liveTranscript: "Transcription en Direct",
      listening: "Écoute",
      speaking: "Parle",
      thinking: "Réfléchit",
      connecting: "Connexion",
      idle: "Inactif",
      startPrompt: "Démarrez une session pour commencer la transcription"
    },
    callLogs: {
      title: "Journaux d'Appels",
      subtitle: "Historique de tous les appels entrants et sortants.",
      exportCsv: "Exporter CSV",
      table: {
        status: "Statut",
        agent: "Agent",
        channel: "Canal",
        duration: "Durée",
        time: "Heure",
        actions: "Actions"
      }
    },
    agents: {
      title: "Agents",
      subtitle: "Gérez votre flotte d'agents vocaux IA.",
      createButton: "Créer Agent",
      deployNew: "Déployer Nouvel Agent",
      editTitle: "Modifier Agent",
      createTitle: "Créer Agent",
      nameLabel: "Nom de l'Agent",
      statusLabel: "Statut",
      voiceConfig: "Configuration Vocale",
      voiceProvider: "Fournisseur Vocal",
      voiceId: "ID Vocal",
      intelligence: "Intelligence",
      llmProvider: "Fournisseur LLM",
      systemPrompt: "Prompt Système",
      saveAgent: "Enregistrer Agent",
      placeholders: {
        name: "ex. Bot Support",
        voiceId: "ID Vocal spécifique",
        prompt: "Définir la personnalité de l'agent..."
      }
    },
    settings: {
      title: "Paramètres",
      subtitle: "Configuration et statut de la plateforme.",
      serviceStatus: "Statut d'Intégration des Services",
      orgConfig: "Configuration de l'Organisation",
      orgName: "Nom de l'Organisation",
      defaultLang: "Langue par Défaut",
      webhookUrl: "URL de Rappel Webhook",
      webhookHint: "Configurez cette URL dans votre portail Telnyx.",
      notifications: "Préférences de Notification",
      callFailure: "Alertas Échec Appel",
      callFailureHint: "Recevoir des emails en cas d'échec.",
      dailySummary: "Résumé Quotidien",
      dailySummaryHint: "Recevez un rapport quotidien des métriques.",
      saveAll: "Enregistrer Tout",
      language: "Langue de l'interface"
    }
  }
};
