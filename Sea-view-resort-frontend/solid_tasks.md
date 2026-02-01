Tareas de arquitectura (para abordar más adelante)

[x] 1) Extraer Modal base reutilizable
- [x] Crear `src/components/ui/Modal.jsx` (overlay, portal, cierre, tamaños, accesibilidad básica)
- [x] Refactorizar: `components/booking/AvailabilityModal.jsx`, `components/booking/SuccessModal.jsx`, `components/modal/VideoModal.jsx`, `components/auth/LoginRequiredModal.jsx` para componer el modal base

[x] 2) Unificar formato y utilidades
- [x] Crear `src/lib/formatters.js` con `formatDate`, `formatPrice`
- [x] Reemplazar duplicados en modales y otros componentes

[x] 3) Hero genérico
- [x] Crear `src/components/hero/Hero.jsx` con props (`backgroundImage|backgroundVideo`, `overlay`, `title`, `subtitle`, `children`)
- [x] Adaptar `AboutHero`, `ContactHero`, `RoomsHero`, `HomeHero`, `ExploreHero` a wrappers del `Hero`

[ ] 4) Servicios y hooks de dominio
- [ ] Crear `src/services/bookingService.js` y/o `src/hooks/useAvailability.js` para encapsular búsqueda/confirmación y utilidades (`calculateNights`, `generateAvailableDates`)
- [ ] UI (`SearchFilters`, `BookingSidebar`) debe depender de estos servicios/hooks

[x] 5) Componentizar filtros de búsqueda
- [x] Partir `SearchFilters` en subcomponentes: `DestinationSelect`, `RoomTypeSelect`, `GuestsSelect`, `DateRangePicker`
- [x] Ubicarlos en `src/components/search/`

[ ] 6) Widget flotante genérico
- [ ] Crear `src/components/widgets/FloatingActionButton.jsx`
- [ ] Hacer que el botón del chat lo utilice

[ ] 7) Spinner/Loader unificado
- [ ] Crear `src/components/ui/Spinner.jsx`
- [ ] Usarlo en modales y pantallas con estados de carga

[ ] 8) Normalizar rutas y nombres
- [ ] Asegurar PascalCase en componentes y folders de features (`Chatbot`, `ChatbotWidget` ya corregidos)
- [ ] Revisar consistencia de import paths relativos entre folders hermanos

[ ] 9) Revisar exposición de herramientas internas
- [ ] Mover `src/pages/ImageOptimizer.jsx` a `src/pages/admin/ImageOptimizer.jsx` o `src/tools/ImageOptimizer.jsx` y proteger con auth si es ruta

[ ] 10) Consistencia de servicios HTTP
- [ ] Centralizar llamadas en `src/services/` (ej.: `app.js` y `chatService.js`)
- [ ] Evaluar crear un cliente HTTP común (axios instance) y manejo de errores


