/**
 * Some ts errors may have been ignored in this file, mostly because this
 * is not a production file, and it's only used for generating mock data
 */
import { z } from 'zod'
import { generateMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
// @ts-ignore - so that it doesn't complain about the import
import fs from 'fs'
import { uniqBy } from 'lodash'

const markets = [
    {
      "id": "b9e9183e-09f7-4c61-9c93-e5a5b4dcca9c",
      "country": "Kenya",
      "currency": "KSH",
      "name": "Kenya",
      "status": "ACTIVE"
    },
    {
      "id": "945db7bd-8c46-4b1f-97c6-ecbface05409",
      "country": "United States",
      "currency": "USD",
      "name": "United States",
      "status": "ACTIVE"
    },
    {
      "id": "0cb3742f-3ae0-4a38-b341-008f7b3e2942",
      "country": "Great Britain",
      "currency": "GBP",
      "name": "United Kingdom",
      "status": "ACTIVE"
    },
    {
      "id": "e7ae23ad-5737-42a7-9416-fc692a4f7877",
      "country": "South Africa",
      "currency": "ZSD",
      "name": "South Africa",
      "status": "ACTIVE"
    },
    {
      "id": "d448cdc9-9077-42b6-9121-92ce03d8eae2",
      "country": "Thailand",
      "currency": "THB",
      "name": "Thailand",
      "status": "ACTIVE"
    },
    {
        "id": "ea2cb0ec-57a3-4c7a-8a84-5ed2e654ab20",
        "country": "Canada",
        "currency": "CAD",
        "name": "Canada",
        "status": "ACTIVE"
    }
]

const submarket_schema = (market_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        market_id: z.enum(market_ids),
        name: z.string().min(1).max(50),
    })
}

// @ts-ignore
const submarkets = generateMock(submarket_schema(markets.map(m => m.id) as [string]).array().length(10), {
    stringMap: {
        name: () => faker.address.city()
    }
})

const user_schema = (market_ids: [string], submarket_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        fname: z.string().min(1).max(50),
        lname: z.string().min(1).max(50),
        email: z.string().email(),
        handle: z.string().min(1).max(50),
        phone: z.string().min(1).max(50),
        profile_pic_url: z.string().url(),
        user_type: z.enum(['HOST', 'CUSTOMER']),
        status: z.enum(['ACTIVE', 'NONACTIVE', 'BANNED', 'SUSPENDED']),
        connected_account_id: z.string().uuid(),// for now, we will use stripe as our payment processor
        customer_id: z.string().uuid(),// for now, we will use stripe as our payment processor
        description: z.string().min(1).max(500),
        uid: z.string().uuid(),
        market_id: z.enum(market_ids),
        sub_market_id: z.enum(submarket_ids),
        is_admin: z.boolean().default(false),
    })
}

let users = generateMock(user_schema(markets.map(m => m.id) as [string], submarkets.map((s: { id: any }) => s.id) as [string]).array().length(10), {
    stringMap: {
        fname: () => faker.name.firstName(),
        lname: () => faker.name.lastName(),
        email: () => faker.internet.email(),
        handle: () => faker.internet.userName(),
        phone: () => faker.phone.number(),
        profile_pic_url: () => faker.image.avatar(),
        description: () => faker.lorem.paragraph(),
    }
})

users = users.map((user: { user_type: string })=>{
    return {
        ...user,
        is_admin: user.user_type === 'HOST' ? true : false // for testing all hosts, can be admins, changes can be made on this line to change the admin status
    }
}) as any


const invitation_schema = (host_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        code: z.string().min(1).max(50),
        expires_at: z.date().min(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7)),
        uid: z.string().uuid(),
        activated: z.boolean().default(false),
        sender_id: z.enum(host_ids),
    })
}

const invitations = generateMock(invitation_schema(users.filter((u: { user_type: string }) => u.user_type === 'HOST').map((h: { id: any }) => h.id) as [string]).array().length(50), {
    stringMap: {
        email: () => faker.internet.email(),
        code: () => faker.random.alphaNumeric(10),
    }
})

const customer_ids = users.filter((u: { user_type: string }) => u.user_type === 'CUSTOMER').map((c: { id: any }) => c.id)
const user_ids = users.map((c: { id: any }) => c.id)

const settings_schema = (user_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        notifications_enabled: z.boolean(),
        sms_enabled: z.boolean(),
        tracking_enabled: z.boolean(),
        authcode_enabled: z.boolean(),
        user_id: z.enum(user_ids),
    })
}

const settings = generateMock(settings_schema(user_ids as [string]).array().length(user_ids.length))

const driver_credentials_schema = (customer_ids: [string]) => z.object({
    id: z.string().uuid(),
    user_id: z.enum(customer_ids),
    drivers_licence_front: z.string().url(),
    drivers_licence_back: z.string().url(),
    drivers_licence: z.string(),
    is_verified: z.boolean(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
    driver_license_expiry: z.date(),
})
// since its random, we need to double the length of the array
const driver_credentials = generateMock(driver_credentials_schema(customer_ids as [string]).array().length(50))

const payment_types_schema = (customer_ids: [string]) => z.object({
    id: z.string().uuid(),
    user_id: z.enum(customer_ids),
    status: z.enum(['ACTIVE', 'NONACTIVE']),
    details: z.object({
        last4: z.number().min(4000).max(9999).transform((v) => v.toString()),
    }),
    stripe_payment_method_id: z.string().uuid(),
    type: z.enum(['STRIPE', 'MPESA', 'PAYPAL', 'MTN', 'CASH']), // will change this to a string instead, due to the fact that other payment methods will continue to be added and enum will not be able to handle that
    phone_number: z.number().min(400000000).max(999999999)
})

const payment_types = generateMock(payment_types_schema(customer_ids as [string]).required().array().length(50))// since its random, we need to double the length of the array


const stations_schema = (host_ids: [string], submarket_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(50),
        description: z.string().min(1).max(500),
        image: z.string().url(),
        sub_market_id: z.enum(submarket_ids),
        user_id: z.enum(host_ids),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
    })
}

const hosts = users.filter((u: { user_type: string }) => u.user_type === 'HOST')
const host_submarkets = hosts.map((h: { sub_market_id: any }) => h.sub_market_id)
const host_ids = hosts.map((h: { id: any }) => h.id)

const stations = generateMock(stations_schema(host_ids as [string], host_submarkets as [string]).array().length(10), {
    stringMap: {
        image: faker.image.city
    }
})


const vehicle_schema = (host_ids: [string], station_ids: [string]) => {
    return z.object({
        id: z.string().uuid(),
        user_id: z.enum(host_ids),
        station_id: z.enum(station_ids),
        color: z.enum(['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'brown', 'grey']),
        seats: z.number().min(1).max(10),
        plate: z.string().min(1).max(50),
        make: z.string().min(1).max(50),
        model: z.string().min(1).max(50),
        year: z.number().min(1900).max(2021),
        hourly_rate: z.number().min(1).max(100),
        status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
        tracking_device_id: z.string().uuid(), // should be a phone number, but this is just a mock,
        pictures: z.array(z.string().url()).length(4), // this is actually a link between vehicle pictures and vehicle through a foreign key, but for mocking this whould work
        transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'DUAL_CLUTCH', 'CONTINUOUSLY_VARIABLE', 'DIRECT_DRIVE', 'ELECTRIC']),
    })
}

const vehicles = generateMock(vehicle_schema(host_ids as [string], stations.map((s: { id: any }) => s.id) as [string]).array().length(20), {
    stringMap: {
        pictures: faker.image.transport,
        make: faker.vehicle.manufacturer,
        model: faker.vehicle.model,
        plate: faker.vehicle.vrm,
        color: faker.vehicle.color,

    }
})

const vehicle_ids = vehicles.map((v: { id: any }) => v.id)


const reservations_schema = (customer_ids: [string], vehicle_ids: [string]) => z.object({
    id: z.string().uuid(),
    user_id: z.enum(customer_ids),
    vehicle_id: z.enum(vehicle_ids),
    start_date_time: z.date().max(new Date()).min(new Date(new Date().getTime() - 1000 * 60 * 60 * 3)),
    end_date_time: z.date().min(new Date()).max(new Date(new Date().getTime() + 1000 * 60 * 60 * 10)),
    type: z.enum(['HOURLY']),
    status: z.enum(['COMPLETE', 'ACTIVE', 'UPCOMING', 'CANCELLED', 'OTHER']),
})

const reservations = generateMock(reservations_schema(customer_ids as [string], vehicle_ids as [string]).array().length(20))

const qn1 = 'Is available and present at location?'
const qn2 = 'Any vehicle damage?'
const qn3 = 'Any vehicle scratches?'

const inspection_schema = (reservation_ids: [string]) => z.object({
    id: z.string().uuid(),
    reservation_id: z.enum(reservation_ids),
    fuel: z.number().min(0).max(65),
    questions: z.object({
        index: z.number().min(1).max(3),
        question: z.enum([qn1, qn2, qn3]),
        option: z.enum(['yes', 'no']),
        description: z.string().min(30).max(500),
        images: z.array(z.string().url()).length(4)
    }).array().length(3),
    created_at: z.date().min(new Date()),
    updated_at: z.date().min(new Date()),
})

const issuesSchema = z.object({
    id: z.string().uuid(),
    user_id: z.enum(customer_ids as [string]),
    complaint: z.string().min(200).max(500),
})

const issues = generateMock(issuesSchema.array().length(50))

const inspections = generateMock(inspection_schema(reservations.map((r: { id: any }) => r.id) as [string]).array().length(500))

const payments_schema = (reservation_ids: [string], payment_type_ids: [string]) => z.object({
    id: z.string().uuid(),
    payment_type: z.enum(payment_type_ids),
    account_number: z.string().length(16),
    authorization_code: z.string().length(6),
    paymentToken: z.string().uuid(),
    amount: z.number().min(20).max(1000),
    tax: z.number().min(1).max(100),
    date_time: z.date().min(new Date()),
    status: z.enum(['COMPLETE', 'ACTIVE', 'UPCOMING', 'CANCELLED', 'OTHER']),
    stripe_payment_id: z.string().uuid(),
    user_id: z.string().uuid(),
    reservation_id: z.enum(reservation_ids),
})

const reservation_ids = reservations.map((r: { id: any }) => r.id)
const payment_type_ids = payment_types.map((p: { id: any }) => p.id)

const payments = generateMock(payments_schema(reservation_ids as [string], payment_type_ids as [string]).array().length(20))


const auth_code_schema = ( host_ids: [string], customer_ids: [string], vehicle_ids: [string] ) => z.object({
    id: z.string().uuid(),
    host_id: z.enum(host_ids),
    user_id: z.enum(customer_ids),
    code: z.string().length(6),
    vehicle_id: z.enum(vehicle_ids),
    status: z.enum(['ACTIVE', 'EXPIRED', 'REVOKED', 'NONACTIVE', "INACTIVE"]),
    expiry_date_time: z.date().min(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7)),
})

const auth_codes = generateMock(auth_code_schema(host_ids as [string], customer_ids as [string], vehicle_ids as [string]).array().length(20))


const payout_methods_schema = (host_ids: [string]) => z.object({
    id: z.string().uuid(),
    user_id: z.enum(host_ids),
    connected_account_id: z.string().uuid().optional(),
    mobile_money_number: z.string().min(1).max(9).optional(),
    paypal_email: z.string().email().optional(),
    type: z.enum(['BANK_ACCOUNT', 'MPESA', 'PAYPAL']),
    verified: z.boolean(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
})

const payout_methods = generateMock(payout_methods_schema(host_ids as [string]).array().length(20))


const payouts_schema = (host_ids: [string], payout_method_ids: [string]) => z.object({
    id: z.string().uuid(),
    user_id: z.enum(host_ids),
    amount: z.number().min(1).max(1000),
    date: z.date().min(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)),
    status: z.enum(['COMPLETE', 'DENIED', 'INCOMPLETE', 'SUCCESS', 'HOLD']),
    payout_method_id: z.enum(payout_method_ids),
})

const payout_method_ids = payout_methods.map((p: { id: any }) => p.id)

const payouts = generateMock(payouts_schema(host_ids as [string], payout_method_ids as [string]).array().length(30))



const all_data = {
    markets,
    submarkets,
    users: users.map((user: { user_type: string; id: any; market_id: string; sub_market_id: any })=>{
        if(user.user_type === "HOST") {
            return {
                ...user,
                PayoutMethods: payout_methods.filter((p: { user_id: any }) => p.user_id === user.id),
                market: markets.find(m => m.id === user.market_id),
                sub_market: submarkets.find((s: { id: any }) => s.id === user.sub_market_id),
                sent_invites: invitations.filter((i: { sender_id: any }) => i.sender_id === user.id),
                user_settings: settings.find((s: { user_id: any }) => s.user_id === user.id),
            }
        }else {
            return {
                ...user,
                user_settings: settings.find((s: { user_id: any }) => s.user_id === user.id),
                DriverCredentials: driver_credentials.find((d: { user_id: any }) => d.user_id === user.id),
                market: markets.find(m => m.id === user.market_id),
                sub_market: submarkets.find((s: { id: any }) => s.id === user.sub_market_id),
                payment_types: uniqBy(payment_types.filter((p: { user_id: any }) => p.user_id === user.id).map((pt, i)=>{
                    return {
                        ...pt,
                        is_primary: i === 0
                    }   
                }), ({type})=>type),

            }
        }
    }),
    stations: stations.map((station: { sub_market_id: any })=>{
        return {
            ...station,
            sub_market: {
                ...submarkets.find((s: { id: any }) => s.id === station.sub_market_id),
            }
        }
    }),
    vehicles: vehicles.map((vehicle: { user_id: any; pictures: any; station_id: any })=>{
        return {
            ...vehicle,
            host: {
                ...users.find((u: { id: any }) => u.id === vehicle.user_id),
                market: markets.find((m)=>{
                    return m.id === users.find((u: { id: any }) => u.id === vehicle.user_id)?.market_id
                }),
                sub_market: submarkets.find((s: { id: any })=>{
                    return s.id === users.find((u: { id: any }) => u.id === vehicle.user_id)?.sub_market_id
                })
            },
            VehiclePictures: vehicle.pictures,
            station: {
                ...stations.find((s: { id: any }) => s.id === vehicle.station_id),
                market: markets.find((m)=>{
                    return m.id === users.find((u: { id: any }) => u.id === vehicle.user_id)?.market_id
                }),
                sub_market: submarkets.find((s: { id: any })=>{
                    return s.id === stations.find((s: { id: any }) => s.id === vehicle.station_id)?.sub_market_id
                })
            },
        }
    }),
    reservations: reservations.map((reservation: { vehicle_id: any; user_id: any; id: any })=>{
        return {
            ...reservation,
            vehicle: {
                ...vehicles.find((v: { id: any }) => v.id === reservation.vehicle_id),
                host: {
                    ...users.find((u: { id: any }) => u.id === vehicles.find((v: { id: any }) => v.id === reservation.vehicle_id)?.user_id),
                    market: {
                        ...markets.find((m)=>{
                            return (
                                users.find((u: { id: any })=> u.id === vehicles.find((v: { id: any }) => v.id === reservation.vehicle_id)?.user_id)?.market_id === m.id
                            )
                        })
                    }
                },
                station: {
                    ...stations.find((s: { id: any }) => s.id === vehicles.find((v: { id: any }) => v.id === reservation.vehicle_id)?.station_id),
                    market: {
                        ...markets.find((m)=>{
                            return (
                                users.find((u: { id: any })=> u.id === reservation.user_id)?.market_id === m.id
                            )
                        })
                    },
                    sub_market: {
                        ...submarkets.find((s: { id: any }) => s.id === stations.find((s: { id: any }) => s.id === vehicles.find((v: { id: any }) => v.id === reservation.vehicle_id)?.station_id)?.sub_market_id),
                    }
                },
                VehiclePictures: vehicles.find((v: { id: any }) => v.id === reservation.vehicle_id)?.pictures,
            },
            payment: {
                ...payments.find((p: { reservation_id: any }) => p.reservation_id === reservation.id),
                payment_type_fk: (()=>{
                    const payment = payments.find((p: { reservation_id: any }) => p.reservation_id === reservation.id)
                    return {
                        ...payment_types.find((p: { id: any }) => p.id === payment?.payment_type),
                    }
                })()
            },
            user: users.find((u: { id: any }) => u.id === reservation.user_id),
            inspection: inspections.find((i: { reservation_id: any }) => i.reservation_id === reservation.id),
            inspection_id: inspections.find((i: { reservation_id: any }) => i.reservation_id === reservation.id)?.id,
        }
    }),
    calendar: reservations.map((reservation: { id: string; start_date_time: any; end_date_time: any; vehicle_id: any })=>{
        return {
            id: reservation.id,
            start: reservation.start_date_time,
            end: reservation.end_date_time,
            resourceId: reservation.vehicle_id,
            title: "Reservation " + reservation.id,
            color: faker.color.human().replace('red', 'blue').replace('white', 'pink').replace('black', 'tomato')
        }
    }),
    calendar_resources: uniqBy(reservations.map((reservation: { vehicle_id: any })=>{
        const vehicle = vehicles.find(({id})=>id === reservation.vehicle_id)
        return {
            id: reservation.vehicle_id,
            title: ` ${vehicle?.make} ${vehicle?.model} `
        }
    }), ({id})=> id),
    payments,
    auth_codes: auth_codes.map((auth_code: { user_id: any })=>{
        return {
            ...auth_code,
            user: {
                ...users?.find((u: { id: any })=>u.id === auth_code.user_id),
            }
        }
    }),
    payout_methods,
    payouts,
    payment_types,
    settings,
    driver_credentials,
    invitations,
    inspections,
    issues
}


console.log("Done generating data")

fs.writeFileSync('mock/db.json', JSON.stringify(all_data), {
    encoding: 'utf-8',
})
console.log("Done writing data to file")
export {}