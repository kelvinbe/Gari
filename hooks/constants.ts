import { API_URL, TRACKING_SERVICE_HOST as t_host } from "@env";
import Constants from "expo-constants";
const { manifest } = Constants;

// Api Endpoints
export const DOMAIN = API_URL

export const BACKEND_DOMAIN = API_URL

export const ADD_CARD_ENDPOINT = DOMAIN + "/api/card";

export const DELETE_CARD_ENDPOINT = DOMAIN + "/api/card/1";

export const CANCEL_BOOKING_ENDPOINT = DOMAIN + "/api/cancel";

export const CREATE_PASSWORD_ENDPOINT = DOMAIN + "/api/password";

export const EDIT_PROFILE_ENDPOINT = DOMAIN + "/api/profile";

export const EXTEND_RESERVATION_ENDPOINT = DOMAIN + "/api/extendReservation";

export const FETCH_DATA_ENDPOINT = DOMAIN + "/api/init";

export const FETCH_HISTORY_ENDPOINT = DOMAIN + "/api/history";

export const FORGOT_PASSWORD_ENDPOINT = DOMAIN + "/api/forgotPassword";

export const MODIFY_BOOKING_ENDPOINT = DOMAIN + "/api/modify";

export const REGISTER = DOMAIN + "/api/register";

export const REPORT_ISSUE_ENDPOINT = DOMAIN + "/api/issues";

/**
 * @description - base route for all reservation related endpoints
 */
export const RESERVATIONS_ENDPOINT = DOMAIN + '/api/reservations';

/**
 * @description - base route for all vehicle related endpoints
 */
export const VEHICLES_ENDPOINT = DOMAIN + '/api/vehicles';

export const RESERVE_ENDPOINT = DOMAIN + "/api/reserve";

export const SEARCH_BY_HOST_ENDPOINT = DOMAIN + "/api/searchHost";

export const SEARCH_LOCALLY_ENDPOINT = DOMAIN + "/api/searchLocally";

export const SET_PAYMENT_ENDPOINT = DOMAIN + "/api/payment";

export const FETCH_PAYMENT_METHODS_ENDPOINT = DOMAIN + "/api/paymentMethods";

export const DELETE_PAYMENT_METHOD_ENDPOINT = DOMAIN + "/api/paymentMethods/1";

/**
 * @description - for all settings related endpoints
 */
export const SETTINGS_ENDPOINT = DOMAIN + '/api/settings';

/**
 * @description - for all auth code related endpoints
 */
export const AUTH_CODE_ENDPOINT = DOMAIN + '/api/authcodes';

/**
 * @description - request a new auth code
 */
export const REQUEST_AUTH_CODE_ENDPOINT = AUTH_CODE_ENDPOINT + '/request';


export const SEND_MAIL_ENDPOINT = DOMAIN + "/api/mail/send/message";

export const SEND_TEMPLETE_MAIL_ENDPOINT = DOMAIN + "/api/mail/send/template"; 

export const FETCH_UPCOMING_RESERVATIONS_ENDPOINT = DOMAIN + "/api/upcomingReservations"; 

export const FETCH_HOSTS_VEHICLE_ENDPOINT = DOMAIN + "/api/host"; 

export const SEND_NOTIFICATION_TOKEN_ENDPOINT = DOMAIN + "/api/notifications"; 

export const FETCH_NOTIFICATION_ENDPOINT = DOMAIN + "/api/notifications";

export const SET_VEHICLE_INSPECTION_ENDPOINT = DOMAIN + "/api/vehicleInspection"; 

export const END_RESERVATION_ENDPOINT = DOMAIN + "/api/endReservation/2"; 

export const FETCH_USER_AGREEMENT_ENDPOINT = DOMAIN + '/api/userAgreement';

export const FETCH_PRIVACY_POLICY_ENDPOINT = DOMAIN + '/api/privacy_policy';

export const FETCH_SUPPORT_ENDPOINT = DOMAIN + '/api/support';

export const SET_DRIVERS_LICENCE_ENDPOINT = DOMAIN + '/api/driversLicense';

export const FETCH_DRIVERS_LICENSE_ENDPOINT = DOMAIN + '/api/driversLicense/1';

/**
 * @descrtiption - for all driver credentials related endpoints
 */
export const DRIVER_CREDENTIALS_ENDPOINT = DOMAIN + '/api/users/drivercredentials';

/**
 * @description - for tracking the user's onboarding flow
 *                I'm thinking of using this single endpoint for tracking what steps are complete and what are not
 */
export const FETCH_ONBOARDING = DOMAIN + '/api/users/onboarding';

/**
 * @description - markets(countries) this endpoint will fetch the markets(countries) the user can choose from
 */
export const FETCH_MARKETS = DOMAIN + '/api/location/markets';

/**
 * @description - submarkets(cities) this endpoint will fetch the submarkets(cities) the user can choose from
 */
export const FETCH_SUBMARKETS = DOMAIN + '/api/location/submarkets';

/**
 * @description - this is the base enpoint for the user related endpoints
 */
export const USER_ENDPOINT = DOMAIN + '/api/users';

/**
 * @description - add payment method
 */
export const PAYMENT_METHOD_ENDPOINT = DOMAIN + '/api/paymenttypes';

/**
 * @description - add a push notification token to a user
 */
export const PUSH_NOTIFICATION_TOKEN_ENDPOINT = DOMAIN + '/api/settings/tokens';

/**
 * @description - this endpoint will be removed eventually, however, since some parts of the application still use it, it will remain for now
 */
export const FETCH_AVAILABLE_VEHICLES = DOMAIN + '/api/availableVehicles'

/**
 * @description - payment endpoint
 */
export const PAYMENT_ENDPOINT = DOMAIN + '/api/payments';

/**
 * @description - this is the base endpoint for issues
 */
export const ISSUES_ENDPOINT = DOMAIN + '/api/issues';


/**
 * @description - The tracking service host, to be used for the tracking websockets,
 * for testing, i.e until we get a valid https certificate, we will use ngrok
 */

export const TRACKING_SERVICE_HOST = t_host

