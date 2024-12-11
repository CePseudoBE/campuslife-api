import router from '@adonisjs/core/services/router'

import './routes/waypoints.js'
import './routes/tag.js'
import './routes/collection.js'
import './routes/log.js'
import './routes/reports.js'
import './routes/stib.js'
import './routes/services.js'
import './routes/address.js'
import './routes/event.js'
const HealthChecksController = () => import('#adapters/controllers/health_checks_controller')

// Route d'accueil pour tester l'API
router.get('/', [HealthChecksController])
