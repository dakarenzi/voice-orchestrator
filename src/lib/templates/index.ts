
import retail from './retail-support.json'; // using default import if json module resolve is enabled, else require
import healthcare from './healthcare-scheduling.json';
import realestate from './realestate-qualification.json';
import saas from './saas-outbound-demo.json';
import education from './education-student-faq.json';
import restaurant from './restaurant-reservations.json';
import legal from './legal-consultation-scheduler.json';
import ecommerce from './ecommerce-order-tracking.json';
import automotive from './automotive-service-booking.json';
import financial from './financial-loan-prequal.json';
import hospitality from './hospitality-hotel-booking.json';
import fitness from './fitness-class-booking.json';
import insurance from './insurance-claims.json';
import travel from './travel-booking.json';
import nonprofit from './nonprofit-support.json';
import ecommerceVoice from './ecommerce-support-voice.json';

// Note: Ensure tsconfig.json has "resolveJsonModule": true

export const templates = [
    retail,
    healthcare,
    realestate,
    saas,
    education,
    restaurant,
    legal,
    ecommerce,
    automotive,
    financial,
    hospitality,
    fitness,
    insurance,
    travel,
    nonprofit,
    ecommerceVoice
];
