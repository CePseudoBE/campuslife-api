import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'

// Importation des contrôleurs pour les événements
const CreateEventController = async () =>
  await import('#controllers/events/create_event_controller')
const UpdateEventController = async () =>
  await import('#controllers/events/update_event_controller')
const DeleteEventController = async () =>
  await import('#controllers/events/delete_event_controller')
const FindByIdEventController = async () =>
  await import('#controllers/events/find_by_id_event_controller')
const FindEventsController = async () => await import('#controllers/events/find_events_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateEventController]).as('create_event')
        router.patch(':id', [UpdateEventController]).as('update_event')
        router.delete(':id', [DeleteEventController]).as('delete_event')
        router.get(':id', [FindByIdEventController]).as('get_event')
        router.get('', [FindEventsController]).as('get_events')
      })
      .prefix('events')
  })
  .prefix('api')
