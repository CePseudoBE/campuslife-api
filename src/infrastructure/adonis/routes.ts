import router from '@adonisjs/core/services/router'

import './routes/waypoints.js'
import './routes/tag.js'
import './routes/collection.js'
import './routes/log.js'
import './routes/reports.js'
import './routes/stib.js'
const HealthChecksController = () => import('#controllers/health_checks_controller')

// Route d'accueil pour tester l'API
router.get('/', [HealthChecksController])
