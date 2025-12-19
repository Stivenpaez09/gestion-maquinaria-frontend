# Sistema de Gestión de Maquinaria – Frontend
Frontend corporativo del sistema de Gestión de Maquinaria y Mantenimiento, desarrollado con Angular y Tailwind CSS, enfocado en seguridad, escalabilidad, experiencia de usuario y control por roles.

Esta aplicación consume un backend REST desarrollado en Django Rest Framework y está diseñada para entornos empresariales donde múltiples perfiles interactúan con información crítica de operación y mantenimiento.

## Enfoque del Frontend
El frontend fue diseñado como una Single Page Application (SPA) moderna, aplicando buenas prácticas de arquitectura Angular y una separación clara de responsabilidades.

Se priorizó:
* Seguridad en rutas y vistas
* Control estricto por rol
* UX optimizada para uso prolongado
* Diseño oscuro para reducir fatiga visual
* Código mantenible y escalable

## Objetivo del Sistema
Proveer una interfaz clara, segura y eficiente para:
* Administrar maquinaria y proyectos
* Registrar horas de operación
* Ejecutar y controlar mantenimientos
* Visualizar alertas y estados operativos
* Garantizar que cada usuario solo acceda a lo que le corresponde

## Diseño y Experiencia de Usuario (UX)
* Modo oscuro implementado por defecto para reducir fatiga visual.
* UI limpia, corporativa y orientada a productividad.
* Uso de Tailwind CSS (sin hojas de estilo tradicionales).
* Componentes reutilizables.
* Iconografía tomada de Phosphor Icons para consistencia visual.

## Arquitectura del Proyecto
El proyecto está estructurado siguiendo principios de arquitectura modular, separando núcleo, funcionalidades y componentes compartidos.

### Estructura General
src/
 ├── core/
 │   ├── guards/        → Protección de rutas por rol y permisos
 │   ├── interceptors/  → Inyección automática del token JWT
 │   ├── models/        → Modelos de datos de la aplicación
 │   ├── services/      → Servicios HTTP hacia el backend
 │   └── utiles/        → Servicios reutilizables globales
 │
 ├── features/
 │   ├── admin/
 │   ├── logins/
 │   ├── operador/
 │   ├── responsable/
 │   └── tecnico/
 │
 ├── shared/
 │   └── components/
 │       ├── sidebar-admin/
 │       ├── sidebar-operador/
 │       ├── sidebar-responsable/
 │       └── sidebar-tecnico/
 │
 ├── assets/
 │   └── images/
 │
 └── environments/
     ├── environment.ts
     └── environment.prod.ts

## Gestión de Roles en el Frontend
El frontend está dividido por dominios funcionales según el rol del usuario:

### Roles Implementados
* Administrador
* Responsable de mantenimiento
* Operador
* Técnico de mantenimiento

Cada rol cuenta con:
* Rutas protegidas mediante Guards
* Sidebar específico
* Vistas alineadas con los permisos definidos en el backend
* Restricción total de acceso a funcionalidades no autorizadas

## Seguridad Frontend
* Autenticación basada en JWT.
* Interceptor HTTP que adjunta automáticamente el token a cada petición.
* Guards que validan:
    * Sesión activa
    * Rol del usuario
    * Permisos de acceso
    * Manejo seguro del token usando cookies / almacenamiento controlado.

## Comunicación con el Backend
* Consumo de API REST desarrollada en Django Rest Framework.
* Servicios Angular centralizados.
* Modelos tipados para mayor robustez.
* Manejo de errores y estados de carga.

### Backend
https://gestion-maquinaria-backend.onrender.com

## Despliegue
* Plataforma: Vercel
* Tipo: SPA Angular optimizada para producción
* URL pública: https://gestion-maquinaria-frontend.vercel.app/

## Stack Tecnológico

### Frontend
* Angular 20
* TypeScript
* Tailwind CSS
* DaisyUI
* Angular Material (CDK)
* RxJS

### Seguridad
* JWT
* Guards
* HTTP Interceptors

### UI
* Phosphor Icons
* Diseño oscuro corporativo

## Instalación y Ejecución Local
npm install
ng serve

Accede a:
http://localhost:4200

## Repositorio
GitHub: https://github.com/Stivenpaez09/gestion-maquinaria-frontend

## Autor
Stiven Páez
Frontend / Full Stack Developer
Angular · TypeScript · Tailwind CSS · JWT · UX Empresarial
